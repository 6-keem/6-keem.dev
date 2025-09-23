import { Github } from 'lucide-react';
export const RESUME_DATA_JP: ResumeData = {
  name: 'キム・サンジュン',
  initials: 'サンジュン',
  location: 'ソウル、韓国、KST',
  locationLink: 'https://www.google.com/maps/place/seoul',
  about: 'フルスタックエンジニア',
  summary: `
**行動力**と**諦めない粘り強さ**で問題を解決し、成長するエンジニアです。
新しい技術への**好奇心**と**継続的な学習習慣**を基に、能力を絶えず拡張し、**ユーザー中心の思考**でより良い体験を提供するサービスを作りたいと考えています。
また、**チームメンバーとの協力**を通じて個人の成長を超え、**良い成果**を共に生み出すことを重視しており、それを基に着実に成長する**フルスタックエンジニア**になることを目指しています。
`,

  avatarUrl: 'https://avatars.githubusercontent.com/u/113224939?v=4',
  contact: {
    email: '6ukeem@gmail.com',
    social: [
      {
        name: 'GitHub',
        url: 'https://github.com/6-keem',
        icon: Github,
      },
    ],
  },
  education: [
    {
      school: '漢城大学',
      degree: 'コンピュータ工学部',
      start: '2020',
      end: '',
    },
    {
      school: '近畿大学',
      degree: '情報学部 交換留学',
      start: '2025.09',
      end: '',
    },
  ],
  work: [
    {
      company: 'Every I',
      link: '',
      title: 'フルスタックエンジニア',
      start: '2025.06',
      end: undefined,
      description: '漢城大学 産学連携プロジェクト',
      points: [
        'チャットボットインターフェース開発',
        'FastAPIバックエンドサーバー開発',
        'LangChainパイプライン構築',
        'Neo4jを活用したGraph RAG開発',
      ],
    },
  ],
  skills: ['Flutter', 'React.js', 'Next.js'],
} as const;

export type RESUME = typeof RESUME_DATA_JP;
