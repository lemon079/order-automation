'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBrowserClient, signinSchema, type SigninFormData } from '@repo/shared';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, toast } from '@repo/ui';
import { Package } from 'lucide-react';

export default function SignInPage() {
    const [loading, setLoading] = useState(false);
    const [magicLinkLoading, setMagicLinkLoading] = useState(false);
    const router = useRouter();
    const supabase = createBrowserClient();

    const { register, handleSubmit, getValues, formState: { errors } } = useForm<SigninFormData>({
        resolver: zodResolver(signinSchema)
    });

    const onSubmit = async (data: SigninFormData) => {
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) {
            if (error.message.includes('Email not confirmed')) {
                toast.error('Please verify your email address before signing in.');
            } else {
                toast.error(error.message);
            }
            setLoading(false);
        } else {
            toast.success('Welcome back!');
            router.push('/dashboard');
            router.refresh();
        }
    };

    const handleMagicLink = async () => {
        const email = getValues('email');
        if (!email) {
            toast.error('Please enter your email first');
            return;
        }

        setMagicLinkLoading(true);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/callback`,
            },
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Check your email for the magic link!');
        }
        setMagicLinkLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-background via-muted to-primary/5 p-6">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                            <Package className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-bold">OrderAuto</span>
                    </div>
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <CardDescription>Sign in to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                {...register('email')}
                                disabled={loading}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                                disabled={loading}
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleMagicLink}
                            disabled={magicLinkLoading}
                        >
                            {magicLinkLoading ? 'Sending...' : 'Send Magic Link'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-muted-foreground">Don't have an account? </span>
                        <Link href="/signup" className="text-primary hover:underline font-medium">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

