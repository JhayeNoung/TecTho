import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  email: string | null;
  updateToken: (newToken: string) => void;
  updateEmail: (newEmail: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const updateToken = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const updateEmail = (newEmail: string) => {
    setEmail(newEmail);
    localStorage.setItem('email', newEmail);
  };

  return (
    <AuthContext.Provider value={{ token, updateToken, email, updateEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  // This check ensures that useAuth is being used within the correct context provider (AuthProvider)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}