'use client'
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function Graph({ nodes, edges }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!nodes.length) return

    const width  = window.innerWidth
    const height = window.innerHeight - 60

    // Purana SVG clear karo
    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)

    // Zoom enable karo
    const g = svg.append('g')
    svg.call(
      d3.zoom()
        .scaleExtent([0.3, 3])
        .on('zoom', (event) => g.attr('transform', event.transform))
    )

    // Links data — id se object reference banao
    const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))
    const links   = edges.map(e => ({
      source: nodeMap[e.source],
      target: nodeMap[e.target],
      reason: e.reason,
    })).filter(e => e.source && e.target)

    // Force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link',   d3.forceLink(links).id(d => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50))

    // Edges draw karo
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 1.5)

    // Node groups
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(
        d3.drag()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
          })
          .on('drag', (event, d) => {
            d.fx = event.x
            d.fy = event.y
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
          })
      )
      .on('click', (event, d) => {
        window.open(d.url, '_blank')
      })

    // Node circle — type se color
    node.append('circle')
      .attr('r', 28)
      .attr('fill', d => d.type === 'youtube' ? '#fee2e2' : '#eff6ff')
      .attr('stroke', d => d.type === 'youtube' ? '#ef4444' : '#3b82f6')
      .attr('stroke-width', 1.5)

    // Node label
    node.append('text')
      .text(d => d.title?.slice(0, 15) + '...' || d.domain)
      .attr('text-anchor', 'middle')
      .attr('dy', 44)
      .attr('font-size', 11)
      .attr('fill', '#64748b')

    // Node type icon text
    node.append('text')
      .text(d => d.type === 'youtube' ? '▶' : '📄')
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .attr('font-size', 16)

    // Simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      node.attr('transform', d => `translate(${d.x},${d.y})`)
    })

    return () => simulation.stop()

  }, [nodes, edges])

  return <svg ref={svgRef} className="w-full h-full" />
}