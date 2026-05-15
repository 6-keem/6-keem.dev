import { Layers } from 'lucide-react';

interface Props {
  trackName: string;
  description: string | null;
  thumbnailUrl: string | null;
  postCount: number;
}

export default function TrackHeader({ trackName, description, thumbnailUrl, postCount }: Props) {
  return (
    <section className="mx-auto mt-12 w-full max-w-[1130px] px-4 md:px-12">
      <div className="relative h-[360px] md:h-[420px] rounded-2xl overflow-hidden bg-secondary">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={trackName} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Layers className="w-24 h-24 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/5 dark:from-black/85 dark:via-black/40 dark:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight drop-shadow">
            {trackName}
          </h1>
          {description && (
            <p className="mt-3 text-sm md:text-base text-white/85 leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
          <span className="mt-5 inline-block bg-white/15 backdrop-blur-sm rounded-full px-3.5 py-1.5 text-xs md:text-sm font-medium text-white/90">
            에피소드 {postCount}개
          </span>
        </div>
      </div>
    </section>
  );
}
