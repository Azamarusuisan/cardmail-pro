const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiKeys {
  openaiApiKey?: string;
  googleClientId?: string;
  googleClientSecret?: string;
  clearbitApiKey?: string;
}

export class ApiClient {
  private static instance: ApiClient;
  private accessToken: string | null = null;
  private apiKeys: ApiKeys = {};

  private constructor() {
    this.loadToken();
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  setApiKeys(keys: ApiKeys) {
    this.apiKeys = keys;
  }

  private loadToken() {
    this.accessToken = localStorage.getItem('accessToken');
  }

  setToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  clearToken() {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = new Headers(options.headers);

    if (this.accessToken) {
      headers.set('Authorization', `Bearer ${this.accessToken}`);
    }

    // APIキーをヘッダーに追加
    if (this.apiKeys.openaiApiKey) {
      headers.set('X-OpenAI-Key', this.apiKeys.openaiApiKey);
    }
    if (this.apiKeys.googleClientId) {
      headers.set('X-Google-Client-Id', this.apiKeys.googleClientId);
    }
    if (this.apiKeys.googleClientSecret) {
      headers.set('X-Google-Client-Secret', this.apiKeys.googleClientSecret);
    }
    if (this.apiKeys.clearbitApiKey) {
      headers.set('X-Clearbit-Key', this.apiKeys.clearbitApiKey);
    }

    if (!(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
        window.location.href = '/login';
      }
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async getGoogleAuthUrl() {
    return this.request<{ url: string }>('/auth/google');
  }

  async handleGoogleCallback(code: string) {
    return this.request<{ accessToken: string; user: any }>('/auth/google/callback', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  async refreshToken() {
    return this.request<{ accessToken: string }>('/auth/refresh', {
      method: 'POST',
    });
  }

  // Upload endpoints
  async uploadCards(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    return this.request<{ jobId: string; message: string }>('/upload', {
      method: 'POST',
      body: formData,
    });
  }

  async getJobStatus(jobId: string) {
    return this.request<{ status: string; progress: number; results?: any[] }>(
      `/upload/status/${jobId}`
    );
  }

  // Cards endpoints
  async getCards() {
    return this.request<any[]>('/cards');
  }

  async getCard(id: string) {
    return this.request<any>(`/cards/${id}`);
  }

  async updateCard(id: string, data: any) {
    return this.request<any>(`/cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCard(id: string) {
    return this.request<void>(`/cards/${id}`, {
      method: 'DELETE',
    });
  }

  async getSentHistory() {
    return this.request<any[]>('/cards/history/sent');
  }

  // Send endpoints
  async sendEmail(cardId: string, emailData: any) {
    return this.request<{ success: boolean; messageId: string }>('/send', {
      method: 'POST',
      body: JSON.stringify({ cardId, ...emailData }),
    });
  }

  async sendBatchEmails(emails: any[]) {
    return this.request<{ success: boolean; sent: number; failed: number }>('/send/batch', {
      method: 'POST',
      body: JSON.stringify({ emails }),
    });
  }
}

export const apiClient = ApiClient.getInstance();