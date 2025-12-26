import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">ProStore</h1>
        <p className="text-gray-600 mb-8">Система управления промтами и заметками</p>
        
        <div className="space-y-4">
          <Link
            href="/view-db"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Просмотр базы данных
          </Link>
        </div>
      </div>
    </div>
  )
}

