'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/api'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  async function handleLogin() {
    setLoading(true)
    setError(null)
    try {
      const data = await login(email, password)
      localStorage.setItem('token', data.token)
      router.push('/graph')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm border w-96">
        <h1 className="text-2xl font-semibold mb-2">Memex</h1>
        <p className="text-gray-500 text-sm mb-6">Your knowledge graph</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
      </div>
    </div>
  )
}