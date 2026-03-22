'use client';

import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
      <div className="w-full max-w-md px-4 py-12">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span
              className="text-[20px] font-extrabold text-[#23211D] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              STEADYWRK
            </span>
          </Link>
        </div>
        <SignIn
          fallbackRedirectUrl="/dashboard"
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
  );
}
