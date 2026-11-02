// API Client for Sneakdex Serverless Endpoints (@vercel/kv & @vercel/blob)

export async function fetchSneakersApi() {
  const res = await fetch('/api/sneakers');
  if (!res.ok) {
    throw new Error(`Error ${res.status}: Failed to fetch sneakers collection`);
  }
  const json = await res.json();
  return json.data || [];
}

export async function addSneakerApi(newSneaker) {
  const res = await fetch('/api/sneakers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newSneaker)
  });
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
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedSneaker)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Error ${res.status}: Failed to update sneaker`);
  }
  const json = await res.json();
  return json.data;
}

export async function deleteSneakerApi(id) {
  const res = await fetch(`/api/sneakers?id=${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Error ${res.status}: Failed to delete sneaker`);
  }
  return true;
}

export async function resetSneakersApi() {
  const res = await fetch('/api/sneakers?action=reset', {
    method: 'POST'
  });
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
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      filename,
      base64: base64Data,
      contentType
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Error ${res.status}: Failed to upload image to Vercel Blob`);
  }

  const json = await res.json();
  return json.url;
}
