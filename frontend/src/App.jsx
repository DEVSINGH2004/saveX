import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:3000/save/article'

export default function App() {
  const [url, setUrl]       = useState('')
  const [status, setStatus] = useState(null)  // { type: 'success'|'error', message }
  const [loading, setLoading] = useState(false)

  // Current tab ka URL lo
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setUrl(tabs[0].url)
    })
  }, [])

  async function handleSave() {
     console.log('Calling:', API_URL)  // yeh add karo
  console.log('URL being sent:', url)
    setLoading(true)
    setStatus(null)

    try {
      const res  = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ url }),
      })
      const data = await res.json()
       console.log('Response status:', res.status)
      console.log('Response data:', data)

      if (res.status === 201) {
        setStatus({ type: 'success', message: '✓ Saved: ' + data.item.title })
      } else if (res.status === 409) {
        setStatus({ type: 'error', message: 'Already saved!' })
      } else {
        setStatus({ type: 'error', message: data.error })
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Server reach nahi hua', error: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>SaveX</h2>

      <div style={styles.urlBox}>
        {url || 'Loading...'}
      </div>

      <button
        onClick={handleSave}
        disabled={loading || !url}
        style={{
          ...styles.button,
          background: loading ? '#aaa' : '#2D5BE3',
        }}
      >
        {loading ? 'Saving...' : 'Save Article'}
      </button>

      {status && (
        <div style={{
          ...styles.status,
          color: status.type === 'success' ? 'green' : 'red',
        }}>
          {status.message}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    width: '300px',
    padding: '16px',
    fontFamily: 'sans-serif',
  },
  heading: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1a1a1a',
  },
  urlBox: {
    fontSize: '11px',
    color: '#666',
    marginBottom: '12px',
    wordBreak: 'break-all',
    background: '#f5f5f5',
    padding: '8px',
    borderRadius: '6px',
    maxHeight: '48px',
    overflow: 'hidden',
  },
  button: {
    width: '100%',
    padding: '10px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  status: {
    marginTop: '10px',
    fontSize: '13px',
    textAlign: 'center',
  },
}