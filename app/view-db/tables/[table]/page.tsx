'use client'

import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface TableData {
  [key: string]: any
}

interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export default function TableViewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const tableName = params?.table as string
  const dbType = searchParams.get('db') || 'local'
  const [page, setPage] = useState(1)
  const pageSize = 10

  const [data, setData] = useState<TableData[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingRow, setEditingRow] = useState<string | null>(null)
  const [editData, setEditData] = useState<TableData>({})
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createData, setCreateData] = useState<TableData>({})

  useEffect(() => {
    if (tableName) {
      loadData()
    }
  }, [page, tableName, dbType])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/view-db/tables/${tableName}?db=${dbType}&page=${page}&pageSize=${pageSize}`
      )
      const result = await res.json()
      if (res.ok) {
        setData(result.data || [])
        setPagination(result.pagination)
      } else {
        setError(result.error || 'Ошибка загрузки данных')
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту запись?')) return

    try {
      const res = await fetch(
        `/api/view-db/tables/${tableName}?db=${dbType}&id=${id}`,
        { method: 'DELETE' }
      )
      const result = await res.json()
      if (res.ok) {
        loadData()
      } else {
        alert(result.error || 'Ошибка удаления')
      }
    } catch (err: any) {
      alert(err.message || 'Ошибка удаления')
    }
  }

  const handleEdit = (row: TableData) => {
    setEditingRow(row.id)
    setEditData({ ...row })
  }

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(
        `/api/view-db/tables/${tableName}?db=${dbType}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editData),
        }
      )
      const result = await res.json()
      if (res.ok) {
        setEditingRow(null)
        loadData()
      } else {
        alert(result.error || 'Ошибка обновления')
      }
    } catch (err: any) {
      alert(err.message || 'Ошибка обновления')
    }
  }

  const handleCreate = async () => {
    try {
      const res = await fetch(
        `/api/view-db/tables/${tableName}?db=${dbType}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createData),
        }
      )
      const result = await res.json()
      if (res.ok) {
        setShowCreateForm(false)
        setCreateData({})
        loadData()
      } else {
        alert(result.error || 'Ошибка создания')
      }
    } catch (err: any) {
      alert(err.message || 'Ошибка создания')
    }
  }

  if (loading && !data.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Загрузка...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => router.push(`/view-db/tables?db=${dbType}`)}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              ← Вернуться к списку таблиц
            </button>
          </div>
        </div>
      </div>
    )
  }

  const columns = data.length > 0 ? Object.keys(data[0]) : []

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Таблица: {tableName}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/view-db/tables?db=${dbType}`)}
                className="text-gray-600 hover:text-gray-800 px-4 py-2"
              >
                ← Назад
              </button>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                + Создать
              </button>
            </div>
          </div>

          {showCreateForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3">Создать новую запись</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {columns.map((col) => (
                  <div key={col}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {col}
                    </label>
                    <input
                      type="text"
                      value={createData[col] || ''}
                      onChange={(e) =>
                        setCreateData({ ...createData, [col]: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder={col}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Сохранить
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false)
                    setCreateData({})
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-gray-50">
                    {columns.map((col) => (
                      <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingRow === row.id ? (
                          <input
                            type="text"
                            value={editData[col] || ''}
                            onChange={(e) =>
                              setEditData({ ...editData, [col]: e.target.value })
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        ) : (
                          <span>
                            {typeof row[col] === 'object'
                              ? JSON.stringify(row[col])
                              : String(row[col] || '')}
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingRow === row.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className="text-green-600 hover:text-green-900"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setEditingRow(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(row)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Изменить
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Удалить
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Показано {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, pagination.total)} из {pagination.total}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  ← Назад
                </button>
                <span className="px-4 py-2">
                  Страница {page} из {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                  disabled={page >= pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Вперёд →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

