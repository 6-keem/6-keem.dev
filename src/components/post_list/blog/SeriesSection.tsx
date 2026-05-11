import Link from 'next/link';

export interface SeriesCardData {
  id: number;
  name: string;
  description?: string;
  count: number;
  thumbnail?: string;
  href: string;
}

function SeriesCard({ data }: { data: SeriesCardData }) {
  return (
    <Link
      href={data.href}
      className="bg-muted rounded-[20px] p-4 flex flex-col cursor-pointer transition-transform hover:-translate-y-1"
    >
      <div className="w-full aspect-square rounded-xl overflow-hidden mb-4 bg-secondary">
        {data.thumbnail && (
          <img src={data.thumbnail} alt={data.name} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="text-base font-bold text-foreground leading-snug mb-2.5 tracking-tight px-1 line-clamp-2">
        {data.name}
      </div>
      {data.description && (
        <div className="text-[13px] text-muted-foreground leading-relaxed flex-1 mb-8 px-1 line-clamp-3">
          {data.description}
        </div>
      )}
      <span className="inline-block bg-background rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground self-start mx-1">
        아티클 {data.count}개
      </span>
    </Link>
  );
}

export default function SeriesSection({ series }: { series: SeriesCardData[] }) {
  if (!series.length) return null;
  return (
    <section className="mx-auto mt-20 mb-24 w-full max-w-[1130px] px-4 md:px-12">
      <h2 className="text-2xl md:text-[26px] font-extrabold text-foreground tracking-tight mb-2">
        아티클 시리즈
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {series.map((s) => (
          <SeriesCard key={s.id} data={s} />
        ))}
      </div>
    </section>
  );
}
