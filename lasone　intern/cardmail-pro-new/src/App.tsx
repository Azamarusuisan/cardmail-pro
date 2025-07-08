import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Review from './pages/Review'
import { SettingsDialog } from './components/Settings/SettingsDialog'
import { useSettings } from './hooks/useSettings'
import { apiClient } from './utils/api'
import { Settings } from 'lucide-react'
import './App.css'

function App() {
  const [showSettings, setShowSettings] = useState(false)
  const { settings, isConfigured } = useSettings()

  useEffect(() => {
    // APIクライアントにAPIキーを設定
    apiClient.setApiKeys(settings.apiKeys)
  }, [settings.apiKeys])

  useEffect(() => {
    // 初回起動時に設定が未完了の場合は設定画面を表示
    if (!isConfigured()) {
      setShowSettings(true)
    }
  }, [])

  return (
    <Router>
      <div className="App">
        <button
          onClick={() => setShowSettings(true)}
          className="fixed top-4 right-4 z-40 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Settings className="w-5 h-5" />
        </button>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/review" element={<Review />} />
        </Routes>
        
        <SettingsDialog
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </div>
    </Router>
  )
}

export default App