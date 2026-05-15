import ScrollTopLink from '@/components/common/ScrollTopLink';

export interface TrackCardData {
  id: number;
  name: string;
  description?: string;
  count: number;
  thumbnail?: string;
  href: string;
}

function TrackCard({ data }: { data: TrackCardData }) {
  return (
    <ScrollTopLink
      href={data.href}
      className="group bg-muted rounded-[20px] p-4 flex flex-col cursor-pointer"
    >
      <div className="w-full aspect-square rounded-xl overflow-hidden mb-4 bg-secondary">
        {data.thumbnail && (
          <img
            src={data.thumbnail}
            alt={data.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.12]"
          />
        )}
      </div>
      <div className="text-base font-bold text-foreground leading-snug mb-2.5 tracking-tight px-1 line-clamp-2 transition-colors duration-200 group-hover:text-title-hover">
        {data.name}
      </div>
      {data.description && (
        <div className="text-[13px] text-muted-foreground leading-relaxed mb-8 px-1 line-clamp-3">
          {data.description}
        </div>
      )}
      <span className="mt-auto inline-block bg-background rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground self-start mx-1">
        에피소드 {data.count}개
      </span>
    </ScrollTopLink>
  );
}

export default function TrackSection({ tracks }: { tracks: TrackCardData[] }) {
  if (!tracks.length) return null;
  return (
    <section className="mx-auto mt-20 mb-24 w-full max-w-[1130px] px-4 md:px-12">
      <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2">
        트랙
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {tracks.map((t) => (
          <TrackCard key={t.id} data={t} />
        ))}
      </div>
    </section>
  );
}
