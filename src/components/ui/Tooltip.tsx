'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { createPortal } from 'react-dom'

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
}

export function Tooltip({
  children,
  content,
  position = 'top',
  delay = 500,
  className
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const calculatePosition = () => {
    if (!triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const scrollY = window.scrollY
    const scrollX = window.scrollX

    let top = 0
    let left = 0

    switch (position) {
      case 'top':
        top = rect.top + scrollY - 8
        left = rect.left + scrollX + rect.width / 2
        break
      case 'bottom':
        top = rect.bottom + scrollY + 8
        left = rect.left + scrollX + rect.width / 2
        break
      case 'left':
        top = rect.top + scrollY + rect.height / 2
        left = rect.left + scrollX - 8
        break
      case 'right':
        top = rect.top + scrollY + rect.height / 2
        left = rect.right + scrollX + 8
        break
    }

    setCoords({ top, left })
  }

  const handleMouseEnter = () => {
    calculatePosition()
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const tooltipElement = isVisible && (
    <div
      className={cn(
        "fixed z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded pointer-events-none",
        "animate-in fade-in duration-150",
        position === 'top' && "-translate-x-1/2 -translate-y-full",
        position === 'bottom' && "-translate-x-1/2",
        position === 'left' && "-translate-y-1/2 -translate-x-full",
        position === 'right' && "-translate-y-1/2",
        className
      )}
      style={{ top: coords.top, left: coords.left }}
    >
      {content}
      {/* Arrow */}
      <div
        className={cn(
          "absolute w-2 h-2 bg-gray-900 rotate-45",
          position === 'top' && "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
          position === 'bottom' && "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
          position === 'left' && "right-0 top-1/2 -translate-y-1/2 translate-x-1/2",
          position === 'right' && "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
        )}
      />
    </div>
  )

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      {typeof document !== 'undefined' && createPortal(tooltipElement, document.body)}
    </>
  )
}