export type PostMeta = {
  title: string;
  tags: string[];
  desc: string;
  seriesId: number | null;
  seriesName: string;
  category: string;
  thumbnailUrl?: string;
  isHero: boolean;
};
