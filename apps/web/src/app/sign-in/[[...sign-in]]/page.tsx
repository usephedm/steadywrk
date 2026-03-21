import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your STEADYWRK account to access your dashboard.',
};

export default function SignInPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAFAF8] flex items-center justify-center pt-16">
        <div className="w-full max-w-md px-4 py-12">
          <SignIn
            appearance={{
              elements: {
                rootBox: 'mx-auto',
                card: 'shadow-md rounded-xl border border-[rgba(0,0,0,0.06)]',
              },
              variables: {
                colorPrimary: '#E58A0F',
                colorText: '#23211D',
                colorTextSecondary: '#6E695F',
                colorBackground: '#FFFFFF',
                borderRadius: '0.75rem',
                fontFamily: 'Satoshi, system-ui, sans-serif',
              },
            }}
          />
        </div>
      </main>
    </>
  );
}
