import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSettings } from '../types/settings';

interface SettingsStore {
  settings: UserSettings;
  updateApiKeys: (apiKeys: Partial<UserSettings['apiKeys']>) => void;
  updateEmailSettings: (emailSettings: Partial<UserSettings['emailSettings']>) => void;
  isConfigured: () => boolean;
}

const defaultSettings: UserSettings = {
  apiKeys: {
    openaiApiKey: '',
    googleClientId: '',
    googleClientSecret: '',
    clearbitApiKey: '',
  },
  emailSettings: {
    defaultSignature: '',
    defaultSubject: '',
  },
};

export const useSettings = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      updateApiKeys: (apiKeys) =>
        set((state) => ({
          settings: {
            ...state.settings,
            apiKeys: {
              ...state.settings.apiKeys,
              ...apiKeys,
            },
          },
        })),
      updateEmailSettings: (emailSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            emailSettings: {
              ...state.settings.emailSettings,
              ...emailSettings,
            },
          },
        })),
      isConfigured: () => {
        const { apiKeys } = get().settings;
        return !!(
          apiKeys.openaiApiKey &&
          apiKeys.googleClientId &&
          apiKeys.googleClientSecret
        );
      },
    }),
    {
      name: 'cardmail-settings',
    }
  )
);