'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VenderPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/tornar-se-vendedor');
  }, [router]);

  return null;
}
