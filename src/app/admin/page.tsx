'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminHomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect alla pagina di gestione pagine
    router.push('/admin/pages');
  }, [router]);

  return null;
}
