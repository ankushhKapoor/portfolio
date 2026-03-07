'use client';

import SimplePortfolio from '@/components/SimplePortfolio';
import { useRouter } from 'next/navigation';

export default function SimplePage() {
    const router = useRouter();
    return <SimplePortfolio onClose={() => router.push('/')} />;
}
