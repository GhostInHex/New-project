const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export function verifyPin({ userId, pin }) {
  return request("/auth/verify", {
    method: "POST",
    body: JSON.stringify({ userId, pin }),
  });
}

export function createLog({ userId, projectId, category, text }) {
  return request("/logs", {
    method: "POST",
    body: JSON.stringify({ userId, projectId, category, text }),
  });
}

export function getTimeline(projectId) {
  return request(`/projects/${projectId}/timeline`);
}

export function submitRatings({ projectId, reviewerId, ratings }) {
  return request("/ratings", {
    method: "POST",
    body: JSON.stringify({ projectId, reviewerId, ratings }),
  });
}

export function generateSummary(projectId) {
  return request(`/projects/${projectId}/generate-summary`, {
    method: "POST",
  });
}
