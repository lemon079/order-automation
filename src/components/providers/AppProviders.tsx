'use client';

import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/components/theme-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuthProvider>
                {children}
            </AuthProvider>
        </ThemeProvider>
    );
}
