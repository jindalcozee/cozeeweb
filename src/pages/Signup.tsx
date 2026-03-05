import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
        } else {
            // Supabase handled the user creation and trigger will handle the profile
            navigate('/account');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
            <div className="w-full max-w-md p-8 bg-[var(--color-bg)] rounded-3xl border border-[var(--color-rojo)]/10 shadow-sm">
                <h1 className="text-3xl font-bold text-[var(--color-rojo)] mb-2 text-center">Create Account</h1>
                <p className="text-[var(--color-rojo)]/60 text-center mb-8">Join the Cozee family and start tracking your comfort.</p>

                {error && (
                    <div className="p-4 mb-6 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-[var(--color-rojo)]">Full Name</Label>
                        <Input
                            id="fullName"
                            type="text"
                            placeholder="Harsh Jindal"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="bg-white/50 border-[var(--color-rojo)]/20 focus:border-[var(--color-rojo)]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-[var(--color-rojo)]">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="harsh@thecozee.in"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-white/50 border-[var(--color-rojo)]/20 focus:border-[var(--color-rojo)]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" title="Password" className="text-[var(--color-rojo)]">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-white/50 border-[var(--color-rojo)]/20 focus:border-[var(--color-rojo)]"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--color-rojo)] text-white hover:bg-[var(--color-rojo)]/90 h-12 text-lg rounded-xl"
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </Button>
                </form>

                <p className="mt-8 text-center text-[var(--color-rojo)]/60">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[var(--color-rojo)] font-bold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
