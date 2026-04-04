'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Graph from '@/components/Graph'
import { getGraphData } from '@/lib/api'

export default function GraphPage() {
  const [nodes, setNodes]     = useState([])
  const [edges, setEdges]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }
    fetchGraph()
  }, [])

  async function fetchGraph() {
    try {
      const data = await getGraphData()
      setNodes(data.nodes)
      setEdges(data.edges)
    } catch (err) {
      if (err.message.includes('401')) router.push('/')
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('token')
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading graph...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-400">{error}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b">
        <div>
          <h1 className="font-semibold text-gray-800">Memex</h1>
          <p className="text-xs text-gray-400">{nodes.length} items saved</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          Logout
        </button>
      </div>

      {/* Graph */}
      {nodes.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-400 mb-2">Koi items nahi hain abhi</p>
            <p className="text-sm text-gray-300">Extension se articles aur videos save karo</p>
          </div>
        </div>
      ) : (
        <Graph nodes={nodes} edges={edges} />
      )}
    </div>
  )
}