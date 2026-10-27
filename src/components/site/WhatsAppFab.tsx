'use client';

import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * WhatsApp is how most Nigerian businesses actually open a conversation, so
 * it earns a persistent affordance. Appears after the first screen rather
 * than covering the hero.
 */
export default function WhatsAppFab() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href="https://wa.me/2348035989359?text=Hello%20Arrow-Edge%2C%20I%27d%20like%20to%20discuss%20an%20engagement."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Arrow-Edge on WhatsApp"
      className={cn(
        'fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full',
        'bg-[#25D366] text-white shadow-liftLg transition-all duration-400',
        'hover:scale-105 active:scale-95',
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <MessageCircle className="h-6 w-6" strokeWidth={1.8} aria-hidden />
    </a>
  );
}
