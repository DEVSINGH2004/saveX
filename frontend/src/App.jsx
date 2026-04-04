import { useState, useEffect } from 'react'
import Auth from './Auth.jsx' 

export default function App() {
  const [token, setToken]     = useState(null)
  const [checked, setChecked] = useState(false)  // storage check hua?
  const [url, setUrl]         = useState('')
  const [status, setStatus]   = useState(null)
  const [loading, setLoading] = useState(false)

  // Token check karo chrome storage mein
  useEffect(() => {
    chrome.storage.local.get(['token'], (result) => {
      setToken(result.token || null)
      setChecked(true)
    })
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setUrl(tabs[0].url)
    })
  }, [])

  function handleLogout() {
    chrome.storage.local.remove(['token', 'user'])
    setToken(null)
    setStatus(null)
  }

  // Storage check hone tak wait karo
  if (!checked) return <div style={{ padding: 16, fontFamily: 'sans-serif' }}>Loading...</div>

  // Token nahi hai toh Auth screen dikhao
  if (!token) return <Auth onLogin={setToken} />

  // Baaki App same rahega — sirf fetch mein token add karo
  const isYT   = url.includes('youtube.com/watch') || url.includes('youtu.be/')
  const apiUrl = isYT ? 'http://localhost:3000/save/ytVideo' : 'http://localhost:3000/save/article'

  async function handleSave() {
    setLoading(true)
    setStatus(null)

    try {
      const res  = await fetch(apiUrl, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,  // token har request mein bhejo
        },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()

      console.log('Status:', res.status, 'Data:', data)

      if (res.status === 401) {
        // Token expire ho gaya — logout karo
        handleLogout()
        return
      }

      if (res.status === 201) {
        setStatus({ type: 'success', message: '✓ Saved: ' + data.item.title })
      } else if (res.status === 409) {
        setStatus({ type: 'error', message: '⚠ Already saved!' })
      } else {
        setStatus({ type: 'error', message: data.error || 'Something went wrong' })
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Server reach nahi hua' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '300px', padding: '16px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>SaveX</h2>
        <span onClick={handleLogout} style={{ fontSize: '12px', color: '#999', cursor: 'pointer' }}>Logout</span>
      </div>

      <div style={{ fontSize: '11px', color: '#666', marginBottom: '12px', wordBreak: 'break-all', background: '#f5f5f5', padding: '8px', borderRadius: '6px', maxHeight: '48px', overflow: 'hidden' }}>
        {url || 'Loading...'}
      </div>

      <button
        onClick={handleSave}
        disabled={loading || !url}
        style={{ width: '100%', padding: '10px', background: loading ? '#aaa' : isYT ? '#cc0000' : '#2D5BE3', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
      >
        {loading ? 'Saving...' : isYT ? 'Save YouTube Video' : 'Save Article'}
      </button>

      {status && (
        <div style={{ marginTop: '10px', fontSize: '13px', textAlign: 'center', color: status.type === 'success' ? 'green' : 'red' }}>
          {status.message}
        </div>
      )}
    </div>
  )
}