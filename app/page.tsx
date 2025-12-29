'use client'

import { signIn } from 'next-auth/react'

export default function Home() {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">ProStore</h1>
        <p className="text-gray-600 mb-8">Система управления промтами и заметками</p>
        
        <button
          onClick={handleGoogleSignIn}
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Войти через Google
        </button>
      </div>
    </div>
  )
}
