const DIPLOMAT_PROMPT = `You are a neutral, diplomatic project manager. Read these daily logs and average peer ratings for a student group project. Generate a thoughtful, detailed, constructive team reflection of 3 medium-length paragraphs with a blank line between paragraphs. The first paragraph should summarize the overall project momentum and what the team appears to have accomplished. The second paragraph should interpret collaboration patterns, workload distribution, and communication signals without blaming anyone. The third paragraph should give practical next-step guidance the team could use in a retrospective or next project. Highlight overall successes and gently note areas of workload imbalance (e.g., 'Backend tasks were highly concentrated'). NEVER name specific individuals, profile names, or profile roles when discussing negative feedback, low contributions, or imbalance. Keep negative observations aggregate-only and team-level. Return the response as a JSON object with keys: 'summary', 'key_strengths', and 'areas_for_alignment'.`;

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

const PRIVATE_COACHING_SCHEMA = {
  type: "OBJECT",
  properties: {
    private_coaching: {
      type: "STRING",
    },
  },
  required: ["private_coaching"],
  propertyOrdering: ["private_coaching"],
};

const DEFAULT_AI_TIMEOUT_MS = 20000;
const DEFAULT_AI_RETRY_LIMIT = 1;
const MAX_RETRY_DELAY_MS = 20000;

const GROUP_SUMMARY_FALLBACKS = {
  high: {
    summary:
      "The team has demonstrated exceptional synergy, steady contribution habits, and a strong shared sense of ownership across the project. The available updates suggest that milestones are not only being completed, but are being completed with attention to quality, follow-through, and coordination. This kind of consistency is especially valuable in student group work because it reduces uncertainty and helps everyone understand where the project stands without needing constant check-ins.\n\nThe collaboration pattern looks healthy: teammates appear to be moving work forward while keeping enough visibility for others to understand progress. When a team reaches this level of momentum, the main challenge is often not fixing a problem, but preserving the habits that made the work feel smooth in the first place. Clear communication, timely updates, and mutual trust are showing up as meaningful strengths.\n\nFor the next phase or final reflection, the team should focus on maintaining this rhythm while making sure documentation, handoff notes, and final polish keep pace with development. Strong teams sometimes move quickly enough that context can stay in people's heads, so writing down key decisions and responsibilities will help the work remain easy to present, explain, and build on later.",
    key_strengths: [
      "Strong collaboration and clear communication.",
      "Consistent effort across the project timeline.",
      "High-quality execution with visible shared ownership.",
    ],
    areas_for_alignment: [
      "Maintain this momentum while ensuring documentation and final handoffs keep pace with development.",
      "Protect space for everyone to own meaningful work, even when the project is moving quickly.",
    ],
  },
  solid: {
    summary:
      "The group is making steady progress, with enough visible activity to show that the project is moving in the right direction. Most tasks appear to be advancing, and the update history gives the team a useful record of what has been completed, what has required attention, and where the project has gained momentum. This is a solid foundation for a group project because it gives everyone a clearer picture than memory alone would provide.\n\nAt the same time, the pattern suggests that workload distribution may not be perfectly even yet. That does not mean the team is failing; it simply means there may be a few areas where certain types of work are becoming concentrated or where communication could happen earlier. A small imbalance is common in project teams, especially when deadlines are close or teammates have different strengths, but it is worth addressing before it turns into stress.\n\nThe best next step is a short alignment conversation focused on task ownership, blockers, and what needs to happen next. The team can use the logs as a neutral reference point rather than a blame tool: what moved, what slowed down, and what should be redistributed. With a bit more clarity around delegation, this project can move from steady progress to a much smoother final push.",
    key_strengths: [
      "Consistent updates and active problem-solving.",
      "Clear evidence that the project is continuing to move forward.",
      "A useful shared record of completed work and blockers.",
    ],
    areas_for_alignment: [
      "Review task delegation to ensure no single area or teammate becomes a bottleneck in the next phase.",
      "Use a short sync to clarify ownership, blockers, and the next visible milestone.",
    ],
  },
  needsAlignment: {
    summary:
      "The project is still advancing, which is important: there is enough activity to show that the team has not stalled completely. However, the recent signals suggest that the group may be experiencing friction around effort, quality expectations, or visibility into who is handling which responsibilities. This kind of friction is common in student projects, and it is usually easier to repair when the team treats it as an alignment issue rather than a personal failure.\n\nThe most useful interpretation is that the team needs more clarity, not more pressure. Some work may be happening quietly, some blockers may not be getting surfaced early enough, and some expectations may not be shared across the group. When those things happen, teammates can start to feel uncertain about progress even if individual people are trying to contribute.\n\nThe next step should be a brief reset meeting with a very concrete agenda: what is done, what is blocked, what must be finished next, and who owns each item. Keeping the conversation specific and supportive will help the team rebuild momentum without turning the reflection into blame. If the group can make responsibilities visible again, the project still has room to stabilize and finish stronger.",
    key_strengths: [
      "Blockers and workload concerns are being surfaced early enough to address.",
      "The project still has visible movement and can be realigned.",
      "The team has enough information to make the next conversation more concrete.",
    ],
    areas_for_alignment: [
      "Schedule a brief sync to re-evaluate the timeline and clarify immediate responsibilities.",
      "Make blockers visible sooner so teammates can help before work piles up.",
    ],
  },
};

const PRIVATE_COACHING_FALLBACKS = {
  high:
    "Your team deeply values your contributions. You are consistently driving high-quality results. Keep leading by example, but ensure you are leaving room for others to take ownership of complex tasks.",
  solid:
    "You are providing solid, reliable support to the team. To level up, look for opportunities to proactively communicate your blockers before they slow down the group.",
  needsAlignment:
    "Your team is looking for a bit more visibility into your workflow. Try to log your updates more consistently and don't hesitate to ask for help if you are feeling stuck.",
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

function overallRatingAverage(ratingAverages) {
  const values = ratingAverages.flatMap((rating) =>
    [rating.effortScore, rating.qualityScore, rating.collaborationScore].filter(
      (value) => typeof value === "number" && !Number.isNaN(value),
    ),
  );

  return average(values) ?? 3.5;
}

function privateRatingAverage({ effortScore, qualityScore, collaborationScore }) {
  return average([effortScore, qualityScore, collaborationScore].filter(Boolean)) ?? 3.5;
}

function tierForAverage(value) {
  if (value > 4.2) {
    return "high";
  }

  if (value >= 3) {
    return "solid";
  }

  return "needsAlignment";
}

function aiTimeoutMs() {
  const configuredTimeout = Number(process.env.AI_TIMEOUT_MS);

  if (Number.isFinite(configuredTimeout) && configuredTimeout >= 7000) {
    return configuredTimeout;
  }

  return DEFAULT_AI_TIMEOUT_MS;
}

function aiRetryLimit() {
  const configuredLimit = Number(process.env.AI_RETRY_LIMIT);

  if (Number.isInteger(configuredLimit) && configuredLimit >= 0 && configuredLimit <= 2) {
    return configuredLimit;
  }

  return DEFAULT_AI_RETRY_LIMIT;
}

function timeoutSignal(timeoutMs = aiTimeoutMs()) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  };
}

function retryDelayMs(payload) {
  const retryInfo = payload.error?.details?.find((detail) =>
    String(detail["@type"] || "").includes("RetryInfo"),
  );
  const retryDelay = retryInfo?.retryDelay;

  if (retryDelay) {
    const seconds = Number(String(retryDelay).replace("s", ""));
    if (Number.isFinite(seconds)) {
      return Math.min(seconds * 1000, MAX_RETRY_DELAY_MS);
    }
  }

  const message = payload.error?.message || "";
  const match = message.match(/retry in ([\d.]+)s/i);

  if (match) {
    return Math.min(Number(match[1]) * 1000, MAX_RETRY_DELAY_MS);
  }

  return 2500;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function geminiApiKeys() {
  const pooledKeys = String(process.env.GEMINI_API_KEYS || "")
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean);

  if (pooledKeys.length) {
    return [...new Set(pooledKeys)];
  }

  return process.env.GEMINI_API_KEY ? [process.env.GEMINI_API_KEY] : [];
}

function logAiFallback(scope, error) {
  console.warn(`[Ghost Cache] ${scope} AI fallback used: ${error.message}`);
}

async function fetchGeminiPayload({ apiKey, model, body }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const retryLimit = aiRetryLimit();
  let lastPayload = {};
  let lastStatus = 0;

  for (let attempt = 0; attempt <= retryLimit; attempt += 1) {
    const requestTimeout = timeoutSignal();

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        signal: requestTimeout.signal,
        body: JSON.stringify(body),
      });
      const payload = await response.json().catch(() => ({}));

      if (response.ok) {
        return payload;
      }

      lastPayload = payload;
      lastStatus = response.status;

      if (response.status !== 429 || attempt === retryLimit) {
        break;
      }

      const delay = retryDelayMs(payload);
      console.warn(`[Ghost Cache] Gemini rate limited. Retrying in ${Math.round(delay / 1000)}s.`);
      await wait(delay);
    } finally {
      requestTimeout.clear();
    }
  }

  const message = lastPayload.error?.message || `Gemini request failed with status ${lastStatus}.`;
  throw Object.assign(new Error(message), { status: 502 });
}

function buildGroupFallback(context) {
  const tier = tierForAverage(overallRatingAverage(context.ratingAverages || []));

  return {
    ...GROUP_SUMMARY_FALLBACKS[tier],
    provider: "ghost-cache",
  };
}

function buildPrivateFallback(context) {
  const tier = tierForAverage(privateRatingAverage(context));

  return {
    private_coaching: PRIVATE_COACHING_FALLBACKS[tier],
    provider: "ghost-cache",
  };
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
      ? "The team has not logged daily updates yet, so the healthiest next step is to start building a small shared record of what changed, what is blocked, and what each teammate plans to pick up next. A project reflection becomes much more useful when it has concrete moments to reference, even if those moments are short and informal.\n\nAt this stage, the absence of logs should be treated as a workflow gap rather than a performance judgment. The team can still build a supportive rhythm by making updates lightweight, specific, and safe to share. Even a few entries can help teammates understand progress without relying on memory or assumptions.\n\nOnce a few updates are in place, the reflection can become more specific while still staying neutral and constructive. The goal is not to monitor people; it is to create enough shared visibility that the group can make better decisions together."
      : `The team created ${totalLogs} logged update${totalLogs === 1 ? "" : "s"}, with the strongest visible activity around ${topCategory} work. The notes show that the project has real movement and that teammates are leaving behind useful context about what changed, what needed attention, and where momentum is building. This shared record gives the group a more reliable foundation for reflection than memory alone.\n\nThe collaboration pattern appears constructive, but there is also a useful signal around workload visibility. When one category appears most often, it may mean that work in that area is genuinely carrying the project, or it may mean other types of work are happening but not being logged as clearly. Either way, the pattern is worth discussing gently so the team can distinguish actual imbalance from uneven documentation.\n\nThe best next step is to use the timeline as a neutral reference point for a short retrospective. The team can ask what moved smoothly, what slowed down, and what should be redistributed or clarified before the next milestone. If updates stay consistent and task ownership becomes clearer, the project can keep momentum without turning accountability into pressure.`;

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
  const apiKeys = geminiApiKeys();
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!apiKeys.length) {
    throw Object.assign(new Error("GEMINI_API_KEY or GEMINI_API_KEYS is required when AI_PROVIDER=gemini."), {
      status: 500,
    });
  }

  const body = {
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
  };
  let lastError;

  for (const [index, apiKey] of apiKeys.entries()) {
    try {
      const payload = await fetchGeminiPayload({
        apiKey,
        model,
        body,
      });
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
    } catch (error) {
      lastError = error;
      console.warn(`[Ghost Cache] Gemini summary key ${index + 1}/${apiKeys.length} failed: ${error.message}`);
    }
  }

  throw lastError || new Error("All Gemini summary keys failed.");
}

function buildPrivateCoachingPrompt({ effortScore, qualityScore, collaborationScore }) {
  return `You are an empathetic, private career coach for college students. The user has just finished a group project. Based on their peer rating averages (Effort: ${effortScore}/5, Quality: ${qualityScore}/5, Collaboration: ${collaborationScore}/5), write a short, 3-sentence personalized feedback block. Highlight their strength and suggest one gentle area for growth. Keep it highly encouraging. NEVER mention specific numbers or who rated them. Return JSON with a single key: 'private_coaching'.`;
}

function buildLocalPrivateCoaching({ effortScore, qualityScore, collaborationScore }) {
  const strongest =
    [
      ["effort", effortScore],
      ["quality", qualityScore],
      ["collaboration", collaborationScore],
    ].sort((a, b) => b[1] - a[1])[0]?.[0] || "contribution";

  return {
    private_coaching: `Your teammates' feedback points to ${strongest} as a meaningful strength, and that is a strong foundation to carry into the next project. A gentle growth opportunity is to keep making your work and decision process visible early, so teammates can support momentum before crunch time. Keep treating feedback as signal, not a verdict; this project gives you useful evidence that your contributions can keep getting sharper.`,
    provider: "local-placeholder",
  };
}

async function generateGeminiPrivateCoaching(context) {
  const apiKeys = geminiApiKeys();
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!apiKeys.length) {
    throw Object.assign(new Error("GEMINI_API_KEY or GEMINI_API_KEYS is required when AI_PROVIDER=gemini."), {
      status: 500,
    });
  }

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: buildPrivateCoachingPrompt(context) }],
      },
    ],
    generationConfig: {
      temperature: 0.45,
      responseMimeType: "application/json",
      responseSchema: PRIVATE_COACHING_SCHEMA,
    },
  };
  let lastError;

  for (const [index, apiKey] of apiKeys.entries()) {
    try {
      const payload = await fetchGeminiPayload({
        apiKey,
        model,
        body,
      });
      const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw Object.assign(new Error("Gemini returned empty private coaching."), { status: 502 });
      }

      return {
        ...JSON.parse(text),
        provider: "gemini",
      };
    } catch (error) {
      lastError = error;
      console.warn(`[Ghost Cache] Gemini private coaching key ${index + 1}/${apiKeys.length} failed: ${error.message}`);
    }
  }

  throw lastError || new Error("All Gemini private coaching keys failed.");
}

export async function generateDiplomatSummary(context) {
  const provider = process.env.AI_PROVIDER || "local";

  if (provider === "gemini") {
    try {
      return await generateGeminiSummary(context);
    } catch (error) {
      logAiFallback("group-summary", error);
      return buildGroupFallback(context);
    }
  }

  prepareDiplomatPrompt(context);
  return buildLocalDiplomatSummary(context);
}

export async function generatePrivateCoaching(context) {
  const provider = process.env.AI_PROVIDER || "local";

  if (provider === "gemini") {
    try {
      return await generateGeminiPrivateCoaching(context);
    } catch (error) {
      logAiFallback("private-coaching", error);
      return buildPrivateFallback(context);
    }
  }

  return buildLocalPrivateCoaching(context);
}
