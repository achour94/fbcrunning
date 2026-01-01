import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { useBackend } from '@/context/MockBackendContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import fbcLogo from '@/assets/fbc-logo.jpg';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useBackend();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const result = signup(name, email, password);
    
    setTimeout(() => {
      setIsLoading(false);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Signup failed');
      }
    }, 500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary/30 via-background to-primary/10 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-scale-in">
          <div className="bg-card rounded-3xl shadow-soft p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Account Created!</h2>
            <p className="text-muted-foreground mb-6">
              Your account is waiting for admin approval. We'll notify you once you're approved to join the running crew!
            </p>
            <Button 
              onClick={() => navigate('/login')}
              className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 font-bold"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/30 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-card rounded-3xl shadow-soft mb-4">
            <img src={fbcLogo} alt="FBC Running Club" className="h-20 w-auto rounded-2xl" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground">Join the Crew!</h1>
          <p className="text-muted-foreground mt-2">Create your account to start running</p>
        </div>

        {/* Signup Form */}
        <div className="bg-card rounded-3xl shadow-soft p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="rounded-2xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-12 rounded-2xl"
                />
              </div>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Create Account
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
