import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Logo({
  className, invert = false, priority = false,
}: { className?: string; invert?: boolean; priority?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Arrow-Edge Professional Services — home"
      className={cn('inline-flex shrink-0 items-center transition-opacity hover:opacity-85', className)}
    >
      <Image
        src="/brand/logo.png"
        alt="Arrow-Edge Professional Services"
        width={1800} height={600} priority={priority}
        sizes="(max-width: 640px) 170px, 215px"
        className={cn(
          'h-auto w-[170px] sm:w-[200px] lg:w-[215px]',
          // The supplied mark has black wordmark text, which disappears on a
          // dark footer. Inverting just the dark pixels keeps the gold intact.
          invert && 'brightness-0 invert',
        )}
      />
    </Link>
  );
}
