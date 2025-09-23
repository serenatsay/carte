import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildMenuParsingSystemPrompt, buildMenuParsingUserPrompt } from "@/lib/claudePrompt";
import { ParsedMenu, MenuSection } from "@/lib/types";

export const runtime = "edge";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Function to merge multiple parsed menus into one
function mergeMenus(menus: ParsedMenu[]): ParsedMenu {
  if (menus.length === 0) {
    throw new Error("No menus to merge");
  }

  if (menus.length === 1) {
    return menus[0];
  }

  const mergedMenu: ParsedMenu = {
    originalLanguage: menus[0].originalLanguage,
    translatedLanguage: menus[0].translatedLanguage,
    sections: []
  };

  // Group sections by title for merging
  const sectionMap = new Map<string, MenuSection>();

  menus.forEach((menu, menuIndex) => {
    menu.sections.forEach((section) => {
      const sectionKey = section.translatedTitle || section.originalTitle || `Section_${menuIndex}`;

      if (sectionMap.has(sectionKey)) {
        // Merge items into existing section
        const existingSection = sectionMap.get(sectionKey)!;
        existingSection.items.push(...section.items);
      } else {
        // Create new section with unique ID
        const newSection: MenuSection = {
          id: `${section.id}_${menuIndex}`,
          originalTitle: section.originalTitle,
          translatedTitle: section.translatedTitle,
          items: section.items.map(item => ({
            ...item,
            id: `${item.id}_${menuIndex}` // Ensure unique item IDs
          }))
        };
        sectionMap.set(sectionKey, newSection);
      }
    });
  });

  mergedMenu.sections = Array.from(sectionMap.values());
  return mergedMenu;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { images, preferredLanguage = "English" } = body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({
        ok: false,
        error: "No images provided"
      });
    }

    const menus: ParsedMenu[] = [];

    // Process each image
    for (let i = 0; i < images.length; i++) {
      const imageData = images[i];

      // Extract media type and base64 data
      const [header, base64Data] = imageData.split(',');
      const mediaTypeMatch = header.match(/data:([^;]+)/);
      const mediaType = mediaTypeMatch ? mediaTypeMatch[1] : 'image/jpeg';

      const systemPrompt = buildMenuParsingSystemPrompt();
      const userPrompt = buildMenuParsingUserPrompt(preferredLanguage);

      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: userPrompt
              },
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                  data: base64Data
                }
              }
            ]
          }
        ]
      });

      if (message.content[0].type === "text") {
        try {
          const parsedMenu = JSON.parse(message.content[0].text) as ParsedMenu;

          // Add page identifier to section and item IDs
          parsedMenu.sections = parsedMenu.sections.map(section => ({
            ...section,
            id: `${section.id}_page${i + 1}`,
            items: section.items.map(item => ({
              ...item,
              id: `${item.id}_page${i + 1}`
            }))
          }));

          menus.push(parsedMenu);
        } catch (parseError) {
          console.error(`Failed to parse menu ${i + 1}:`, parseError);
          return NextResponse.json({
            ok: false,
            error: `Failed to parse menu from image ${i + 1}`
          });
        }
      }
    }

    // Merge all menus into one
    const mergedMenu = mergeMenus(menus);

    return NextResponse.json({
      ok: true,
      menu: mergedMenu
    });

  } catch (error) {
    console.error("Batch parse error:", error);
    return NextResponse.json({
      ok: false,
      error: `Claude request failed: ${error}`
    });
  }
}