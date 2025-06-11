import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRequired?: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, isRequired = false }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, signUp, signInWithGoogle } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-8 w-96 relative">
        {!isRequired && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        )}
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        {/* Google Sign In Button */}
        <Button
          onClick={handleGoogleSignIn}
          className="w-full mb-4 bg-background text-foreground border border-border hover:bg-muted"
          variant="outline"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Continue with Google
        </Button>

        <div className="relative my-4">
          <Separator className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </Separator>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-border shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-border shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-primary/80"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal; 