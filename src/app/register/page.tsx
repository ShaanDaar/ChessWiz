import { Suspense } from 'react';
import RegisterForm from './RegisterForm';

export const metadata = {
  title: 'Register — Chessie',
  description: 'Create your Chessie account and join the cozy parlor.',
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#140b07] text-[#fdfbf7]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
