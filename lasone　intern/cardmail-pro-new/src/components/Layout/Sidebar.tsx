import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Upload, Mail, Settings, X, ChevronRight, Clock, CheckCircle, XCircle, User, LogOut } from 'lucide-react'
import { useCardStore } from '../../hooks/useCardStore'
import { Button } from '../ui/button'
import { cn } from '../../utils/cn'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [user, setUser] = useState<any>(null)
  const { pendingCards, sentCards, selectedCardId, setSelectedCard, clearCard } = useCardStore()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleCardSelect = (cardId: string) => {
    setSelectedCard(cardId)
    onClose()
  }

  const handleCardDelete = (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    clearCard(cardId)
  }

  const sidebarContent = (
    <div className="sidebar-width h-full bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">CardMail Pro</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-gray-800"
          >
            <X size={20} />
          </Button>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-6 py-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-gray-800"
          onClick={() => {
            window.location.href = '/'
            onClose()
          }}
        >
          <Home size={20} className="mr-3" />
          ホーム
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-gray-800"
          onClick={() => {
            window.location.href = '/review'
            onClose()
          }}
        >
          <Mail size={20} className="mr-3" />
          レビュー & 送信
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-gray-800"
        >
          <Settings size={20} className="mr-3" />
          設定
        </Button>
      </nav>

      {/* Pending Cards */}
      <div className="px-6 py-4 border-t border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">処理待ち ({pendingCards.length})</h3>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {pendingCards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "p-3 rounded-lg border border-gray-700 cursor-pointer transition-all",
                selectedCardId === card.id
                  ? "bg-blue-600 border-blue-500"
                  : "bg-gray-800 hover:bg-gray-700"
              )}
              onClick={() => handleCardSelect(card.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm truncate">
                    {card.extractedData?.name || card.fileName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {card.extractedData?.company || '会社名未取得'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {card.status === 'processing' && (
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  )}
                  {card.status === 'reviewing' && (
                    <Clock size={16} className="text-blue-400" />
                  )}
                  {card.status === 'ready' && (
                    <CheckCircle size={16} className="text-green-400" />
                  )}
                  {card.status === 'failed' && (
                    <XCircle size={16} className="text-red-400" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleCardDelete(card.id, e)}
                    className="text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                  >
                    <X size={12} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sent Cards */}
      <div className="px-6 py-4 border-t border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">送信済み ({sentCards.length})</h3>
        </div>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {sentCards.slice(0, 5).map((card) => (
            <div
              key={card.id}
              className="p-2 rounded-lg bg-gray-800 border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-xs truncate">
                    {card.extractedData?.name || card.fileName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {new Date(card.sentAt!).toLocaleDateString('ja-JP')}
                  </p>
                </div>
                <CheckCircle size={14} className="text-green-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-800">
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-gray-800"
          onClick={() => {
            localStorage.removeItem('auth-token')
            localStorage.removeItem('user')
            window.location.href = '/login'
          }}
        >
          <LogOut size={20} className="mr-3" />
          ログアウト
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="fixed inset-y-0 left-0 z-50 w-80 bg-gray-900">
          {sidebarContent}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-80 bg-gray-900"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}