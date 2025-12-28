'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ViewDbPage() {
  const router = useRouter()
  const [dbType, setDbType] = useState<'local' | 'production'>('local')

  const handleContinue = () => {
    router.push(`/view-db/tables?db=${dbType}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Просмотр базы данных</h1>
        
        <div className="space-y-4 mb-6">
          <label className="block">
            <input
              type="radio"
              name="dbType"
              value="local"
              checked={dbType === 'local'}
              onChange={(e) => setDbType(e.target.value as 'local' | 'production')}
              className="mr-2"
            />
            <span className="text-gray-700">Локальная БД</span>
          </label>
          
          <label className="block">
            <input
              type="radio"
              name="dbType"
              value="production"
              checked={dbType === 'production'}
              onChange={(e) => setDbType(e.target.value as 'local' | 'production')}
              className="mr-2"
            />
            <span className="text-gray-700">Рабочая БД</span>
          </label>
        </div>

        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Продолжить
        </button>
      </div>
    </div>
  )
}



