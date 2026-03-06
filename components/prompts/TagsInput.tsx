'use client'

import { useState, useRef, KeyboardEvent } from 'react'

interface TagsInputProps {
  name?: string
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  className?: string
}

/**
 * Поле ввода тегов (chips)
 */
export function TagsInput({ name = 'tags', value, onChange, placeholder = 'Добавьте теги через запятую или Enter', className = '' }: TagsInputProps) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
  }

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (inputValue.trim()) {
        addTag(inputValue)
        setInputValue('')
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1)
    }
  }

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue)
      setInputValue('')
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text')
    if (pasted.includes(',')) {
      e.preventDefault()
      pasted.split(',').forEach((t) => addTag(t))
      setInputValue('')
    }
  }

  return (
    <div className={`rounded-lg border border-gray-300 dark:border-slate-500 bg-white dark:bg-slate-700 p-2 min-h-[42px] flex flex-wrap gap-2 items-center ${className}`}>
      {value.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-md text-sm"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="hover:bg-blue-200 dark:hover:bg-blue-800/60 rounded p-0.5 transition-colors"
            aria-label={`Удалить тег ${tag}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onPaste={handlePaste}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] bg-transparent border-none focus:ring-0 focus:outline-none text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-400 text-sm py-1"
      />
      <input type="hidden" name={name} value={value.join(',')} readOnly />
    </div>
  )
}
