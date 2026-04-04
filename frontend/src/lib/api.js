const API_BASE = 'http://localhost:3000'

function getToken() {
  return localStorage.getItem('token')
}

export async function login(email, password) {
  const res  = await fetch(`${API_BASE}/auth/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}

export async function getItems() {
  const res  = await fetch(`${API_BASE}/save/items`, {
    headers: { 'Authorization': `Bearer ${getToken()}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data.items
}

export async function getGraphData() {
  const res  = await fetch(`${API_BASE}/graph`, {
    headers: { 'Authorization': `Bearer ${getToken()}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}