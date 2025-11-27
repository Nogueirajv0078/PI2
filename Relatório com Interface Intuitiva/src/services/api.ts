const API_BASE_URL = 'http://localhost:8000/api';

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  is_active: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAuthToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        // Token expirado, tentar renovar
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Tentar novamente com o novo token
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${this.getAuthToken()}`,
          };
          const retryResponse = await fetch(url, config);
          if (!retryResponse.ok) {
            throw new Error('Falha na autenticação');
          }
          return retryResponse.json();
        } else {
          // Redirecionar para login
          this.logout();
          throw new Error('Sessão expirada');
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Extrair a primeira mensagem de erro, se disponível
        let errorMessage = 'Erro na requisição';
        if (typeof errorData === 'object' && errorData !== null) {
          const firstKey = Object.keys(errorData)[0];
          if (firstKey && Array.isArray(errorData[firstKey]) && errorData[firstKey].length > 0) {
            errorMessage = errorData[firstKey][0];
          } else if (firstKey) {
            errorMessage = errorData[firstKey];
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Autenticação
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Salvar tokens no localStorage
    localStorage.setItem('access_token', response.tokens.access);
    localStorage.setItem('refresh_token', response.tokens.refresh);
    localStorage.setItem('user', JSON.stringify(response.user));

    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Salvar tokens no localStorage
    localStorage.setItem('access_token', response.tokens.access);
    localStorage.setItem('refresh_token', response.tokens.refresh);
    localStorage.setItem('user', JSON.stringify(response.user));

    return response;
  }

  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      try {
        await this.request('/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh: refreshToken }),
        });
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
      }
    }

    // Limpar localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  async refreshToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return true;
      }
    } catch (error) {
      console.error('Erro ao renovar token:', error);
    }

    return false;
  }

  // Perfil do usuário
  async getProfile(): Promise<User> {
    return this.request<User>('/profile/');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request<User>('/profile/update/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
  }): Promise<{ message: string }> {
    return this.request<{ message: string }>('/profile/change-password/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // CRUD de usuários
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users/');
  }

  async getUser(id: number): Promise<User> {
    return this.request<User>(`/users/${id}/`);
  }

  async createUser(data: RegisterData): Promise<User> {
    return this.request<User>('/users/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    return this.request<User>(`/users/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: number): Promise<void> {
    return this.request<void>(`/users/${id}/`, {
      method: 'DELETE',
    });
  }

  // Relatórios
  async downloadUserReport(): Promise<Blob> {
    const url = `${API_BASE_URL}/reports/download-excel/`;
    const token = this.getAuthToken();

    const config: RequestInit = {
      method: 'GET',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error('Erro ao baixar o relatório');
      }

      return response.blob();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Obter usuário atual do localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export const apiService = new ApiService();
