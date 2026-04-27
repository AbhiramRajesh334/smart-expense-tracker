function extractJsonObject(text) {
  if (!text || typeof text !== "string") return null;
  const cleaned = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  return match ? match[0] : cleaned;
}

async function parseQueryToFilters(query) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error(
      "Missing OPENROUTER_API_KEY. Set it in server environment variables (or .env)."
    );
  }

  const prompt = `
You are a strict JSON generator.

Query: "${query}"

Return ONLY JSON:
{
  "category": string | null,
  "keyword": string | null,
  "timeRange": "today" | "yesterday" | "this_week" | "last_week" | "this_month" | "last_month" | null
}

Rules:
- "food" -> category Food
- "travel", "transport", "auto", "metro" -> category Travel
- Extract keyword if specific (auto, metro, etc.)
- Detect time phrases exactly
- DO NOT return explanation
- ONLY JSON
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [
          {
            role: "system",
            content:
              "You are a strict JSON generator. Reply with valid JSON only and no extra text.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter request failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content ?? "";
    const jsonText = extractJsonObject(text) ?? text;

    try {
      const parsed = JSON.parse(jsonText);
      return {
        category: parsed?.category ?? null,
        keyword: parsed?.keyword ?? null,
        timeRange: parsed?.timeRange ?? null,
      };
    } catch (err) {
      throw new Error("Failed to parse AI response: " + text);
    }
  } catch (err) {
    const message =
      err && typeof err === "object" && "message" in err ? err.message : String(err);
    throw new Error("OpenRouter API error: " + message);
  }
}

// Keep backward compatibility with existing controller code.
async function parseNaturalLanguageQuery(query) {
  return parseQueryToFilters(query);
}

module.exports = { parseQueryToFilters, parseNaturalLanguageQuery };
