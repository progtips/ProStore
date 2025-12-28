'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TablesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dbType = searchParams.get('db') || 'local'
  const [tables, setTables] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/view-db/tables?db=${dbType}`)
      .then(res => res.json())
      .then(data => {
        setTables(data.tables || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Ошибка загрузки таблиц:', err)
        setLoading(false)
      })
  }, [dbType])

  const handleOpenTable = (tableName: string) => {
    router.push(`/view-db/tables/${tableName}?db=${dbType}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Таблицы базы данных ({dbType === 'local' ? 'Локальная' : 'Рабочая'})
            </h1>
            <button
              onClick={() => router.push('/view-db')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Назад
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">Загрузка...</div>
          ) : (
            <div className="space-y-2">
              {tables.map((table) => (
                <div
                  key={table}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-700">{table}</span>
                  <button
                    onClick={() => handleOpenTable(table)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Открыть
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



