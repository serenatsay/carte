import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET() {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  return new Response(
    JSON.stringify({
      status: "ok",
      hasApiKey: !!ANTHROPIC_API_KEY,
      apiKeyLength: ANTHROPIC_API_KEY?.length || 0,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    }),
    {
      status: 200,
      headers: { "content-type": "application/json" }
    }
  );
}