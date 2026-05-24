'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductForm() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/products');
  }, [router]);

  return <div className="p-8 text-center text-muted-foreground">Opening product manager</div>;
}
