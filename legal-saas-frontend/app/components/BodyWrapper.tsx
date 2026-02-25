'use client';

import { useEffect } from 'react';

export default function BodyWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // This runs only on the client, avoiding SSR hydration mismatches
    // Any browser extension attributes will be handled here
  }, []);

  return <>{children}</>;
}
