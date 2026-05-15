export default function ChevronIcon({ direction = 'right', size = 14 }: { direction?: 'left' | 'right'; size?: number }) {
  const d = direction === 'left' ? 'M9 2L4 7l5 5' : 'M5 2l5 5-5 5';
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
