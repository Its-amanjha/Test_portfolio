'use client'

import { useEffect, useRef, useState } from 'react'

const cards = [ComputerVisionCard, DeepLearningDSPCard, CloudInfraCard] as const

export default function AnimatedTechCards() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [cardIndex, setCardIndex] = useState(0)

  useEffect(() => {
    setCardIndex(Math.floor(Math.random() * cards.length))
    const update = () => setIsDarkMode(document.documentElement.classList.contains('dark-mode'))
    update()
    const obs = new MutationObserver(update)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    // Cycle through cards every 6 seconds
    const interval = setInterval(() => {
      setCardIndex((prev) => (prev + 1) % cards.length)
    }, 6000)

    return () => {
      obs.disconnect()
      clearInterval(interval)
    }
  }, [])

  const Card = cards[cardIndex]

  return (
    <div className="mt-6 transition-all duration-500 ease-in-out">
      <Card isDarkMode={isDarkMode} />
    </div>
  )
}

/* ─── Card 1: Computer Vision & Object Detection (YOLO / OpenCV) ─── */
function ComputerVisionCard({ isDarkMode }: { isDarkMode: boolean }) {
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
      canvas.width = canvas.parentElement?.offsetWidth || 260
      canvas.height = 120
    }
    resize()
    window.addEventListener('resize', resize)

    // Bounding boxes definition
    const detections = [
      { x: 30, y: 25, w: 70, h: 75, label: 'PERSON [98%]', color: '#22c55e' }, // Lime
      { x: 135, y: 40, w: 45, h: 55, label: 'LAPTOP [94%]', color: '#3b82f6' }, // Blue
      { x: 200, y: 55, w: 30, h: 40, label: 'CUP [89%]', color: '#f97316' }, // Orange
    ]

    function draw() {
      if (!canvas || !ctx) return
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)
      frame++

      // Draw grid pattern (camera viewport layout)
      ctx.strokeStyle = isDarkMode ? 'rgba(55,65,81,0.3)' : 'rgba(229,231,235,0.8)'
      ctx.lineWidth = 1
      const gridSize = 15
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      // Draw Camera UI Corners
      ctx.strokeStyle = isDarkMode ? '#f3f4f6' : '#000000'
      ctx.lineWidth = 2.5
      const pad = 8
      // Top Left
      ctx.beginPath()
      ctx.moveTo(pad, pad + 10)
      ctx.lineTo(pad, pad)
      ctx.lineTo(pad + 10, pad)
      ctx.stroke()
      // Top Right
      ctx.beginPath()
      ctx.moveTo(w - pad - 10, pad)
      ctx.lineTo(w - pad, pad)
      ctx.lineTo(w - pad, pad + 10)
      ctx.stroke()
      // Bottom Left
      ctx.beginPath()
      ctx.moveTo(pad, h - pad - 10)
      ctx.lineTo(pad, h - pad)
      ctx.lineTo(pad + 10, h - pad)
      ctx.stroke()
      // Bottom Right
      ctx.beginPath()
      ctx.moveTo(w - pad - 10, h - pad)
      ctx.lineTo(w - pad, h - pad)
      ctx.lineTo(w - pad, h - pad - 10)
      ctx.stroke()

      // Draw dynamic detections
      detections.forEach((det, idx) => {
        const offset = Math.sin(frame * 0.05 + idx) * 1.5
        const curX = det.x + offset
        const curY = det.y - offset
        const curW = det.w + offset * 0.5
        const curH = det.h - offset * 0.5

        // Bounding box rectangle
        ctx.strokeStyle = det.color
        ctx.lineWidth = 2
        ctx.strokeRect(curX, curY, curW, curH)

        // Corner brackets on boxes
        ctx.fillStyle = det.color
        ctx.fillRect(curX - 2, curY - 2, 6, 2)
        ctx.fillRect(curX - 2, curY - 2, 2, 6)

        // Label box (Neobrutalist tag)
        ctx.fillStyle = '#000000'
        ctx.fillRect(curX, curY - 11, det.label.length * 4.5 + 4, 11)

        ctx.fillStyle = det.color
        ctx.fillRect(curX - 1, curY - 12, det.label.length * 4.5 + 4, 11)
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 1.2
        ctx.strokeRect(curX - 1, curY - 12, det.label.length * 4.5 + 4, 11)

        // Label text
        ctx.font = 'bold 5.5px monospace'
        ctx.fillStyle = '#000000'
        ctx.fillText(det.label, curX + 2, curY - 4)
      })

      // Viewport target crosshair
      ctx.strokeStyle = 'rgba(236,72,153,0.8)' // Pink
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(w / 2, h / 2, 8, 0, Math.PI * 2)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(w / 2 - 12, h / 2)
      ctx.lineTo(w / 2 + 12, h / 2)
      ctx.moveTo(w / 2, h / 2 - 12)
      ctx.lineTo(w / 2, h / 2 + 12)
      ctx.stroke()

      // Scanning overlay sweep
      ctx.fillStyle = 'rgba(34,197,94,0.04)'
      const sweepY = (frame * 1.2) % h
      ctx.fillRect(0, sweepY - 5, w, 6)
      ctx.strokeStyle = 'rgba(34,197,94,0.2)'
      ctx.beginPath()
      ctx.moveTo(0, sweepY)
      ctx.lineTo(w, sweepY)
      ctx.stroke()

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [isDarkMode])

  return (
    <CardShell
      isDarkMode={isDarkMode}
      icon={
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="3" width="16" height="14" rx="2" stroke={isDarkMode ? '#22c55e' : '#16a34a'} strokeWidth="1.5" />
          <circle cx="10" cy="10" r="3" fill="none" stroke={isDarkMode ? '#22c55e' : '#16a34a'} strokeWidth="1.5" />
        </svg>
      }
      title="Computer Vision & Detection"
      sub="yolov8 · opencv · real-time"
      badge="Computer Vision"
      badgeClass={isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'}
    >
      <div className="relative w-full h-[120px] bg-[color:var(--neo-surface-2)] overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </CardShell>
  )
}

/* ─── Card 2: Deep Learning & Digital Signal Processing (Mel-Spectrogram / EEG / MRI) ─── */
function DeepLearningDSPCard({ isDarkMode }: { isDarkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [prediction, setPrediction] = useState('MEL-SPECTROGRAM')
  const [loss, setLoss] = useState(0.482)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let frame = 0

    function resize() {
      if (!canvas) return
      canvas.width = canvas.parentElement?.offsetWidth || 150
      canvas.height = 120
    }
    resize()
    window.addEventListener('resize', resize)

    // Draw Spectrogram matrix grids
    function draw() {
      if (!canvas || !ctx) return
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)
      frame++

      const cols = 16
      const rows = 8
      const cellW = w / cols
      const cellH = h / rows

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Math functions representing a frequency spectrogram
          const val = Math.sin(c * 0.4 + frame * 0.05) * Math.cos(r * 0.6 - frame * 0.03)
          const norm = (val + 1) / 2

          // Purple/Pink Neobrutalist colormap
          const red = Math.floor(124 + norm * 131) // 124 to 255
          const green = Math.floor(58 + norm * 80) // 58 to 138
          const blue = Math.floor(237 - norm * 100) // 237 to 137

          ctx.fillStyle = `rgb(${red},${green},${blue})`
          ctx.fillRect(c * cellW + 1, r * cellH + 1, cellW - 2, cellH - 2)
        }
      }

      // Vertical scanner bar
      const barX = (frame * 1.5) % w
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.fillRect(barX - 2, 0, 4, h)

      animId = requestAnimationFrame(draw)
    }
    draw()

    const predList = ['MEL-SPECTROGRAM', 'AUDIO SIGNAL', 'EEG DATA', 'CLEAN AUDIO OUTPUT']
    const interval = setInterval(() => {
      setPrediction(predList[Math.floor(Math.random() * predList.length)])
      setLoss(0.012 + Math.random() * 0.04)
    }, 2000)

    return () => {
      cancelAnimationFrame(animId)
      clearInterval(interval)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <CardShell
      isDarkMode={isDarkMode}
      icon={
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M2 10h3l3-7 4 14 3-7h3" stroke={isDarkMode ? '#a78bfa' : '#7c3aed'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      }
      title="Medical Imaging & Signal DSP"
      sub="spectrograms · classification · pytorch"
      badge="Deep Learning"
      badgeClass={isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}
    >
      <div className="w-full h-[120px] grid grid-cols-5 bg-[color:var(--neo-surface-2)] text-[7.5px] font-mono select-none">
        {/* Left Side: Spectrogram heat map */}
        <div className="col-span-3 border-r border-neo-border relative overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full block" />
          <span className="absolute top-1 left-2 text-[5.5px] text-white uppercase bg-black/60 px-1 py-0.5 rounded font-extrabold tracking-wider">DSP Spectrum</span>
        </div>

        {/* Right Side: Prediction classification info */}
        <div className="col-span-2 p-2 flex flex-col justify-between bg-[color:var(--neo-bg-soft)]">
          <div className="space-y-1.5">
            <div className="font-extrabold text-[7.5px] border-b border-neo-border pb-0.5 uppercase opacity-60">ML Classifier</div>
            <div>
              <div className="opacity-70 text-[6.5px]">PREDICTION</div>
              <div className="font-black text-neo-pink truncate">{prediction}</div>
            </div>
            <div>
              <div className="opacity-70 text-[6.5px]">TEST LOSS</div>
              <div className="font-extrabold text-[color:var(--neo-ink)]">{loss.toFixed(4)}</div>
            </div>
          </div>
          <div className="bg-neo-lime border border-neo-border text-[6.5px] font-black py-0.5 text-center text-black rounded animate-pulse">
            CLASSIFICATION OK
          </div>
        </div>
      </div>
    </CardShell>
  )
}

/* ─── Card 3: Cloud Architecture & Multi-Node Cluster (Kubernetes / Docker) ─── */
function CloudInfraCard({ isDarkMode }: { isDarkMode: boolean }) {
  const [reqs, setReqs] = useState(1048)
  const [activeReplica, setActiveReplica] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setReqs((prev) => prev + Math.floor(Math.random() * 8) + 2)
      setActiveReplica(Math.floor(Math.random() * 3))
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <CardShell
      isDarkMode={isDarkMode}
      icon={
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M10 2l8 4.5v9L10 20l-8-4.5v-9L10 2z" stroke={isDarkMode ? '#60a5fa' : '#2563eb'} strokeWidth="1.5" />
          <path d="M10 2v18M2 6.5l16 9M18 6.5l-16 9" stroke={isDarkMode ? '#60a5fa' : '#2563eb'} strokeWidth="1.2" opacity="0.6" />
        </svg>
      }
      title="Edge & Cloud Infrastructure"
      sub="kubernetes · replicas · devops"
      badge="Cloud Infrastructure"
      badgeClass={isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'}
    >
      <div className="w-full h-[120px] grid grid-cols-5 bg-[color:var(--neo-surface-2)] text-[7.5px] font-mono select-none p-2 gap-1.5">
        {/* Left Side: Server cluster nodes */}
        <div className="col-span-3 flex flex-col justify-between overflow-hidden gap-1.5">
          <div className="font-extrabold text-[7.5px] uppercase opacity-60 border-b border-neo-border pb-0.5">Load Balancer</div>

          {[0, 1, 2].map((idx) => {
            const isActive = activeReplica === idx
            return (
              <div
                key={idx}
                className={`flex items-center justify-between border-2 border-neo-border px-2 py-1 rounded shadow-neo-sm transition-all duration-300 ${
                  isActive ? 'bg-neo-yellow text-black font-extrabold scale-[1.02]' : 'bg-[color:var(--neo-bg-soft)] text-[color:var(--neo-ink-soft)]'
                }`}
              >
                <span>Pod-Replica-{String.fromCharCode(65 + idx)}</span>
                <span className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-600 animate-ping' : 'bg-green-500'}`} />
                  <span className="text-[6.5px] font-bold">{isActive ? 'ACTIVE' : 'IDLE'}</span>
                </span>
              </div>
            )
          })}
        </div>

        {/* Right Side: Network Stats */}
        <div className="col-span-2 p-1.5 flex flex-col justify-between bg-[color:var(--neo-bg-soft)] border border-neo-border rounded shadow-neo-sm">
          <div className="space-y-1">
            <div className="font-extrabold text-[7px] border-b border-neo-border pb-0.5 uppercase opacity-60 text-center">Node Logs</div>
            <div className="text-center pt-1">
              <div className="opacity-70 text-[6px]">TOTAL REQS</div>
              <div className="font-black text-xs text-black">{reqs}</div>
            </div>
            <div className="text-center">
              <div className="opacity-70 text-[6px]">HEALTH STATUS</div>
              <div className="font-extrabold text-green-600">HEALTHY</div>
            </div>
          </div>
        </div>
      </div>
    </CardShell>
  )
}

/* ─── Shared card shell ─── */
function CardShell({
  isDarkMode,
  icon,
  title,
  sub,
  badge,
  badgeClass,
  children,
}: {
  isDarkMode: boolean
  icon: React.ReactNode
  title: string
  sub: string
  badge: string
  badgeClass: string
  children: React.ReactNode
}) {
  return (
    <div className="neo-card flex flex-col gap-3 p-4 mt-2">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 flex items-center justify-center shrink-0 neo-panel bg-[color:var(--neo-surface-2)]">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-extrabold leading-tight truncate text-[color:var(--neo-ink)]">
            {title}
          </p>
          <p className="text-[11px] font-mono mt-0.5 text-[color:var(--neo-muted)]">
            {sub}
          </p>
        </div>
      </div>

      {/* Animation zone */}
      <div className="neo-panel bg-[color:var(--neo-surface-2)] overflow-hidden">
        {children}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-extrabold font-mono px-2 py-0.5 border-2 border-neo-border ${badgeClass}`}>{badge}</span>
        <span
          className="w-[7px] h-[7px] rounded-full shrink-0"
          style={{
            background: isDarkMode ? '#34d399' : '#16a34a',
            animation: 'livePulse 1.4s ease-in-out infinite',
          }}
        />
      </div>

      {/* Keyframes injected once */}
      <style>{`
        @keyframes scanDown {
          0%   { top: 0%;   opacity: 0; }
          10%  { opacity: 0.5; }
          90%  { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.3; transform: scale(0.6); }
        }
        .cursor-blink {
          display: inline-block;
          width: 6px;
          height: 10px;
          background: currentColor;
          animation: blink 0.9s step-end infinite;
          vertical-align: -1px;
          margin-left: 1px;
        }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  )
}
