import { RESUME_DATA_EN } from '@/data/resume-data-en';
import { RESUME_DATA_JP } from '@/data/resume-data-jp';
import { RESUME_DATA_KO } from '@/data/resume-data-ko';

// ============ 테스트 중 ==================
export interface PostInfo {
  id: number;
  title: string;
  category: string;
  description: string;
  date: string;
  series_id: number;
  thumbnail: string;
}

export interface PostDetail {
  id: number;
  content: string;
  tag: string[];
  post_id: number;
}

export interface Post extends PostInfo, PostDetail {}

export interface SeriesInfo {
  id: number;
  series_name: string;
}

// ============ 테스트 중 ==================

export interface HeadingItem {
  text: string;
  link: string;
  indent: number;
}

export interface ProjectMatter {
  title: string;
  desc: string;
  startMonth: string;
  endMonth: string;
  tags: string;
  gitRepoUrl?: string;
  link?: string;
}

export interface Project extends ProjectMatter {
  slug: string;
  startMonthString: string;
  endMonthString?: string;
  content: string;
}

export const DATAS = {
  en: {
    data: RESUME_DATA_EN,
    aboutClassName: '',
  },
  ko: {
    data: RESUME_DATA_KO,
    aboutClassName: 'sm:whitespace-pre-wrap whitespace-normal',
  },
  jp: {
    data: RESUME_DATA_JP,
    aboutClassName: 'sm:whitespace-pre-wrap whitespace-normal',
  },
};

export type Locale = keyof typeof DATAS;

export interface PhotoMatter {
  title: string;
  date: Date;
  dateString: string;
  thumbnail: string;
  desc: string;
  tags: string[];
  location: string;
}

export interface Photo extends PhotoMatter {
  uniqueKey: string;
}
