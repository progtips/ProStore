'use client'

import { Copy } from 'lucide-react'
import { useState } from 'react'
import { Toast } from '@/components/ui/Toast'

interface CopyButtonProps {
  content: string
}

export function CopyButton({ content }: CopyButtonProps) {
  const [showToast, setShowToast] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setShowToast(true)
    } catch (error) {
      console.error('Ошибка копирования:', error)
    }
  }

  return (
    <>
      <button
        onClick={handleCopy}
        className="ml-auto flex items-center gap-2 px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        title="Копировать содержимое"
      >
        <Copy className="w-4 h-4" />
        <span>Копировать</span>
      </button>
      <Toast
        message="Промт скопирован"
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  )
}

