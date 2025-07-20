interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  company?: string;
  skills: string[];
  provider: "GITHUB" | "GOOGLE" | "LINKEDIN";
  githubUsername?: string;
  linkedinProfile?: string;
  projectsCount: number;
  followersCount: number;
  followingCount: number;
  isActive: boolean;
  isPro: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

class AuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  }

  private getStoredTokens(): AuthTokens | null {
    if (typeof window === "undefined") return null;

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) return null;

    return { accessToken, refreshToken };
  }

  private setTokens(tokens: AuthTokens): void {
    if (typeof window === "undefined") return;

    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  }

  private clearTokens(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  async getCurrentUser(): Promise<User | null> {
    const tokens = this.getStoredTokens();
    if (!tokens) return null;

    try {
      const response = await fetch(`${this.baseUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });

      if (response.ok) {
        return await response.json();
      }

      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await this.refreshToken();
        if (refreshed) {
          return this.getCurrentUser();
        }
      }

      this.clearTokens();
      return null;
    } catch (error) {
      console.error("Error fetching current user:", error);
      this.clearTokens();
      return null;
    }
  }

  async refreshToken(): Promise<boolean> {
    const tokens = this.getStoredTokens();
    if (!tokens) return false;

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });

      if (response.ok) {
        const newTokens = await response.json();
        this.setTokens(newTokens);
        return true;
      }

      this.clearTokens();
      return false;
    } catch (error) {
      console.error("Error refreshing token:", error);
      this.clearTokens();
      return false;
    }
  }

  async logout(): Promise<void> {
    const tokens = this.getStoredTokens();

    if (tokens) {
      try {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        });
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }

    this.clearTokens();
  }

  isAuthenticated(): boolean {
    return this.getStoredTokens() !== null;
  }
}

export const authService = new AuthService();
export type { User, AuthTokens, AuthResponse };
