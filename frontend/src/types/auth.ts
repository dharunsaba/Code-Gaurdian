export interface User {
  id: number;
  username: string;
  mobile_number: string;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, mobileNumber?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
