import { NextRequest } from "next/server";
import { buildWildcardSystemPrompt, buildWildcardUserPrompt } from "@/lib/wildcardPrompt";
import {
  WildcardOrderRequest,
  WildcardOrderResponse,
  WildcardSelection,
} from "@/lib/types";

export const runtime = "edge";

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

    const body = (await req.json()) as WildcardOrderRequest;

    if (!body.menu || !body.partySize || !body.hungerLevel) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing required fields" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 2000,
        system: buildWildcardSystemPrompt(),
        messages: [
          {
            role: "user",
            content: buildWildcardUserPrompt(body),
          },
        ],
      }),
    });

    if (!anthropicRes.ok) {
      const text = await anthropicRes.text();
      return new Response(
        JSON.stringify({ ok: false, error: `Claude request failed: ${text}` }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }

    type AnthropicMessage = { content: Array<{ type: string; text?: string }>; };
    const data = (await anthropicRes.json()) as { content: AnthropicMessage["content"] };
    const textBlock = data.content.find((c) => c.type === "text");
    const text = textBlock?.text || "";

    let parsed: { selections: WildcardSelection[]; explanation: string } | null = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Try to extract JSON substring if it included extra text
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start !== -1 && end !== -1) {
        try {
          parsed = JSON.parse(text.slice(start, end + 1));
        } catch {}
      }
    }

    if (!parsed || !parsed.selections || !Array.isArray(parsed.selections)) {
      const resp: WildcardOrderResponse = {
        ok: false,
        error: "Failed to parse wildcard recommendations"
      };
      return new Response(JSON.stringify(resp), {
        status: 502,
        headers: { "content-type": "application/json" }
      });
    }

    // Validate that all item IDs exist in the menu
    const allItemIds = new Set<string>();
    for (const section of body.menu.sections) {
      for (const item of section.items) {
        allItemIds.add(item.id);
      }
    }

    const validSelections = parsed.selections.filter(selection =>
      allItemIds.has(selection.itemId)
    );

    if (validSelections.length === 0) {
      const resp: WildcardOrderResponse = {
        ok: false,
        error: "No valid menu items found in recommendations"
      };
      return new Response(JSON.stringify(resp), {
        status: 502,
        headers: { "content-type": "application/json" }
      });
    }

    const resp: WildcardOrderResponse = {
      ok: true,
      selections: validSelections,
      explanation: parsed.explanation || "Curated selection based on your preferences"
    };
    return new Response(JSON.stringify(resp), {
      status: 200,
      headers: { "content-type": "application/json" }
    });

  } catch (err: any) {
    const resp: WildcardOrderResponse = {
      ok: false,
      error: err?.message || "Unknown error"
    };
    return new Response(JSON.stringify(resp), {
      status: 500,
      headers: { "content-type": "application/json" }
    });
  }
}