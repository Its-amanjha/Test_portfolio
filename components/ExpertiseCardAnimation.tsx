'use client'

import { useEffect, useRef, useState } from 'react'

export default function ExpertiseCardAnimation({ index, title, animationType }: { index: number; title?: string; animationType?: string }) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const update = () => setIsDarkMode(document.documentElement.classList.contains('dark-mode'))
    update()
    const obs = new MutationObserver(update)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const resolvedType = animationType || ''

  if (resolvedType === 'coding') return <AgenticCodingAnimation isDarkMode={isDarkMode} />
  if (resolvedType === 'workflow') return <AIWorkflowsAnimation isDarkMode={isDarkMode} />
  if (resolvedType === 'fullstack') return <FullStackAIAnimation isDarkMode={isDarkMode} />
  if (resolvedType === 'gtm') return <GTMTechAnimation isDarkMode={isDarkMode} />
  if (resolvedType === 'seo') return <ProgrammaticSEOAnimation isDarkMode={isDarkMode} />
  if (resolvedType === 'cognitive') return <CognitiveAutomationAnimation isDarkMode={isDarkMode} />
  if (resolvedType === 'security') return <CyberSecurityAnimation isDarkMode={isDarkMode} />
  if (resolvedType === 'infra') return <CloudInfrastructureAnimation isDarkMode={isDarkMode} />
  if (resolvedType === 'vision') return <ComputerVisionAnimation isDarkMode={isDarkMode} />
  if (resolvedType === 'training') return <MLModelTrainingAnimation isDarkMode={isDarkMode} />
  if (resolvedType === 'database') return <DBReplicationAnimation isDarkMode={isDarkMode} />
  if (resolvedType === 'blockchain') return <BlockchainLedgerAnimation isDarkMode={isDarkMode} />

  const normalizedTitle = (title || '').toLowerCase()

  if (
    normalizedTitle.includes('agentic') ||
    normalizedTitle.includes('coding') ||
    normalizedTitle.includes('multi-agent')
  ) {
    return <AgenticCodingAnimation isDarkMode={isDarkMode} />
  }
  if (
    normalizedTitle.includes('workflow') ||
    normalizedTitle.includes('orchestration') ||
    normalizedTitle.includes('llm')
  ) {
    return <AIWorkflowsAnimation isDarkMode={isDarkMode} />
  }
  if (
    normalizedTitle.includes('full-stack') ||
    normalizedTitle.includes('app') ||
    normalizedTitle.includes('web')
  ) {
    return <FullStackAIAnimation isDarkMode={isDarkMode} />
  }
  if (
    normalizedTitle.includes('gtm') ||
    normalizedTitle.includes('growth') ||
    normalizedTitle.includes('funnel') ||
    normalizedTitle.includes('marketing')
  ) {
    return <GTMTechAnimation isDarkMode={isDarkMode} />
  }
  if (
    normalizedTitle.includes('seo') ||
    normalizedTitle.includes('content') ||
    normalizedTitle.includes('programmatic')
  ) {
    return <ProgrammaticSEOAnimation isDarkMode={isDarkMode} />
  }
  if (
    normalizedTitle.includes('cognitive') ||
    normalizedTitle.includes('parsing') ||
    normalizedTitle.includes('document') ||
    normalizedTitle.includes('automation')
  ) {
    return <CognitiveAutomationAnimation isDarkMode={isDarkMode} />
  }
  if (
    normalizedTitle.includes('security') ||
    normalizedTitle.includes('pen-test') ||
    normalizedTitle.includes('vulnerability') ||
    normalizedTitle.includes('hack')
  ) {
    return <CyberSecurityAnimation isDarkMode={isDarkMode} />
  }
  if (
    normalizedTitle.includes('cloud') ||
    normalizedTitle.includes('kubernetes') ||
    normalizedTitle.includes('infra') ||
    normalizedTitle.includes('pod') ||
    normalizedTitle.includes('cluster')
  ) {
    return <CloudInfrastructureAnimation isDarkMode={isDarkMode} />
  }
  if (
    normalizedTitle.includes('vision') ||
    normalizedTitle.includes('camera') ||
    normalizedTitle.includes('bounding') ||
    normalizedTitle.includes('detection') ||
    normalizedTitle.includes('yolo')
  ) {
    return <ComputerVisionAnimation isDarkMode={isDarkMode} />
  }
  if (
    normalizedTitle.includes('training') ||
    normalizedTitle.includes('learning') ||
    normalizedTitle.includes('neural') ||
    normalizedTitle.includes('loss')
  ) {
    return <MLModelTrainingAnimation isDarkMode={isDarkMode} />
  }
  if (
    normalizedTitle.includes('replication') ||
    normalizedTitle.includes('database') ||
    normalizedTitle.includes('db') ||
    normalizedTitle.includes('sync') ||
    normalizedTitle.includes('postgres') ||
    normalizedTitle.includes('redis')
  ) {
    return <DBReplicationAnimation isDarkMode={isDarkMode} />
  }
  if (
    normalizedTitle.includes('blockchain') ||
    normalizedTitle.includes('ledger') ||
    normalizedTitle.includes('contract') ||
    normalizedTitle.includes('smart') ||
    normalizedTitle.includes('ethereum') ||
    normalizedTitle.includes('solidity')
  ) {
    return <BlockchainLedgerAnimation isDarkMode={isDarkMode} />
  }

  // Index fallback
  const anims = [
    <AgenticCodingAnimation key="0" isDarkMode={isDarkMode} />,
    <AIWorkflowsAnimation key="1" isDarkMode={isDarkMode} />,
    <FullStackAIAnimation key="2" isDarkMode={isDarkMode} />,
    <GTMTechAnimation key="3" isDarkMode={isDarkMode} />,
    <ProgrammaticSEOAnimation key="4" isDarkMode={isDarkMode} />,
    <CognitiveAutomationAnimation key="5" isDarkMode={isDarkMode} />,
    <CyberSecurityAnimation key="6" isDarkMode={isDarkMode} />,
    <CloudInfrastructureAnimation key="7" isDarkMode={isDarkMode} />,
    <ComputerVisionAnimation key="8" isDarkMode={isDarkMode} />,
    <MLModelTrainingAnimation key="9" isDarkMode={isDarkMode} />,
    <DBReplicationAnimation key="10" isDarkMode={isDarkMode} />,
    <BlockchainLedgerAnimation key="11" isDarkMode={isDarkMode} />,
  ]
  return anims[index % anims.length]
}

/* ─── 1. Agentic Coding & Multi-Agent Systems ─── */
function AgenticCodingAnimation({ isDarkMode }: { isDarkMode: boolean }) {
  const [editorText, setEditorText] = useState('')
  const [status, setStatus] = useState('SCANNING')
  const [tests, setTests] = useState<string[]>([])

  useEffect(() => {
    const codeSnippet = `class DeveloperAgent:\n    def run(self, issue):\n        ast = parse(issue)\n        patch = ast.fix_bugs()\n        return patch`

    let charIdx = 0
    let text = ''
    let intervalId: ReturnType<typeof setInterval>

    const runLoop = () => {
      setStatus('CODING')
      setTests([])
      intervalId = setInterval(() => {
        if (charIdx < codeSnippet.length) {
          text += codeSnippet[charIdx]
          setEditorText(text)
          charIdx++
        } else {
          clearInterval(intervalId)
          setStatus('TESTING')
          setTimeout(() => {
            setTests(['✓ test_ast: PASSED', '✓ test_codegen: PASSED', '[✓] ALL TESTS PASSED'])
            setStatus('MERGING')
            setTimeout(() => {
              charIdx = 0
              text = ''
              setEditorText('')
              setTests([])
              runLoop()
            }, 3000)
          }, 1500)
        }
      }, 35)
    }

    runLoop()
    return () => clearInterval(intervalId)
  }, [])

  const renderCode = () => {
    return editorText.split('\n').map((line, lIdx) => {
      const tokens = line.split(/(\s+)/)
      return (
        <div key={lIdx} className="truncate">
          <span className="text-gray-500 mr-1.5 select-none w-2 inline-block text-right">{lIdx + 1}</span>
          {tokens.map((token, tIdx) => {
            if (token === 'class' || token === 'def' || token === 'return') {
              return <span key={tIdx} className="text-neo-pink font-extrabold">{token}</span>
            }
            if (token === 'DeveloperAgent' || token === 'run' || token === 'fix_bugs') {
              return <span key={tIdx} className="text-neo-blue font-extrabold">{token}</span>
            }
            return <span key={tIdx} className="text-[color:var(--neo-ink-soft)]">{token}</span>
          })}
        </div>
      )
    })
  }

  return (
    <div className="w-full h-full grid grid-cols-5 bg-[color:var(--neo-surface-2)] text-[7.5px] font-mono select-none p-1.5">
      {/* Code Editor */}
      <div className="col-span-3 border-r border-neo-border pr-1.5 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center gap-1 border-b border-neo-border pb-1 mb-1 opacity-60">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[7px] text-[color:var(--neo-muted)] font-bold">agent.py</span>
        </div>
        <div className="flex-grow overflow-hidden leading-normal">
          {renderCode()}
          <span className="w-1 h-2 bg-neo-pink animate-pulse inline-block" />
        </div>
      </div>

      {/* Terminal logs */}
      <div className="col-span-2 pl-1.5 flex flex-col justify-between bg-[color:var(--neo-bg-soft)] overflow-hidden">
        <div>
          <div className="font-extrabold text-[7px] border-b border-neo-border pb-0.5 uppercase opacity-60">Test Suite</div>
          <div className="mt-1 flex flex-col gap-0.5">
            {tests.map((t, idx) => {
              const isSuccess = t.includes('[✓]')
              return (
                <div key={idx} className={isSuccess ? 'text-green-500 font-extrabold' : 'text-[color:var(--neo-ink-soft)]'}>
                  {t}
                </div>
              )
            })}
          </div>
        </div>

        <div className="border-t border-neo-border pt-1">
          {status === 'CODING' && <div className="text-neo-blue font-bold animate-pulse">Writing fix...</div>}
          {status === 'TESTING' && <div className="text-neo-orange font-bold animate-bounce">Running PyTest...</div>}
          {status === 'MERGING' && (
            <div className="bg-neo-lime border border-neo-border text-[6px] font-black py-0.5 text-center text-black rounded animate-pulse">
              ✓ AUTO MERGED
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── 2. AI Workflows & LLM Orchestration ─── */
function AIWorkflowsAnimation({ isDarkMode }: { isDarkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let frame = 0

    function resize() {
      if (!canvas) return
      canvas.width = canvas.parentElement?.offsetWidth || 220
      canvas.height = 130
    }
    resize()
    window.addEventListener('resize', resize)

    const nodes = {
      trigger: { x: 30, y: 65, label: 'TRIGGER', color: '#eab308' },
      llm: { x: 105, y: 65, label: 'ROUTER', color: '#3b82f6' },
      tool: { x: 180, y: 35, label: 'TOOL', color: '#22c55e' },
      end: { x: 180, y: 95, label: 'OUTPUT', color: '#f97316' },
    }

    class WorkflowParticle {
      path: 'in' | 'tool' | 'out'
      progress: number
      speed: number
      color: string

      constructor(path: 'in' | 'tool' | 'out', color: string) {
        this.path = path
        this.progress = 0
        this.speed = 0.01 + Math.random() * 0.008
        this.color = color
      }

      update() {
        this.progress += this.speed
        if (this.progress > 1) {
          this.progress = 0
        }
      }

      draw(cCtx: CanvasRenderingContext2D) {
        let x = 0, y = 0
        const p = this.progress

        if (this.path === 'in') {
          x = nodes.trigger.x + (nodes.llm.x - nodes.trigger.x) * p
          y = nodes.trigger.y
        } else if (this.path === 'tool') {
          const cx = nodes.llm.x + (nodes.tool.x - nodes.llm.x) / 2
          const cy = nodes.tool.y - 10
          x = (1 - p) * (1 - p) * nodes.llm.x + 2 * (1 - p) * p * cx + p * p * nodes.tool.x
          y = (1 - p) * (1 - p) * nodes.llm.y + 2 * (1 - p) * p * cy + p * p * nodes.tool.y
        } else {
          const cx = nodes.llm.x + (nodes.end.x - nodes.llm.x) / 2
          const cy = nodes.end.y + 10
          x = (1 - p) * (1 - p) * nodes.llm.x + 2 * (1 - p) * p * cx + p * p * nodes.end.x
          y = (1 - p) * (1 - p) * nodes.llm.y + 2 * (1 - p) * p * cy + p * p * nodes.end.y
        }

        cCtx.beginPath()
        cCtx.arc(x, y, 3, 0, Math.PI * 2)
        cCtx.fillStyle = this.color
        cCtx.shadowColor = this.color
        cCtx.shadowBlur = 4
        cCtx.fill()
        cCtx.shadowBlur = 0
      }
    }

    const particles = [
      new WorkflowParticle('in', '#ec4899'),
      new WorkflowParticle('tool', '#22c55e'),
      new WorkflowParticle('out', '#f97316'),
    ]

    function draw() {
      if (!canvas || !ctx) return
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)
      frame++

      // Connections
      ctx.lineWidth = 1.5
      ctx.strokeStyle = isDarkMode ? '#374151' : '#e5e7eb'

      ctx.beginPath()
      ctx.moveTo(nodes.trigger.x, nodes.trigger.y)
      ctx.lineTo(nodes.llm.x, nodes.llm.y)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(nodes.llm.x, nodes.llm.y)
      ctx.quadraticCurveTo(nodes.llm.x + (nodes.tool.x - nodes.llm.x) / 2, nodes.tool.y - 10, nodes.tool.x, nodes.tool.y)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(nodes.llm.x, nodes.llm.y)
      ctx.quadraticCurveTo(nodes.llm.x + (nodes.end.x - nodes.llm.x) / 2, nodes.end.y + 10, nodes.end.x, nodes.end.y)
      ctx.stroke()

      particles.forEach((p) => {
        p.update()
        p.draw(ctx)
      })

      // Draw Nodes
      Object.values(nodes).forEach((n) => {
        ctx.fillStyle = 'black'
        ctx.fillRect(n.x - 20, n.y - 10, 40, 20)

        ctx.fillStyle = isDarkMode ? '#1f2937' : '#ffffff'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 1.5
        ctx.strokeRect(n.x - 22, n.y - 12, 40, 20)
        ctx.fillRect(n.x - 22, n.y - 12, 40, 20)

        ctx.fillStyle = n.color
        ctx.fillRect(n.x - 22, n.y - 12, 40, 3)

        ctx.font = 'bold 5.5px monospace'
        ctx.fillStyle = isDarkMode ? '#f3f4f6' : '#000000'
        ctx.textAlign = 'center'
        ctx.fillText(n.label, n.x, n.y + 3)
      })

      // LLM rotating radar
      ctx.save()
      ctx.translate(nodes.llm.x, nodes.llm.y - 3)
      ctx.rotate(frame * 0.06)
      ctx.strokeStyle = '#a78bfa'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(0, 0, 2.5, 0, Math.PI * 1.5)
      ctx.stroke()
      ctx.restore()

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [isDarkMode])

  return (
    <div className="w-full h-full bg-[color:var(--neo-surface-2)] overflow-hidden relative flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}

/* ─── 3. Full-Stack AI Application Development ─── */
function FullStackAIAnimation({ isDarkMode }: { isDarkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [msg, setMsg] = useState('Transcribing: "Make a dark UI..."')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let t = 0

    function resize() {
      if (!canvas) return
      canvas.width = canvas.parentElement?.offsetWidth || 130
      canvas.height = 36
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      if (!canvas || !ctx) return
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      // Dual overlaid waves
      ctx.beginPath()
      ctx.lineWidth = 1.6
      ctx.strokeStyle = 'rgba(6,182,212,0.8)'
      for (let x = 0; x < w; x++) {
        const y = h / 2 + Math.sin(x * 0.05 + t) * 6 + Math.cos(x * 0.02 - t) * 2
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      ctx.beginPath()
      ctx.lineWidth = 1.2
      ctx.strokeStyle = 'rgba(236,72,153,0.6)'
      for (let x = 0; x < w; x++) {
        const y = h / 2 + Math.sin(x * 0.08 - t * 1.3) * 5 + Math.cos(x * 0.045 + t) * 2.5
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      t += 0.075
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [isDarkMode])

  useEffect(() => {
    const sequence = [
      'Speaking: "Make a dark UI..."',
      'Transcribing: "Make a dark UI..."',
      'WebSocket: Streaming chunks...',
      'UI Dashboard fully rendered in 32ms!',
    ]
    let idx = 0
    const interval = setInterval(() => {
      setMsg(sequence[idx])
      idx = (idx + 1) % sequence.length
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full grid grid-cols-5 bg-[color:var(--neo-surface-2)] text-[7px] font-mono select-none p-1.5 gap-1">
      {/* Wave container */}
      <div className="col-span-3 flex flex-col justify-between overflow-hidden">
        <div className="h-[44px] border border-neo-border bg-black rounded shadow-neo-sm relative overflow-hidden flex items-center justify-center">
          <canvas ref={canvasRef} className="w-full h-full block" />
          <span className="absolute top-0.5 left-1 text-[5px] text-cyan-400 uppercase tracking-widest animate-pulse">Voice input</span>
        </div>
        <div className="border border-neo-border bg-neo-yellow text-black font-extrabold p-1 rounded text-[7.5px] truncate">
          🎙️ {msg}
        </div>
      </div>

      {/* Latency & stats */}
      <div className="col-span-2 flex flex-col justify-between bg-[color:var(--neo-bg-soft)] p-1 overflow-hidden">
        <div className="space-y-1">
          <div className="font-bold text-[6.5px] border-b border-neo-border pb-0.5 opacity-60">SOCKET</div>
          <div>Status: <span className="text-green-500 font-extrabold">LIVE</span></div>
          <div>Ping: <span className="text-neo-pink font-extrabold">24ms</span></div>
        </div>
        <div className="h-6 w-full flex items-end gap-0.5 border border-neo-border p-0.5 bg-[color:var(--neo-surface-2)] rounded">
          {[12, 28, 16, 35, 8, 22].map((val, idx) => (
            <div
              key={idx}
              className="flex-grow bg-neo-blue"
              style={{
                height: `${(val / 35) * 100}%`,
                animation: 'barCycle 1.5s ease-in-out infinite alternate',
                animationDelay: `${idx * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes barCycle {
          0% { transform: scaleY(0.7); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  )
}

/* ─── 4. GTM Tech Stack & Growth Engineering ─── */
function GTMTechAnimation({ isDarkMode }: { isDarkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [conversions, setConversions] = useState(1496)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const dataPoints = [15, 22, 18, 28, 25, 38, 30, 48]

    function resize() {
      if (!canvas) return
      canvas.width = canvas.parentElement?.offsetWidth || 130
      canvas.height = 36
    }
    resize()
    window.addEventListener('resize', resize)

    let offset = 0
    function draw() {
      if (!canvas || !ctx) return
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      // Draw sliding/pulsing line graph
      ctx.beginPath()
      ctx.lineWidth = 1.5
      ctx.strokeStyle = '#22c55e' // Lime

      const step = w / (dataPoints.length - 1)
      dataPoints.forEach((val, idx) => {
        const x = idx * step
        const wave = Math.sin(idx + offset) * 3
        const y = h - ((val + wave) / 60) * h - 5
        if (idx === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()

      // Glow fill below line
      ctx.lineTo(w, h)
      ctx.lineTo(0, h)
      ctx.fillStyle = 'rgba(34,197,94,0.06)'
      ctx.fill()

      offset += 0.05
      animId = requestAnimationFrame(draw)
    }
    draw()

    const interval = setInterval(() => {
      setConversions((prev) => prev + Math.floor(Math.random() * 2) + 1)
    }, 2800)

    return () => {
      cancelAnimationFrame(animId)
      clearInterval(interval)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="w-full h-full grid grid-cols-5 bg-[color:var(--neo-surface-2)] text-[7px] font-mono select-none p-1.5 gap-1.5">
      {/* Funnel chart */}
      <div className="col-span-3 flex flex-col justify-between overflow-hidden">
        <div className="h-[44px] border border-neo-border bg-[color:var(--neo-bg-soft)] rounded shadow-neo-sm relative overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full block" />
          <span className="absolute top-0.5 left-1 text-[5px] text-green-500 uppercase tracking-widest font-extrabold">Conversion rate</span>
        </div>
        <div className="flex items-center justify-between border border-neo-border p-1 bg-[color:var(--neo-bg-soft)] rounded text-[6.5px]">
          <span className="bg-neo-pink px-1 rounded text-black font-extrabold">Stripe</span>
          <span className="w-1.5 h-1.5 rounded-full bg-neo-lime animate-ping" />
          <span className="bg-neo-yellow px-1 rounded text-black font-extrabold">HubSpot</span>
        </div>
      </div>

      {/* Numerical statistics */}
      <div className="col-span-2 flex flex-col justify-between bg-[color:var(--neo-bg-soft)] p-1.5 border border-neo-border rounded shadow-neo-sm">
        <div className="space-y-1">
          <div className="font-extrabold text-[7px] uppercase border-b border-neo-border pb-0.5 opacity-60 text-center">GTM Stats</div>
          <div className="text-center">
            <div className="opacity-80 text-[6px]">CONVERSIONS</div>
            <div className="font-black text-xs text-black">{conversions}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── 5. Programmatic SEO & Content Engines ─── */
function ProgrammaticSEOAnimation({ isDarkMode }: { isDarkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [query, setQuery] = useState('')
  const [indexed, setIndexed] = useState<string[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let offset = 0

    function resize() {
      if (!canvas) return
      canvas.width = canvas.parentElement?.offsetWidth || 130
      canvas.height = 36
    }
    resize()
    window.addEventListener('resize', resize)

    // Growth Curve
    function draw() {
      if (!canvas || !ctx) return
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      ctx.beginPath()
      ctx.lineWidth = 1.5
      ctx.strokeStyle = '#f97316' // Orange

      // Exponential traffic graph
      for (let x = 0; x < w; x++) {
        const factor = x / w
        const y = h - Math.pow(factor, 3.5) * (h - 8) - 4 + Math.sin(x * 0.05 + offset) * 1.2
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      offset += 0.04
      animId = requestAnimationFrame(draw)
    }
    draw()

    // Query builder typing
    const queries = ['best agent workflow', 'hire ai agency dubai']
    const generated = [
      ['/seo/agent-work-flow', '/seo/top-ai-workflows'],
      ['/seo/ai-agency-dubai', '/seo/hire-agentic-devs'],
    ]
    let qIdx = 0
    let charIdx = 0
    let phase: 'typing' | 'gen' | 'wait' = 'typing'

    const interval = setInterval(() => {
      const currentQuery = queries[qIdx]
      if (phase === 'typing') {
        if (charIdx <= currentQuery.length) {
          setQuery(currentQuery.substring(0, charIdx))
          charIdx++
        } else {
          phase = 'gen'
          setIndexed([])
        }
      } else if (phase === 'gen') {
        const list = generated[qIdx]
        setIndexed((prev) => {
          if (prev.length < list.length) {
            return [...prev, list[prev.length]]
          } else {
            phase = 'wait'
            return prev
          }
        })
      } else if (phase === 'wait') {
        setTimeout(() => {
          phase = 'typing'
          charIdx = 0
          qIdx = (qIdx + 1) % queries.length
          setQuery('')
          setIndexed([])
        }, 1500)
      }
    }, 140)

    return () => {
      cancelAnimationFrame(animId)
      clearInterval(interval)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="w-full h-full grid grid-cols-5 bg-[color:var(--neo-surface-2)] text-[7px] font-mono select-none p-1.5 gap-1.5">
      {/* Keyword search bar & indexing status */}
      <div className="col-span-3 flex flex-col justify-between overflow-hidden">
        <div className="border border-neo-border bg-white text-black p-0.5 font-bold flex items-center gap-1 shadow-neo-sm rounded">
          <span>🔍</span>
          <span className="truncate text-[6px]">{query}</span>
          <span className="w-0.5 h-2 bg-black animate-ping" />
        </div>
        <div className="flex-grow flex flex-col justify-end gap-0.5 overflow-hidden py-1">
          {indexed.map((p, idx) => (
            <div key={idx} className="text-[6.5px] font-bold text-green-500 truncate">
              📄 Indexed: {p}
            </div>
          ))}
        </div>
      </div>

      {/* Traffic index chart */}
      <div className="col-span-2 flex flex-col justify-between bg-[color:var(--neo-bg-soft)] p-1 border border-neo-border rounded shadow-neo-sm relative overflow-hidden">
        <div className="h-[36px] w-full relative">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
        <span className="text-[5.5px] text-neo-orange font-bold text-center border-t border-neo-border pt-0.5">Organic Traffic</span>
      </div>
    </div>
  )
}

/* ─── 6. Cognitive Automation & Document Parsing ─── */
function CognitiveAutomationAnimation({ isDarkMode }: { isDarkMode: boolean }) {
  const [extracted, setExtracted] = useState<Record<string, string>>({})

  useEffect(() => {
    const states: Record<string, string>[] = [
      {},
      { Vendor: 'ApexCorp' },
      { Vendor: 'ApexCorp', Total: '$1,240' },
      { Vendor: 'ApexCorp', Total: '$1,240', Status: 'OK' },
    ]
    let idx = 0
    const interval = setInterval(() => {
      setExtracted(states[idx])
      idx = (idx + 1) % states.length
    }, 1400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full grid grid-cols-5 bg-[color:var(--neo-surface-2)] text-[7px] font-mono select-none p-1.5 gap-1.5">
      {/* Mock PDF Document with highlighted zones */}
      <div className="col-span-2 border border-neo-border bg-white rounded shadow-neo-sm relative overflow-hidden flex flex-col gap-1 p-1">
        <div className="w-4/5 h-1 bg-gray-300 rounded relative">
          {/* Mock Field Bounding box */}
          <div className="absolute inset-0 border border-neo-blue bg-neo-blue/10 rounded" />
        </div>
        <div className="w-full h-1 bg-gray-200 rounded relative">
          <div className="absolute inset-0 border border-neo-pink bg-neo-pink/10 rounded" />
        </div>
        <div className="w-2/3 h-1 bg-gray-200 rounded" />
        <div className="w-1/2 h-1 bg-gray-200 rounded relative">
          <div className="absolute inset-0 border border-neo-lime bg-neo-lime/10 rounded" />
        </div>

        {/* OCR Green laser scan line */}
        <div className="absolute left-0 right-0 h-0.5 bg-neo-pink border-t border-neo-pink shadow-[0_0_5px_rgba(236,72,153,0.8)] animate-ocr-scan" />
      </div>

      {/* Parsed JSON fields */}
      <div className="col-span-3 font-mono text-[6.8px] font-bold border border-neo-border bg-[color:var(--neo-bg-soft)] p-1.5 rounded shadow-neo-sm flex flex-col justify-center text-[color:var(--neo-ink)] leading-normal overflow-hidden">
        <div className="text-neo-blue">{"{"}</div>
        {Object.entries(extracted).map(([k, v]) => (
          <div key={k} className="pl-1.5 truncate">
            &quot;{k}&quot;: <span className={k === 'Status' ? 'text-green-500 font-extrabold' : 'text-neo-orange'}>&quot;{v}&quot;</span>
          </div>
        ))}
        <div className="text-neo-blue">{"}"}</div>
      </div>

      <style>{`
        @keyframes ocr-scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .animate-ocr-scan {
          animation: ocr-scan 2.4s linear infinite;
        }
      `}</style>
    </div>
  )
}

/* ─── 7. Cyber Security / Pen-Testing ─── */
function CyberSecurityAnimation({ isDarkMode }: { isDarkMode: boolean }) {
  const [logs, setLogs] = useState<string[]>([])
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    const lines = [
      'Initializing pen-test runner...',
      'Scanning ports: 22, 80, 443, 8080...',
      'Port 22 [SSH]: open (OpenSSH 8.2)',
      'Port 80 [HTTP]: closed',
      'Port 443 [HTTPS]: open (SSL v3 detected)',
      'CVE-2023-4871: checking vulnerability...',
      '[WARNING] Outdated TLS version cipher suite',
      'CVE-2024-1960: testing SQL injection exploit...',
      '[SAFE] Input sanitized correctly',
      '[SUCCESS] Pen-test complete. Report generated.',
    ]

    let idx = 0
    let progress = 0
    let logInterval: ReturnType<typeof setInterval>
    let progressInterval: ReturnType<typeof setInterval>

    const run = () => {
      setLogs([])
      setScanProgress(0)
      idx = 0
      progress = 0

      progressInterval = setInterval(() => {
        progress += 4
        if (progress > 100) progress = 100
        setScanProgress(progress)
      }, 150)

      logInterval = setInterval(() => {
        if (idx < lines.length) {
          setLogs((prev) => [...prev, lines[idx]])
          idx++
        } else {
          clearInterval(logInterval)
          clearInterval(progressInterval)
          setTimeout(() => {
            run()
          }, 3000)
        }
      }, 700)
    }

    run()
    return () => {
      clearInterval(logInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="w-full h-full grid grid-cols-5 bg-black text-[7px] font-mono select-none p-1.5 text-green-400">
      <div className="col-span-3 pr-1.5 flex flex-col justify-between overflow-hidden">
        <div>
          <div className="flex items-center justify-between border-b border-gray-800 pb-1 mb-1 opacity-70 text-[6.5px]">
            <span>🛡️ SEC-SCANNER v2.4</span>
            <span>IP: 192.168.1.104</span>
          </div>
          <div className="flex flex-col gap-0.5 leading-normal max-h-[90px] overflow-hidden">
            {logs.slice(-6).map((log, lIdx) => {
              const isWarning = log.includes('WARNING')
              const isSuccess = log.includes('SUCCESS')
              const isSafe = log.includes('SAFE')
              const cls = isWarning
                ? 'text-red-500 font-extrabold animate-pulse'
                : isSuccess
                ? 'text-green-500 font-extrabold'
                : isSafe
                ? 'text-cyan-400 font-extrabold'
                : 'text-gray-400'
              return (
                <div key={lIdx} className={`truncate ${cls}`}>
                  &gt; {log}
                </div>
              )
            })}
            {logs.length < 10 && <span className="w-1.5 h-2.5 bg-green-400 animate-ping inline-block" />}
          </div>
        </div>
        <div className="border-t border-gray-800 pt-1 flex justify-between items-center text-[6px]">
          <span>SCANNING STATUS: {scanProgress}%</span>
          <div className="w-12 bg-gray-900 border border-gray-700 h-1.5 rounded overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: `${scanProgress}%` }} />
          </div>
        </div>
      </div>
      <div className="col-span-2 pl-1.5 flex flex-col items-center justify-center bg-gray-950 border-l border-gray-800">
        <svg
          className={`w-10 h-10 ${scanProgress < 100 ? 'text-red-500 animate-pulse' : 'text-green-500'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span className="font-extrabold mt-1 text-[5.5px] tracking-widest text-center">
          {scanProgress < 100 ? 'THREAT DETECTED' : 'SYSTEM SECURE'}
        </span>
      </div>
    </div>
  )
}

/* ─── 8. Cloud Kubernetes Infrastructure ─── */
function CloudInfrastructureAnimation({ isDarkMode }: { isDarkMode: boolean }) {
  const [pods, setPods] = useState<{ id: number; status: 'RUNNING' | 'PENDING'; cpu: number }[]>([
    { id: 1, status: 'RUNNING', cpu: 45 },
    { id: 2, status: 'RUNNING', cpu: 62 },
    { id: 3, status: 'RUNNING', cpu: 12 },
  ])
  const [statusMsg, setStatusMsg] = useState('REPLICAS HEALTHY (3/3)')
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1)
      setPods((prev) => {
        const next = prev.map((p) => {
          const delta = Math.floor(Math.random() * 20) - 10
          let newCpu = Math.max(5, Math.min(95, p.cpu + delta))
          return { ...p, cpu: newCpu }
        })

        if (Math.random() < 0.15) {
          const isPending = next[2].status === 'PENDING'
          next[2] = {
            ...next[2],
            status: isPending ? 'RUNNING' : 'PENDING',
            cpu: isPending ? 10 : 0,
          }
          setStatusMsg(isPending ? 'SCALING POD-3 UP...' : 'SCALING DOWN POD-3...')
        } else {
          const activePods = next.filter((p) => p.status === 'RUNNING').length
          setStatusMsg(`POD REPLICAS ACTIVE: ${activePods}/3`)
        }
        return next
      })
    }, 1800)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full grid grid-cols-5 bg-[color:var(--neo-surface-2)] text-[7px] font-mono select-none p-1.5 gap-1.5">
      <div className="col-span-3 border border-neo-border bg-[color:var(--neo-bg-soft)] rounded p-1 flex items-center justify-between relative overflow-hidden">
        <div className="flex flex-col items-center gap-1 z-10">
          <div className="w-6 h-6 bg-neo-yellow border-2 border-black rounded flex items-center justify-center font-extrabold text-[7.5px] text-black">
            LB
          </div>
          <span className="text-[5px]">NGINX</span>
        </div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {pods.map((p, idx) => {
            const y = idx === 0 ? 22 : idx === 1 ? 55 : 88
            const isActive = p.status === 'RUNNING'
            return (
              <path
                key={idx}
                d={`M 30 55 Q 50 ${y} 70 ${y}`}
                fill="none"
                stroke={isActive ? '#22c55e' : '#6b7280'}
                strokeWidth="1"
                strokeDasharray="4 4"
                style={{
                  strokeDashoffset: isActive ? tick * -5 : 0,
                  transition: 'stroke 0.3s ease',
                }}
              />
            )
          })}
        </svg>

        <div className="flex flex-col gap-1 z-10 pr-2">
          {pods.map((p) => {
            const isRunning = p.status === 'RUNNING'
            const barColor = p.cpu > 80 ? 'bg-red-500' : p.cpu > 50 ? 'bg-neo-orange' : 'bg-neo-lime'
            return (
              <div
                key={p.id}
                className={`p-0.5 border border-black rounded flex flex-col justify-between w-[64px] h-[34px] transition-opacity duration-300 ${
                  isRunning ? 'bg-white text-black opacity-100' : 'bg-gray-200 text-gray-500 opacity-40'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-[5.2px]">
                  <span>pod-{p.id}</span>
                  <span className={isRunning ? 'text-green-600 font-extrabold animate-pulse' : 'text-gray-400'}>
                    ● {p.status}
                  </span>
                </div>
                {isRunning && (
                  <div className="flex items-center gap-0.5 text-[4.8px]">
                    <span>CPU</span>
                    <div className="flex-grow bg-gray-200 h-0.5 rounded overflow-hidden">
                      <div className={`h-full ${barColor}`} style={{ width: `${p.cpu}%`, transition: 'width 0.5s ease' }} />
                    </div>
                    <span>{p.cpu}%</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="col-span-2 flex flex-col justify-between bg-[color:var(--neo-surface-2)] p-1 overflow-hidden border border-neo-border rounded">
        <div>
          <div className="font-extrabold text-[6.5px] border-b border-neo-border pb-0.5 opacity-60 uppercase">Kubectl Logs</div>
          <div className="mt-1 flex flex-col gap-0.5 leading-tight text-[5.8px] text-[color:var(--neo-ink-soft)]">
            <div>&gt; k8s-mesh active</div>
            <div className="text-neo-blue font-bold truncate">{statusMsg}</div>
            <div>&gt; latency: 3.5ms</div>
          </div>
        </div>
        <div className="h-4 flex items-center justify-center bg-black text-white font-extrabold text-[5.5px] rounded animate-pulse uppercase">
          ☸️ active nodes
        </div>
      </div>
    </div>
  )
}

/* ─── 9. Computer Vision Detection ─── */
function ComputerVisionAnimation({ isDarkMode }: { isDarkMode: boolean }) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    let anim: number
    const draw = () => {
      setFrame((f) => f + 1)
      anim = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(anim)
  }, [])

  const box1X = 20 + Math.sin(frame * 0.03) * 15
  const box1Y = 20 + Math.cos(frame * 0.04) * 10
  const box2X = 85 + Math.cos(frame * 0.02) * 15
  const box2Y = 55 + Math.sin(frame * 0.03) * 12

  const laserY = 10 + ((frame * 1.2) % 110)

  return (
    <div className="w-full h-full grid grid-cols-5 bg-black text-[7px] font-mono select-none p-1.5 gap-1.5 text-cyan-400">
      <div className="col-span-3 border-2 border-neo-border rounded relative overflow-hidden bg-gray-950 flex items-center justify-center">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(18,220,228,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(18,220,228,0.15)_1px,transparent_1px)] bg-[size:10px_10px]" />

        <div
          className="absolute left-0 right-0 h-0.5 bg-green-500 shadow-[0_0_8px_#22c55e]"
          style={{ top: `${laserY}px` }}
        />

        <div
          className="absolute border border-red-500 bg-red-500/10 p-0.5 flex flex-col justify-between"
          style={{
            left: `${box1X}px`,
            top: `${box1Y}px`,
            width: '45px',
            height: '35px',
            transition: 'all 0.05s linear',
          }}
        >
          <span className="text-[4.5px] text-red-500 bg-black/80 font-bold px-0.5 leading-none self-start">
            person [98%]
          </span>
          <span className="text-[4px] text-red-400 leading-none">
            x:{Math.floor(box1X)} y:{Math.floor(box1Y)}
          </span>
        </div>

        <div
          className="absolute border border-neo-yellow bg-neo-yellow/10 p-0.5 flex flex-col justify-between"
          style={{
            left: `${box2X}px`,
            top: `${box2Y}px`,
            width: '35px',
            height: '40px',
            transition: 'all 0.05s linear',
          }}
        >
          <span className="text-[4.5px] text-yellow-500 bg-black/80 font-bold px-0.5 leading-none self-start">
            laptop [89%]
          </span>
          <span className="text-[4px] text-yellow-400 leading-none">
            x:{Math.floor(box2X)} y:{Math.floor(box2Y)}
          </span>
        </div>

        <div className="w-4 h-4 border border-green-500/30 rounded-full flex items-center justify-center animate-ping" />
        <div className="absolute top-1 right-1 flex items-center gap-1 text-[5px] text-red-500 font-extrabold uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          REC
        </div>
      </div>

      <div className="col-span-2 flex flex-col justify-between bg-gray-900 border border-gray-800 p-1.5 rounded">
        <div className="space-y-1">
          <div className="font-extrabold text-[6.5px] border-b border-gray-700 pb-0.5 text-white">YOLOv8 Stream</div>
          <div className="text-gray-400 flex flex-col gap-0.5 text-[5.8px]">
            <div>FPS: <span className="text-white font-extrabold">62.4</span></div>
            <div>Latency: <span className="text-white font-extrabold">12ms</span></div>
            <div className="truncate text-green-400 font-extrabold">2 detected</div>
          </div>
        </div>
        <div className="border border-green-800 bg-green-950/50 text-[6px] text-green-300 py-0.5 text-center font-bold rounded">
          COCO-128
        </div>
      </div>
    </div>
  )
}

/* ─── 10. ML Model Training Curve ─── */
function MLModelTrainingAnimation({ isDarkMode }: { isDarkMode: boolean }) {
  const [lossPoints, setLossPoints] = useState<number[]>([0.9, 0.75, 0.6, 0.48, 0.4, 0.32, 0.28])
  const [epoch, setEpoch] = useState(1)
  const [accuracy, setAccuracy] = useState(65.4)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let t = 0

    function draw() {
      if (!canvas || !ctx) return
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      ctx.strokeStyle = isDarkMode ? 'rgba(55,65,81,0.2)' : 'rgba(229,231,235,0.2)'
      ctx.lineWidth = 0.5
      for (let x = 0; x < w; x += 15) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += 10) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      ctx.beginPath()
      ctx.lineWidth = 1.5
      ctx.strokeStyle = '#f43f5e'
      const step = w / (lossPoints.length - 1)
      lossPoints.forEach((p, idx) => {
        const x = idx * step
        const y = 8 + p * (h - 16)
        if (idx === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()

      ctx.fillStyle = '#f43f5e'
      lossPoints.forEach((p, idx) => {
        const x = idx * step
        const y = 8 + p * (h - 16)
        ctx.beginPath()
        ctx.arc(x, y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    const interval = setInterval(() => {
      setEpoch((ep) => {
        const nextEp = ep + 1
        setLossPoints((prev) => {
          const next = [...prev]
          next.shift()
          const lastVal = next[next.length - 1]
          const drop = Math.random() * 0.05
          const noise = (Math.random() - 0.5) * 0.03
          const newVal = Math.max(0.05, Math.min(0.95, lastVal - drop + noise))
          next.push(newVal)
          return next
        })
        setAccuracy((acc) => {
          const delta = Math.random() * 1.5
          return Math.min(99.4, Number((acc + delta).toFixed(2)))
        })
        return nextEp
      })
    }, 1500)

    return () => {
      cancelAnimationFrame(animId)
      clearInterval(interval)
    }
  }, [lossPoints, isDarkMode])

  return (
    <div className="w-full h-full grid grid-cols-5 bg-[color:var(--neo-surface-2)] text-[7px] font-mono select-none p-1.5 gap-1.5">
      <div className="col-span-3 flex flex-col justify-between overflow-hidden">
        <div className="h-[44px] border border-neo-border bg-[color:var(--neo-bg-soft)] rounded relative overflow-hidden">
          <canvas ref={canvasRef} width="130" height="42" className="w-full h-full block" />
          <span className="absolute top-0.5 left-1 text-[5px] text-rose-500 uppercase tracking-widest font-extrabold">Loss Function</span>
        </div>
        <div className="flex items-center justify-between border border-neo-border px-1 py-0.5 bg-[color:var(--neo-bg-soft)] rounded text-[5.8px]">
          <span>Optim: ADAM</span>
          <span className="bg-neo-yellow text-black font-extrabold px-1 rounded text-[5.2px]">LR: 1e-4</span>
        </div>
      </div>

      <div className="col-span-2 flex flex-col justify-between bg-[color:var(--neo-bg-soft)] border border-neo-border p-1 rounded shadow-neo-sm">
        <div className="space-y-1 text-[5.8px]">
          <div className="font-extrabold text-[6.5px] border-b border-neo-border pb-0.5 text-center">TRAIN LOG</div>
          <div>Epoch: <span className="text-neo-blue font-extrabold">{epoch}</span></div>
          <div>Loss: <span className="text-rose-500 font-extrabold">{(lossPoints[lossPoints.length - 1] * 2).toFixed(4)}</span></div>
          <div className="truncate">Acc: <span className="text-green-500 font-extrabold">{accuracy}%</span></div>
        </div>
        <div className="h-3 flex items-center justify-center bg-neo-pink text-black font-extrabold text-[5px] rounded animate-pulse">
          BACKPROP RUNNING
        </div>
      </div>
    </div>
  )
}

/* ─── 11. DB Replication & Sync ─── */
function DBReplicationAnimation({ isDarkMode }: { isDarkMode: boolean }) {
  const [tps, setTps] = useState(128)
  const [syncState, setSyncState] = useState('SYNCHRONIZED')
  const [txCount, setTxCount] = useState(99412)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1)
      setTps(Math.floor(100 + Math.random() * 80))
      setTxCount((c) => c + Math.floor(Math.random() * 5) + 1)
      
      if (Math.random() < 0.15) {
        setSyncState('LAG: 1.2s')
        setTimeout(() => setSyncState('SYNCHRONIZED'), 1500)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full grid grid-cols-5 bg-[color:var(--neo-surface-2)] text-[7px] font-mono select-none p-1.5 gap-1.5">
      <div className="col-span-3 border border-neo-border bg-[color:var(--neo-bg-soft)] rounded p-1 flex items-center justify-between relative overflow-hidden">
        <div className="flex flex-col items-center gap-0.5 z-10">
          <div className="w-7 h-7 bg-neo-pink border-2 border-black rounded flex flex-col items-center justify-center font-extrabold text-[6px] text-black">
            <span>Pri</span>
            <span className="text-[4px] leading-none">W</span>
          </div>
          <span className="text-[5px]">PG-SQL</span>
        </div>

        <div className="flex-grow flex items-center justify-center relative h-full">
          <div className="w-full h-0.5 border-t-2 border-dashed border-black relative">
            <div
              className="absolute w-1.5 h-1.5 bg-neo-lime border border-black rounded-full -top-1"
              style={{
                left: `${(tick * 35) % 100}%`,
                transition: 'left 1s linear',
              }}
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-0.5 z-10">
          <div className="w-7 h-7 bg-neo-cyan border-2 border-black rounded flex flex-col items-center justify-center font-extrabold text-[6px] text-black">
            <span>Repl</span>
            <span className="text-[4px] leading-none">R</span>
          </div>
          <span className="text-[5px]">READONLY</span>
        </div>
      </div>

      <div className="col-span-2 flex flex-col justify-between bg-[color:var(--neo-bg-soft)] border border-neo-border p-1 rounded shadow-neo-sm">
        <div className="space-y-0.5 text-[5.8px]">
          <div className="font-extrabold text-[6.5px] border-b border-neo-border pb-0.5 text-center">REPLICAS</div>
          <div className="text-center py-0.5">
            <div
              className={`text-[9px] font-black rounded text-center transition-all ${
                syncState === 'SYNCHRONIZED' ? 'text-green-500' : 'text-neo-orange animate-pulse'
              }`}
            >
              {syncState}
            </div>
          </div>
          <div className="leading-tight text-[5.5px] text-[color:var(--neo-ink-soft)]">
            <div>TPS: <span className="font-extrabold text-black">{tps} tx/s</span></div>
            <div className="truncate">Total: <span className="font-extrabold text-black">{txCount}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── 12. Blockchain Ledger ─── */
function BlockchainLedgerAnimation({ isDarkMode }: { isDarkMode: boolean }) {
  const [blocks, setBlocks] = useState([
    { id: 4120, hash: '0000a12e', state: 'VALIDATED' },
    { id: 4121, hash: '000084fc', state: 'VALIDATED' },
    { id: 4122, hash: '0000efbc', state: 'VALIDATING' },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setBlocks((prev) => {
        const next = [...prev]
        next[2] = { ...next[2], state: 'VALIDATED' }

        const newId = next[2].id + 1
        const newHashHex = Math.floor(Math.random() * 65535).toString(16).padStart(4, '0')
        
        next.shift()
        next.push({
          id: newId,
          hash: `0000${newHashHex}`,
          state: 'VALIDATING',
        })
        return next
      })
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full grid grid-cols-5 bg-[color:var(--neo-surface-2)] text-[7px] font-mono select-none p-1.5 gap-1.5">
      <div className="col-span-3 border border-neo-border bg-[color:var(--neo-bg-soft)] rounded p-1 flex items-center justify-between gap-1 overflow-hidden relative">
        {blocks.map((b, idx) => {
          const isValidated = b.state === 'VALIDATED'
          const borderClass = isValidated ? 'border-neo-lime bg-white' : 'border-neo-orange bg-neo-yellow/10'
          return (
            <div
              key={b.id}
              className={`flex-grow h-24 border rounded p-0.5 flex flex-col justify-between relative text-black text-[5.2px] transition-all duration-300 ${borderClass}`}
            >
              <div className="font-extrabold flex justify-between border-b border-black/10 pb-0.5">
                <span>#{b.id}</span>
                <span className={isValidated ? 'text-green-600' : 'text-neo-orange animate-pulse'}>
                  {isValidated ? '✓' : '⚙️'}
                </span>
              </div>
              <div className="text-[4.8px] leading-tight select-none">
                <div>HASH:</div>
                <div className="font-mono text-neo-blue">{b.hash}</div>
              </div>
              <div
                className={`text-[4.5px] font-bold text-center px-0.5 rounded leading-normal ${
                  isValidated ? 'bg-green-100 text-green-700' : 'bg-neo-orange/20 text-neo-orange animate-pulse'
                }`}
              >
                {b.state}
              </div>
            </div>
          )
        })}
      </div>

      <div className="col-span-2 flex flex-col justify-between bg-[color:var(--neo-bg-soft)] border border-neo-border p-1 rounded shadow-neo-sm">
        <div className="space-y-0.5 text-[5.8px]">
          <div className="font-extrabold text-[6.5px] border-b border-neo-border pb-0.5 text-center">LEDGER</div>
          <div className="flex flex-col gap-0.5 text-[5.2px] leading-tight text-[color:var(--neo-ink-soft)]">
            <div>Gas: <span className="font-bold text-black">24 Gwei</span></div>
            <div>Diff: <span className="font-bold text-black">12T</span></div>
            <div className="truncate">Solidity: <span className="font-bold text-neo-pink">EVM</span></div>
          </div>
        </div>
        <div className="h-3 flex items-center justify-center bg-black text-white font-extrabold text-[5px] rounded truncate px-0.5">
          BLOCK MINED
        </div>
      </div>
    </div>
  )
}
