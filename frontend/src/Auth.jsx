import { useState } from 'react'
const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
export default function Auth({ onLogin }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)

  async function handleSubmit() {
    setLoading(true)
    setError(null)

    const endpoint = isSignup
      ? `${SUPABASE_URL}/auth/v1/signup`
      : `${SUPABASE_URL}/auth/v1/token?grant_type=password`

    try {
      const res  = await fetch(endpoint, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      console.log(data)
      if (!res.ok) {
  setError(data.error || data.msg || data.message || 'Something went wrong')
  return
}

      if (data.error || data.error_description) {
        setError(data.error_description || data.error)
        return
      }

      // Token save karo chrome storage mein
      const token = data.access_token
      await chrome.storage.local.set({ token, user: data.user })

      onLogin(token)
    } catch (err) {
      setError('Server reach nahi hua')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>SaveX</h2>
      <p style={styles.sub}>{isSignup ? 'Account banao' : 'Login karo'}</p>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={styles.input}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={styles.button}
      >
        {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Login'}
      </button>

      {error && <div style={styles.error}>{error}</div>}

      <p
        onClick={() => setIsSignup(!isSignup)}
        style={styles.toggle}
      >
        {isSignup ? 'Already account hai? Login karo' : 'Account nahi hai? Sign up karo'}
      </p>
    </div>
  )
}

const styles = {
  container: { width: '300px', padding: '16px', fontFamily: 'sans-serif' },
  heading:   { fontSize: '16px', fontWeight: '600', marginBottom: '4px' },
  sub:       { fontSize: '12px', color: '#666', marginBottom: '12px' },
  input:     { width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' },
  button:    { width: '100%', padding: '10px', background: '#2D5BE3', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
  error:     { color: 'red', fontSize: '12px', marginTop: '8px', textAlign: 'center' },
  toggle:    { fontSize: '12px', color: '#2D5BE3', textAlign: 'center', marginTop: '12px', cursor: 'pointer' },
}