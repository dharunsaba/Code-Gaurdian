import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, Code2, Sparkles } from 'lucide-react';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string; mobile?: string }>({});
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { username?: string; password?: string; mobile?: string } = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && mobileNumber.trim()) {
      if (!/^\d{10}$/.test(mobileNumber.replace(/\D/g, ''))) {
        newErrors.mobile = 'Please enter a valid 10-digit mobile number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (isLogin) {
          await login(username.trim(), password);
        } else {
          await register(username.trim(), password, mobileNumber.replace(/\D/g, ''));
        }
        navigate('/dashboard');
      } catch (error) {
        // Errors handled in context
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-dark p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary glow-primary mb-6">
            <Code2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Code<span className="text-gradient">Optimizer</span>
          </h1>
          <p className="text-muted-foreground">
            AI-powered code optimization at your fingertips
          </p>
        </div>

        <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-8 shadow-elevated">
          <div className="flex gap-4 mb-6">
            <Button
              variant={isLogin ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => setIsLogin(true)}
            >
              Login
            </Button>
            <Button
              variant={!isLogin ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => setIsLogin(false)}
            >
              Register
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={errors.username ? 'border-destructive' : ''}
              />
              {errors.username && (
                <p className="text-xs text-destructive">{errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="mobile" className="text-sm font-medium text-foreground">
                  Mobile Number (Optional)
                </label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className={errors.mobile ? 'border-destructive' : ''}
                />
                {errors.mobile && (
                  <p className="text-xs text-destructive">{errors.mobile}</p>
                )}
              </div>
            )}

            <Button type="submit" variant="glow" size="lg" className="w-full">
              <Zap className="w-5 h-5" />
              {isLogin ? 'Login' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>AI Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Fast Results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
