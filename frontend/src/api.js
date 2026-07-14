// Central fetch wrapper that attaches a verified HMAC-signed auth token
// to every protected request. Plain username headers are never sent.

function getAuthToken() {
  try {
    const u = JSON.parse(localStorage.getItem('wf_user') || 'null');
    return u?.auth_token || null;
  } catch { return null; }
}

export async function apiFetch(url, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { 'X-WF-Token': token } : {}),
  };
  return fetch(url, { ...options, headers, credentials: 'include' });
}
