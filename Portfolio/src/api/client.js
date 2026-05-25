const API_BASE = import.meta.env.VITE_API_URL ?? "";

export function getAdminToken() {
  return sessionStorage.getItem("adminToken");
}

export function setAdminToken(token) {
  if (token) sessionStorage.setItem("adminToken", token);
  else sessionStorage.removeItem("adminToken");
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  const token = getAdminToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    throw new Error("Cannot reach portfolio API. Start the server: cd Portfolio/server && npm run dev");
  }

  const contentType = res.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await res.json().catch(() => ({}))
    : {};
  if (!res.ok) throw new Error(data.detail || data.error || res.statusText || "Request failed");
  return data;
}

export async function fetchPortfolio(includeArchived = false) {
  const q = includeArchived ? "?includeArchived=true" : "";
  const sep = q ? "&" : "?";
  return request(`/api/portfolio${q}${sep}_t=${Date.now()}`);
}

export async function savePortfolio(portfolio) {
  return request("/api/portfolio", {
    method: "PUT",
    body: JSON.stringify(portfolio),
  });
}

/** Upload profile photo; saves to public/ and updates hero.image in portfolio.json */
export async function uploadHeroPortrait(dataUrl) {
  return request("/api/upload/hero-portrait", {
    method: "POST",
    body: JSON.stringify({ dataUrl }),
  });
}

export async function uploadProjectImage(dataUrl, projectId) {
  return request("/api/upload/project-image", {
    method: "POST",
    body: JSON.stringify({ dataUrl, projectId }),
  });
}

/** Upload resume PDF; saves to public/ and updates site.resumeUrl in portfolio.json */
export async function uploadResume(dataUrl, filename) {
  return request("/api/upload/resume", {
    method: "POST",
    body: JSON.stringify({ dataUrl, filename }),
  });
}

export async function loginAdmin(password) {
  const { token } = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
  setAdminToken(token);
  return token;
}

export async function submitContact(form) {
  return request("/api/contact", {
    method: "POST",
    body: JSON.stringify(form),
  });
}

export async function fetchMessages(archived = false) {
  const q = archived ? "?archived=true" : "";
  return request(`/api/messages${q}`);
}

export async function updateMessage(id, patch) {
  return request(`/api/messages/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function deleteMessage(id) {
  return request(`/api/messages/${id}`, { method: "DELETE" });
}

export async function recordPortfolioView(visitorId) {
  return request("/api/analytics/view", {
    method: "POST",
    body: JSON.stringify({ visitorId }),
  });
}

export async function fetchAnalytics() {
  return request("/api/analytics");
}

export async function updateAdminPassword(currentPassword, newPassword) {
  return request("/api/auth/password", {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}
