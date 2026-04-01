import { useState, useEffect } from 'react'

const ARTICLE_URL = 'http://localhost:3000/save/article'
const YOUTUBE_URL = 'http://localhost:3000/save/ytVideo'

function isYouTube(url) {
  return url.includes('youtube.com/watch') || url.includes('youtu.be/')
}

export default function App() {
  const [url, setUrl]         = useState('')
  const [status, setStatus]   = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setUrl(tabs[0].url)
    })
  }, [])

  const isYT    = isYouTube(url)
  const apiUrl  = isYT ? YOUTUBE_URL : ARTICLE_URL
  const type    = isYT ? 'YouTube Video' : 'Article'

  async function handleSave() {
    setLoading(true)
    setStatus(null)

    try {
      const res  = await fetch(apiUrl, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ url }),
      })
      const data = await res.json()

      console.log('Status:', res.status, 'Data:', data)

      if (res.status === 200) {
        console.log('item:', data.item)
        console.log('data:', data)
        const title = data?.item?.title || data?.title || 'Saved!'
        setStatus({ type: 'success', message: '✓ Saved: ' + title })
      } else if (res.status === 409) {
        setStatus({ type: 'error', message: '⚠ Already saved!' })
      } else {
        setStatus({ type: 'error', message: data.error || 'Something went wrong' })
      }
    } catch (err) {
       console.log('Fetch error name:', err.name)
  console.log('Fetch error message:', err.message)
  console.log('Fetch error stack:', err.stack)
  setStatus({ type: 'error', message: 'Server reach nahi hua: ' + err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>SaveX</h2>

      {/* Content type badge */}
      <div style={{
        ...styles.badge,
        background: isYT ? '#ff000015' : '#2D5BE315',
        color:      isYT ? '#cc0000'   : '#2D5BE3',
      }}>
        {isYT ? '▶ YouTube Video' : '📄 Article'}
      </div>

      {/* URL */}
      <div style={styles.urlBox}>
        {url || 'Loading...'}
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={loading || !url}
        style={{
          ...styles.button,
          background: loading ? '#aaa' : isYT ? '#cc0000' : '#2D5BE3',
        }}
      >
        {loading ? 'Saving...' : `Save ${type}`}
      </button>

      {/* Status */}
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
    marginBottom: '10px',
    color: '#1a1a1a',
  },
  badge: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 10px',
    borderRadius: '20px',
    marginBottom: '10px',
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