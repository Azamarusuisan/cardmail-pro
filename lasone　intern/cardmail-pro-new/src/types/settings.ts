export interface ApiSettings {
  openaiApiKey: string;
  googleClientId: string;
  googleClientSecret: string;
  clearbitApiKey?: string;
}

export interface UserSettings {
  apiKeys: ApiSettings;
  emailSettings: {
    defaultSignature?: string;
    defaultSubject?: string;
  };
}