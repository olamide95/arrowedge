import {
  Receipt, ShieldCheck, Banknote, Compass, Briefcase, Radar, type LucideIcon,
} from 'lucide-react';

const MAP: Record<string, LucideIcon> = {
  receipt: Receipt,
  'shield-check': ShieldCheck,
  banknote: Banknote,
  compass: Compass,
  briefcase: Briefcase,
  radar: Radar,
};

export default function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = MAP[name] ?? Compass;
  return <Icon className={className} strokeWidth={1.4} aria-hidden />;
}
