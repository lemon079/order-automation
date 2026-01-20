'use client';

import { useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { AlertCircle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="page-container">
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-destructive/10">
                                <AlertCircle className="size-6 text-destructive" />
                            </div>
                            <CardTitle>Something went wrong</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                            {error.message || 'An unexpected error occurred. Please try again.'}
                        </p>
                        <div className="flex gap-3">
                            <Button onClick={reset} className="flex-1">
                                Try again
                            </Button>
                            <Button variant="outline" onClick={() => window.location.href = '/'} className="flex-1">
                                Go home
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
