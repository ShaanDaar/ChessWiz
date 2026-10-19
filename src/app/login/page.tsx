import { Suspense } from 'react';
import LoginForm from './LoginForm';

export const metadata = {
  title: 'Log In — Chessie',
  description: 'Log in to your Chessie account and play chess with your AI companion.',
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#140b07] text-[#fdfbf7]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
