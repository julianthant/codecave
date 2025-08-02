'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  suggestions?: string[]
  className?: string
  disabled?: boolean
}

export function TagInput({
  value,
  onChange,
  placeholder = "Add tags...",
  maxTags = 5,
  suggestions = [],
  className,
  disabled
}: TagInputProps) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Popular tags for suggestions
  const defaultSuggestions = [
    'javascript', 'typescript', 'react', 'nextjs', 'nodejs',
    'python', 'rust', 'go', 'java', 'cpp',
    'algorithms', 'datastructures', 'systemdesign',
    'frontend', 'backend', 'fullstack', 'mobile',
    'ai', 'machinelearning', 'blockchain', 'web3'
  ]

  const allSuggestions = suggestions.length > 0 ? suggestions : defaultSuggestions

  // Filter suggestions based on input
  const filteredSuggestions = input.length > 0
    ? allSuggestions
        .filter(s => s.toLowerCase().includes(input.toLowerCase()))
        .filter(s => !value.includes(s))
        .slice(0, 5)
    : []

  const addTag = (tag: string) => {
    const normalizedTag = tag.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')

    if (normalizedTag && !value.includes(normalizedTag) && value.length < maxTags) {
      onChange([...value, normalizedTag])
      setInput('')
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
    }
  }

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (selectedSuggestionIndex >= 0 && filteredSuggestions[selectedSuggestionIndex]) {
        addTag(filteredSuggestions[selectedSuggestionIndex])
      } else {
        addTag(input)
      }
    } else if (e.key === 'Backspace' && input === '' && value.length > 0) {
      removeTag(value.length - 1)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedSuggestionIndex(prev =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
    }
  }

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className={cn(
        "flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg",
        "bg-white min-h-[42px]",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "hover:border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20"
      )}>
        {/* Tags */}
        {value.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-sm"
          >
            <span>#{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              disabled={disabled}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Input */}
        {value.length < maxTags && (
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setShowSuggestions(true)
              setSelectedSuggestionIndex(-1)
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder={value.length === 0 ? placeholder : ''}
            disabled={disabled}
            className="flex-1 min-w-[120px] outline-none text-sm bg-transparent placeholder:text-gray-400"
          />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTag(suggestion)}
              className={cn(
                "w-full px-3 py-2 text-left text-sm hover:bg-gray-50",
                "first:rounded-t-lg last:rounded-b-lg",
                selectedSuggestionIndex === index && "bg-gray-50"
              )}
            >
              #{suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Helper Text */}
      <p className="mt-1 text-xs text-gray-500">
        {value.length}/{maxTags} tags
      </p>
    </div>
  )
}