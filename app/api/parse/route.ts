import { NextRequest } from "next/server";
import { buildUserPrompt, systemPrompt } from "@/lib/claudePrompt";
import {
  isParsedMenu,
  ParseMenuRequestBody,
  ParseMenuResponseBody,
  ParsedMenu,
} from "@/lib/types";

export const runtime = "edge"; // faster cold starts

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest";

export async function POST(req: NextRequest) {
  try {
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ ok: false, error: "Server missing ANTHROPIC_API_KEY" }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

    const body = (await req.json()) as ParseMenuRequestBody;

    // Extract media type and base64 data
    let mediaType = "image/jpeg"; // default fallback
    let imageBase64 = body.imageBase64;

    if (body.imageBase64?.startsWith("data:")) {
      const [header, data] = body.imageBase64.split(",");
      imageBase64 = data;

      // Extract media type from data URL
      const match = header.match(/data:([^;]+)/);
      if (match) {
        mediaType = match[1];
      }
    }

    // Always try to detect format from base64 header regardless of data URL prefix
    if (imageBase64) {
      // PNG starts with iVBORw0KGgo
      if (imageBase64.startsWith('iVBORw0KGgo')) {
        mediaType = 'image/png';
      }
      // JPEG/JPG variants - more comprehensive check
      else if (imageBase64.startsWith('/9j/') || imageBase64.startsWith('/9k/') || imageBase64.startsWith('iVBOR')) {
        if (imageBase64.startsWith('iVBOR')) {
          mediaType = 'image/png';
        } else {
          mediaType = 'image/jpeg';
        }
      }
      // WebP starts with UklGR
      else if (imageBase64.startsWith('UklGR')) {
        mediaType = 'image/webp';
      }
      // If we can't detect, let Claude try to handle it as JPEG
      else {
        console.log(`⚠️  Unknown image format, base64 starts with: ${imageBase64.substring(0, 20)}`);
        mediaType = 'image/jpeg'; // fallback
      }
    }

    // Debug logging for media type detection
    console.log(`🔍 Media type detected: ${mediaType}`);
    console.log(`📄 Base64 starts with: ${imageBase64?.substring(0, 30)}...`);
    console.log(`📏 Image size estimate: ${imageBase64?.length ? `${Math.round(imageBase64.length * 0.75 / 1024)}KB` : 'unknown'}`);

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ ok: false, error: "imageBase64 is required" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    const preferredLanguage = body.preferredLanguage || "English";

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 8000, // Increased for complex menus
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: buildUserPrompt(preferredLanguage) },
              {
                type: "image",
                source: { type: "base64", media_type: mediaType, data: imageBase64 },
              },
            ],
          },
        ],
      }),
    });

    if (!anthropicRes.ok) {
      const text = await anthropicRes.text();
      console.error(`Claude API Error (${anthropicRes.status}):`, text);
      console.error(`Image size estimate:`, imageBase64?.length ? `${Math.round(imageBase64.length * 0.75 / 1024)}KB` : 'unknown');
      return new Response(
        JSON.stringify({ ok: false, error: `Claude request failed (${anthropicRes.status}): ${text}` }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }

    type AnthropicMessage = { content: Array<{ type: string; text?: string }>; };
    const data = (await anthropicRes.json()) as { content: AnthropicMessage["content"] };
    const textBlock = data.content.find((c) => c.type === "text");
    const text = textBlock?.text || "";

    let parsed: ParsedMenu | null = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Try to extract JSON substring if it included extra text accidentally
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start !== -1 && end !== -1) {
        try { parsed = JSON.parse(text.slice(start, end + 1)); } catch {}
      }
    }

    if (!parsed || !isParsedMenu(parsed)) {
      const resp: ParseMenuResponseBody = { ok: false, error: "Failed to parse structured menu JSON" };
      return new Response(JSON.stringify(resp), { status: 502, headers: { "content-type": "application/json" } });
    }

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      const allItems = parsed.sections.flatMap(section =>
        section.items.map(item => ({
          name: item.translatedName || item.originalName,
          original: item.originalName,
          price: item.price?.amount,
          priceRaw: item.price?.raw,
          section: section.translatedTitle || section.originalTitle
        }))
      );

      console.log("\n=== DETAILED PARSING DEBUG ===");
      console.log(`✓ Total items parsed: ${allItems.length}`);
      console.log(`📂 Sections (${parsed.sections.length}): ${parsed.sections.map(s => s.translatedTitle || s.originalTitle || 'Untitled').join(", ")}`);
      console.log(`🌍 Detected languages: Original="${parsed.originalLanguage}", Target="${parsed.translatedLanguage}"`);

      // Show all parsed items with more detail
      console.log("\n📋 All parsed items with debug info:");
      allItems.forEach((item, i) => {
        const priceStr = item.price ? `€${item.price}` : (item.priceRaw || 'No price');
        console.log(`${i + 1}. "${item.name}" (Original: "${item.original}") - ${priceStr} [${item.section || 'No section'}]`);
      });

      // Show raw section data
      console.log("\n🔍 Raw section structure:");
      parsed.sections.forEach((section, i) => {
        console.log(`Section ${i + 1}: "${section.translatedTitle || section.originalTitle}" (${section.items.length} items)`);
        section.items.slice(0, 3).forEach((item, j) => {
          console.log(`  - ${j + 1}. "${item.originalName}" → "${item.translatedName}"`);
        });
        if (section.items.length > 3) {
          console.log(`  - ... and ${section.items.length - 3} more items`);
        }
      });

      console.log("=== END DEBUG INFO ===\n");
    }

    const resp: ParseMenuResponseBody = { ok: true, menu: parsed };
    return new Response(JSON.stringify(resp), { status: 200, headers: { "content-type": "application/json" } });
  } catch (err: any) {
    const resp: ParseMenuResponseBody = { ok: false, error: err?.message || "Unknown error" };
    return new Response(JSON.stringify(resp), { status: 500, headers: { "content-type": "application/json" } });
  }
}


