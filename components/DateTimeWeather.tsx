'use client'

import { useState, useEffect, memo } from 'react'
import { FaSun, FaCloud, FaCloudRain, FaCloudShowersHeavy, FaSnowflake, FaBolt, FaExclamationTriangle } from 'react-icons/fa'

interface WeatherData {
  temp: number
  code: number
  description: string
}

function DateTimeWeather() {
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loadingWeather, setLoadingWeather] = useState(true)
  const [weatherError, setWeatherError] = useState(false)

  // 1. Live Time Update (New Delhi Time Zone)
  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      const now = new Date()
      
      // Format Delhi Time
      const timeFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })
      
      const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })

      setTime(timeFormatter.format(now))
      setDate(dateFormatter.format(now))
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // 2. Fetch Delhi Weather from Open-Meteo (resilient, keyless)
  useEffect(() => {
    if (!mounted) return

    const fetchWeather = async () => {
      try {
        setLoadingWeather(true)
        // Delhi Coordinates: Lat 28.6139, Lon 77.2090
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current=temperature_2m,weather_code'
        )
        if (!res.ok) throw new Error('API failure')
        const data = await res.json()
        
        const temp = Math.round(data.current.temperature_2m)
        const code = data.current.weather_code
        
        // Map weather code to description
        let description = 'Clear'
        if (code === 0) description = 'Sunny'
        else if ([1, 2, 3].includes(code)) description = 'Partly Cloudy'
        else if ([45, 48].includes(code)) description = 'Foggy'
        else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) description = 'Rainy'
        else if ([71, 73, 75, 77, 85, 86].includes(code)) description = 'Snowy'
        else if ([95, 96, 99].includes(code)) description = 'Stormy'

        setWeather({ temp, code, description })
        setWeatherError(false)
      } catch (err) {
        console.error('Error fetching weather:', err)
        setWeatherError(true)
      } finally {
        setLoadingWeather(false)
      }
    }

    fetchWeather()
    // Refresh weather every 15 minutes
    const interval = setInterval(fetchWeather, 900000)
    return () => clearInterval(interval)
  }, [mounted])

  // Don't render until mounted to prevent Next.js hydration mismatch
  if (!mounted) {
    return (
      <div className="neo-card p-4 bg-neo-pink/10 border-2 border-black min-h-[82px] flex items-center justify-center animate-pulse">
        <span className="font-bold text-xs uppercase tracking-wider">Syncing Delhi Time &amp; Weather…</span>
      </div>
    )
  }

  // Get neobrutalist dynamic animated icon based on code
  const getWeatherIcon = () => {
    if (weatherError) return <FaExclamationTriangle className="w-6 h-6 text-neo-red animate-bounce" />
    if (loadingWeather || !weather) return <div className="w-6 h-6 rounded-full border-2 border-black border-t-transparent animate-spin" />

    const code = weather.code
    
    // Sunny/Clear
    if (code === 0) {
      return (
        <FaSun 
          className="w-7 h-7 text-neo-yellow drop-shadow-[2px_2px_0_#000]" 
          style={{
            animation: 'spin-slow 12s linear infinite'
          }}
        />
      )
    }
    // Cloudy
    if ([1, 2, 3].includes(code)) {
      return (
        <FaCloud 
          className="w-7 h-7 text-neo-blue drop-shadow-[2px_2px_0_#000]" 
          style={{
            animation: 'float-slow 4s ease-in-out infinite alternate'
          }}
        />
      )
    }
    // Rainy
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
      return (
        <FaCloudRain 
          className="w-7 h-7 text-neo-purple drop-shadow-[2px_2px_0_#000]" 
          style={{
            animation: 'rain-shake 0.5s ease-in-out infinite'
          }}
        />
      )
    }
    // Stormy
    if ([95, 96, 99].includes(code)) {
      return (
        <FaBolt 
          className="w-7 h-7 text-neo-yellow drop-shadow-[2px_2px_0_#000] animate-bounce" 
        />
      )
    }
    // Snowy
    if ([71, 73, 75, 77, 85, 86].includes(code)) {
      return (
        <FaSnowflake 
          className="w-7 h-7 text-neo-cyan drop-shadow-[2px_2px_0_#000] animate-spin"
          style={{ animationDuration: '6s' }}
        />
      )
    }

    // Default Fallback
    return <FaSun className="w-7 h-7 text-neo-yellow animate-pulse" />
  }

  return (
    <div className="neo-card p-4 bg-neo-pink border-2 border-black shadow-neo-sm hover:scale-[1.02] transition-transform duration-150 cursor-default select-none relative overflow-hidden">
      {/* Inline styles for custom animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float-slow {
          0% { transform: translateY(0); }
          100% { transform: translateY(-4px); }
        }
        @keyframes rain-shake {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(1px, -1px); }
        }
      `}} />

      <div className="flex justify-between items-center relative z-10">
        {/* Left Section: Time & Date */}
        <div className="text-left">
          <div className="text-xs font-black uppercase tracking-widest text-black/60 mb-0.5">
            Delhi Time
          </div>
          <div className="text-lg font-black font-mono tracking-wider text-black tabular-nums">
            {time}
          </div>
          <div className="text-xs font-bold text-black/80 mt-0.5">
            {date}
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-10 w-0.5 bg-black/20 border-l border-dashed border-black/40 mx-2"></div>

        {/* Right Section: Weather Temp */}
        <div className="text-right flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-black uppercase tracking-widest text-black/60 mb-0.5">
              Weather
            </div>
            <div className="text-lg font-black text-black">
              {loadingWeather ? (
                <span className="text-xs animate-pulse font-bold">Loading…</span>
              ) : weatherError ? (
                <span className="text-xs font-bold text-neo-red">Offline</span>
              ) : (
                `${weather?.temp}°C`
              )}
            </div>
            <div className="text-[10px] font-extrabold text-black/80 capitalize">
              {loadingWeather ? 'Syncing' : weatherError ? 'Error' : weather?.description}
            </div>
          </div>

          {/* Animated Weather Icon Container */}
          <div className="w-10 h-10 rounded border-2 border-black bg-[color:var(--neo-surface)] flex items-center justify-center shadow-neo-xs flex-shrink-0">
            {getWeatherIcon()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(DateTimeWeather)
