import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useBackend } from '@/context/MockBackendContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import fbcLogo from '@/assets/fbc-logo.jpg';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useBackend();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const result = login(email, password);
    
    setTimeout(() => {
      setIsLoading(false);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/30 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-card rounded-3xl shadow-soft mb-4">
            <img src={fbcLogo} alt="FBC Running Club" className="h-20 w-auto rounded-2xl" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground">Welcome Back!</h1>
          <p className="text-muted-foreground mt-2">Sign in to join the running crew</p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-3xl shadow-soft p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="rounded-2xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-2xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 rounded-2xl"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg shadow-glow-accent"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Sign In
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-secondary/50 rounded-2xl">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Demo Admin Login:</p>
            <p className="text-xs text-muted-foreground">Email: admin@runclub.com</p>
            <p className="text-xs text-muted-foreground">Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
