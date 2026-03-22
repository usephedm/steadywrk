'use client';

import dynamic from 'next/dynamic';

const SmoothCursor = dynamic(
  () => import('@/components/ui/smooth-cursor').then((m) => m.SmoothCursor),
  { ssr: false },
);

// const WhatsAppFloat = dynamic(
//   () => import('@/components/ui/whatsapp-float').then((m) => m.WhatsAppFloat),
//   { ssr: false },
// );

const BackToTop = dynamic(
  () => import('@/components/ui/back-to-top').then((m) => m.BackToTop),
  { ssr: false },
);

export function ClientGlobals() {
  return (
    <>
      <SmoothCursor />
      {/* <WhatsAppFloat /> */}
      <BackToTop />
    </>
  );
}
