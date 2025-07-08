import React, { useState } from 'react';
import { X, Save, Eye, EyeOff } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { Button } from '../ui/button';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
  const { settings, updateApiKeys, updateEmailSettings } = useSettings();
  const [formData, setFormData] = useState({
    ...settings.apiKeys,
    ...settings.emailSettings,
  });
  const [showSecrets, setShowSecrets] = useState({
    openaiApiKey: false,
    googleClientSecret: false,
    clearbitApiKey: false,
  });

  if (!isOpen) return null;

  const handleSave = () => {
    const { openaiApiKey, googleClientId, googleClientSecret, clearbitApiKey } = formData;
    const { defaultSignature, defaultSubject } = formData;

    updateApiKeys({
      openaiApiKey,
      googleClientId,
      googleClientSecret,
      clearbitApiKey,
    });

    updateEmailSettings({
      defaultSignature,
      defaultSubject,
    });

    onClose();
  };

  const toggleSecretVisibility = (key: keyof typeof showSecrets) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">設定</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">APIキー設定</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OpenAI API Key
                </label>
                <div className="relative">
                  <input
                    type={showSecrets.openaiApiKey ? 'text' : 'password'}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.openaiApiKey}
                    onChange={(e) => setFormData({ ...formData, openaiApiKey: e.target.value })}
                    placeholder="sk-..."
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecretVisibility('openaiApiKey')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                  >
                    {showSecrets.openaiApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Client ID
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.googleClientId}
                  onChange={(e) => setFormData({ ...formData, googleClientId: e.target.value })}
                  placeholder="xxxxx.apps.googleusercontent.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Client Secret
                </label>
                <div className="relative">
                  <input
                    type={showSecrets.googleClientSecret ? 'text' : 'password'}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.googleClientSecret}
                    onChange={(e) => setFormData({ ...formData, googleClientSecret: e.target.value })}
                    placeholder="GOCSPX-..."
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecretVisibility('googleClientSecret')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                  >
                    {showSecrets.googleClientSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clearbit API Key (オプション)
                </label>
                <div className="relative">
                  <input
                    type={showSecrets.clearbitApiKey ? 'text' : 'password'}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.clearbitApiKey || ''}
                    onChange={(e) => setFormData({ ...formData, clearbitApiKey: e.target.value })}
                    placeholder="sk_..."
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecretVisibility('clearbitApiKey')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                  >
                    {showSecrets.clearbitApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">メール設定</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  デフォルト件名
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.defaultSubject || ''}
                  onChange={(e) => setFormData({ ...formData, defaultSubject: e.target.value })}
                  placeholder="ご挨拶"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  デフォルト署名
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={formData.defaultSignature || ''}
                  onChange={(e) => setFormData({ ...formData, defaultSignature: e.target.value })}
                  placeholder="よろしくお願いいたします。"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <Button
            variant="outline"
            onClick={onClose}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleSave}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            保存
          </Button>
        </div>
      </div>
    </div>
  );
};