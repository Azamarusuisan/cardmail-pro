import React, { useState } from 'react'
import { Menu, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Layout/Sidebar'
import { Button } from '../components/ui/button'
import { usePendingCards, useSelectedCard } from '../hooks/useCardStore'

export default function Review() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const pendingCards = usePendingCards()
  const selectedCard = useSelectedCard()

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-80">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu size={20} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
              >
                <ArrowLeft size={20} className="mr-2" />
                戻る
              </Button>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900">
              名刺レビュー & 送信
            </h1>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {pendingCards.length} 件の名刺が処理待ち
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {pendingCards.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  処理待ちの名刺がありません
                </p>
                <Button
                  onClick={() => navigate('/')}
                  className="mt-4"
                >
                  名刺をアップロード
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel - Card List */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold">名刺一覧</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {pendingCards.map((card) => (
                        <div
                          key={card.id}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedCard?.id === card.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium">
                                {card.extractedData?.name || card.fileName}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {card.extractedData?.company || '会社名未取得'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {card.extractedData?.email || 'メールアドレス未取得'}
                              </p>
                            </div>
                            <div className="ml-4">
                              <div className={`px-2 py-1 rounded text-xs font-medium ${
                                card.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                card.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                                card.status === 'ready' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {card.status === 'processing' ? '処理中' :
                                 card.status === 'reviewing' ? 'レビュー中' :
                                 card.status === 'ready' ? '送信準備完了' :
                                 card.status}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Panel - Card Details */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold">名刺詳細</h2>
                  </div>
                  <div className="p-6">
                    {selectedCard ? (
                      <div className="space-y-6">
                        {/* Card Image */}
                        {selectedCard.thumbnailUrl && (
                          <div className="border rounded-lg overflow-hidden">
                            <img
                              src={selectedCard.thumbnailUrl}
                              alt="名刺画像"
                              className="w-full h-48 object-contain bg-gray-50"
                            />
                          </div>
                        )}

                        {/* Extracted Data */}
                        <div>
                          <h3 className="font-medium mb-3">抽出された情報</h3>
                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                氏名
                              </label>
                              <input
                                type="text"
                                value={selectedCard.extractedData?.name || ''}
                                className="w-full p-2 border rounded-md"
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                会社名
                              </label>
                              <input
                                type="text"
                                value={selectedCard.extractedData?.company || ''}
                                className="w-full p-2 border rounded-md"
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                メールアドレス
                              </label>
                              <input
                                type="email"
                                value={selectedCard.extractedData?.email || ''}
                                className="w-full p-2 border rounded-md"
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                電話番号
                              </label>
                              <input
                                type="text"
                                value={selectedCard.extractedData?.phone || ''}
                                className="w-full p-2 border rounded-md"
                                readOnly
                              />
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-3">
                          <Button className="flex-1">
                            メールを生成
                          </Button>
                          <Button variant="outline">
                            編集
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">
                          名刺を選択してください
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}