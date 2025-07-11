// eslint-disable-next-line @typescript-eslint/no-unused-vars
'use client';
// import { useTheme } from 'next-themes';
import React from 'react';
import { ActiveThemeProvider } from '../active-theme';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  loading: true
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: User | null) => {
        setUser(firebaseUser);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  // we need the resolvedTheme value to set the baseTheme for clerk based on the dark or light theme
  // const { resolvedTheme } = useTheme();
  // resolvedTheme is used for theme detection but not directly used in this component

  return (
    <>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <AuthProvider>{children}</AuthProvider>
      </ActiveThemeProvider>
    </>
  );
}
