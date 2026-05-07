const DIPLOMAT_PROMPT = `You are a neutral, diplomatic project manager. Read these daily logs and average peer ratings for a student group project. Generate a constructive, 2-paragraph team reflection with a blank line between paragraphs. Highlight overall successes and gently note areas of workload imbalance (e.g., 'Backend tasks were highly concentrated'). NEVER name specific individuals, profile names, or profile roles when discussing negative feedback, low contributions, or imbalance. Keep negative observations aggregate-only and team-level. Return the response as a JSON object with keys: 'summary', 'key_strengths', and 'areas_for_alignment'.`;

const SUMMARY_SCHEMA = {
  type: "OBJECT",
  properties: {
    summary: {
      type: "STRING",
    },
    key_strengths: {
      type: "ARRAY",
      items: {
        type: "STRING",
      },
    },
    areas_for_alignment: {
      type: "ARRAY",
      items: {
        type: "STRING",
      },
    },
  },
  required: ["summary", "key_strengths", "areas_for_alignment"],
  propertyOrdering: ["summary", "key_strengths", "areas_for_alignment"],
};

function categoryCounts(logs) {
  return logs.reduce((counts, log) => {
    counts[log.category] = (counts[log.category] || 0) + 1;
    return counts;
  }, {});
}

function busiestCategory(counts) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "general project";
}

function average(values) {
  if (!values.length) {
    return null;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function buildLocalDiplomatSummary({ logs, ratingAverages }) {
  const counts = categoryCounts(logs);
  const topCategory = busiestCategory(counts);
  const totalLogs = logs.length;
  const avgEffort = average(ratingAverages.map((rating) => rating.effortScore).filter(Boolean));
  const avgQuality = average(ratingAverages.map((rating) => rating.qualityScore).filter(Boolean));
  const avgCollaboration = average(
    ratingAverages.map((rating) => rating.collaborationScore).filter(Boolean),
  );
  const hasRatings = [avgEffort, avgQuality, avgCollaboration].every((value) => value !== null);

  const summary =
    totalLogs === 0
      ? "The team has not logged daily updates yet, so the healthiest next step is to start building a small shared record of what changed, what is blocked, and what each teammate plans to pick up next.\n\nOnce a few entries are in place, the reflection can become more specific while still staying neutral and supportive."
      : `The team created ${totalLogs} logged update${totalLogs === 1 ? "" : "s"}, with the strongest activity around ${topCategory} work. The notes show useful movement across the project and give the group a shared record to discuss progress without turning the process into personal monitoring.\n\nThe main alignment opportunity is to keep contribution visibility balanced across categories and days. If one area continues to carry most of the visible work, the team can rebalance upcoming tasks or make quieter contributions easier to record.`;

  return {
    summary,
    key_strengths: [
      totalLogs > 0 ? "The team is building a concrete shared timeline of progress." : "The workflow is ready for low-friction daily check-ins.",
      hasRatings
        ? `Peer signals are available across effort, quality, and collaboration, with collaboration averaging ${avgCollaboration.toFixed(1)} out of 5.`
        : "The review system is set up to support an anonymous final aggregate.",
      `The current log structure keeps updates short, factual, and easier to compare across teammates.`,
    ],
    areas_for_alignment: [
      totalLogs > 0
        ? `${topCategory} work is currently the most visible category; the team should check whether that reflects the real workload or just logging habits.`
        : "The team needs a few daily updates before meaningful workload patterns can be inferred.",
      hasRatings
        ? `Average effort is ${avgEffort.toFixed(1)} and average quality is ${avgQuality.toFixed(1)}, which can guide a constructive closing conversation.`
        : "Anonymous peer ratings have not been submitted by enough teammates yet.",
    ],
    provider: "local-placeholder",
  };
}

export function prepareDiplomatPrompt({ project, logs, ratingAverages }) {
  return `${DIPLOMAT_PROMPT}

Project:
${JSON.stringify(project, null, 2)}

Daily logs:
${JSON.stringify(logs, null, 2)}

Average peer ratings:
${JSON.stringify(ratingAverages, null, 2)}`;
}

async function generateGeminiSummary(context) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!apiKey) {
    throw Object.assign(new Error("GEMINI_API_KEY is required when AI_PROVIDER=gemini."), {
      status: 500,
    });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prepareDiplomatPrompt(context) }],
          },
        ],
        generationConfig: {
          temperature: 0.35,
          responseMimeType: "application/json",
          responseSchema: SUMMARY_SCHEMA,
        },
      }),
    },
  );

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload.error?.message || "Gemini summary generation failed.";
    throw Object.assign(new Error(message), { status: 502 });
  }

  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw Object.assign(new Error("Gemini returned an empty summary."), { status: 502 });
  }

  const parsed = JSON.parse(text);

  return {
    ...parsed,
    summary: parsed.summary.replace(/([.!?])(?=[A-Z])/g, "$1\n\n"),
    provider: "gemini",
  };
}

export async function generateDiplomatSummary(context) {
  const provider = process.env.AI_PROVIDER || "local";

  if (provider === "gemini") {
    return generateGeminiSummary(context);
  }

  prepareDiplomatPrompt(context);
  return buildLocalDiplomatSummary(context);
}
