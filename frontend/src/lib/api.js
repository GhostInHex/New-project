const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/$/, "").endsWith("/api")
  ? RAW_API_BASE_URL.replace(/\/$/, "")
  : `${RAW_API_BASE_URL.replace(/\/$/, "")}/api`;

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
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

export function register({ email, password, displayName }) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, displayName }),
  });
}

export function login({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logout() {
  return request("/auth/logout", {
    method: "POST",
  });
}

export function getMe() {
  return request("/auth/me");
}

export function updateMe({ displayName, avatarUrl }) {
  return request("/auth/me", {
    method: "PATCH",
    body: JSON.stringify({ displayName, avatarUrl }),
  });
}

export function createLog({ projectId, category, text, githubLink }) {
  return request("/logs", {
    method: "POST",
    body: JSON.stringify({ projectId, category, text, githubLink }),
  });
}

export function getTimeline(projectId) {
  return request(`/projects/${projectId}/timeline`);
}

export function getMyProjects() {
  return request("/projects/my-projects");
}

export function createProject({ name, description, githubRepoUrl, deadline, maxMembers }) {
  return request("/projects", {
    method: "POST",
    body: JSON.stringify({ name, description, githubRepoUrl, deadline, maxMembers }),
  });
}

export function joinProject({ inviteCode }) {
  return request("/projects/join", {
    method: "POST",
    body: JSON.stringify({ inviteCode }),
  });
}

export function previewJoinProject({ inviteCode }) {
  return request("/projects/join-preview", {
    method: "POST",
    body: JSON.stringify({ inviteCode }),
  });
}

export function submitRatings({ projectId, ratings }) {
  return request("/ratings", {
    method: "POST",
    body: JSON.stringify({ projectId, ratings }),
  });
}

export function generateSummary(projectId) {
  return request(`/projects/${projectId}/generate-summary`, {
    method: "POST",
  });
}

export function toggleProjectStatus(projectId) {
  return request(`/projects/${projectId}/toggle-status`, {
    method: "PATCH",
  });
}

export function getMyFeedback(projectId) {
  return request(`/projects/${projectId}/my-feedback`);
}
