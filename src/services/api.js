// API Client with Backend Password Authentication (@vercel/kv & @vercel/blob)

const TOKEN_KEY = 'sneakdex_auth_token';

export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setAuthToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    console.error('Failed to save auth token to localStorage:', err);
  }
}

export function clearAuthToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.error('Failed to clear auth token:', err);
  }
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}

function getAuthHeaders(extra = {}) {
  const token = getAuthToken();
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function loginApi(password) {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password })
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error || 'Contraseña incorrecta');
  }

  if (json.token) {
    setAuthToken(json.token);
  }
  return json;
}

export async function fetchSneakersApi() {
  const res = await fetch('/api/sneakers', {
    headers: getAuthHeaders()
  });

  if (res.status === 401) {
    clearAuthToken();
    const error = new Error('UNAUTHORIZED');
    error.isAuthError = true;
    throw error;
  }

  if (!res.ok) {
    throw new Error(`Error ${res.status}: Failed to fetch sneakers collection`);
  }
  const json = await res.json();
  return json.data || [];
}

export async function addSneakerApi(newSneaker) {
  const res = await fetch('/api/sneakers', {
    method: 'POST',
    headers: getAuthHeaders({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(newSneaker)
  });

  if (res.status === 401) {
    clearAuthToken();
    const error = new Error('UNAUTHORIZED');
    error.isAuthError = true;
    throw error;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Error ${res.status}: Failed to register sneaker`);
  }
  const json = await res.json();
  return json.data;
}

export async function updateSneakerApi(updatedSneaker) {
  const res = await fetch('/api/sneakers', {
    method: 'PUT',
    headers: getAuthHeaders({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(updatedSneaker)
  });

  if (res.status === 401) {
    clearAuthToken();
    const error = new Error('UNAUTHORIZED');
    error.isAuthError = true;
    throw error;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Error ${res.status}: Failed to update sneaker`);
  }
  const json = await res.json();
  return json.data;
}

export async function deleteSneakerApi(id) {
  const res = await fetch(`/api/sneakers?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (res.status === 401) {
    clearAuthToken();
    const error = new Error('UNAUTHORIZED');
    error.isAuthError = true;
    throw error;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Error ${res.status}: Failed to delete sneaker`);
  }
  return true;
}

export async function clearSneakersApi() {
  const res = await fetch('/api/sneakers?action=clear', {
    method: 'POST',
    headers: getAuthHeaders()
  });

  if (res.status === 401) {
    clearAuthToken();
    const error = new Error('UNAUTHORIZED');
    error.isAuthError = true;
    throw error;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Error ${res.status}: Failed to clear collection`);
  }
  const json = await res.json();
  return json.data || [];
}

export async function resetSneakersApi() {
  const res = await fetch('/api/sneakers?action=reset', {
    method: 'POST',
    headers: getAuthHeaders()
  });

  if (res.status === 401) {
    clearAuthToken();
    const error = new Error('UNAUTHORIZED');
    error.isAuthError = true;
    throw error;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Error ${res.status}: Failed to reset collection`);
  }
  const json = await res.json();
  return json.data;
}

// Upload file to @vercel/blob via secure serverless endpoint
export async function uploadImageToBlobApi(filename, base64Data, contentType) {
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: getAuthHeaders({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      filename,
      base64: base64Data,
      contentType
    })
  });

  if (res.status === 401) {
    clearAuthToken();
    const error = new Error('UNAUTHORIZED');
    error.isAuthError = true;
    throw error;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Error ${res.status}: Failed to upload image to Vercel Blob`);
  }

  const json = await res.json();
  return json.url;
}
