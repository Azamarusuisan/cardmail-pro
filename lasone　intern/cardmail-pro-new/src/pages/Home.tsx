import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Upload, FileText, Zap } from 'lucide-react'
import Sidebar from '../components/Layout/Sidebar'
import { Button } from '../components/ui/button'
import { useCardStore } from '../hooks/useCardStore'

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const { addCard } = useCardStore()

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const cardId = addCard({
          fileName: file.name,
          thumbnailUrl: e.target?.result as string,
          rawText: '', // Will be populated by OCR
          status: 'processing'
        })
        
        // Navigate to review page
        navigate('/review')
      }
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-80">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu size={20} />
            </Button>
            
            <h1 className="text-2xl font-bold text-gray-900">
              CardMail Pro
            </h1>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/review')}
                variant="outline"
              >
                <FileText size={16} className="mr-2" />
                レビュー画面
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                名刺から自動メール作成
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                名刺をアップロードするだけで、AI が自動的に情報を抽出し、
                プロフェッショナルなメールを生成します。
              </p>
            </div>

            {/* Upload Area */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
                <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">名刺をアップロード</h3>
                <p className="text-gray-600 mb-4">
                  JPG、PNG、PDF形式をサポート
                </p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  <Upload size={20} className="mr-2" />
                  ファイルを選択
                </label>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">高精度OCR</h3>
                <p className="text-gray-600">
                  Google Cloud Vision API を使用して、
                  名刺の文字を高精度で認識します。
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="text-green-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI メール生成</h3>
                <p className="text-gray-600">
                  GPT-4 を使用して、相手に合わせた
                  プロフェッショナルなメールを自動生成。
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="text-purple-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">簡単送信</h3>
                <p className="text-gray-600">
                  生成されたメールを確認して、
                  ワンクリックで送信できます。
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}