export type PostMeta = {
  title: string;
  tags: string[];
  desc: string;
  trackId: number | null;
  trackName: string;
  category: string;
  thumbnailUrl?: string;
  isHero: boolean;
};
