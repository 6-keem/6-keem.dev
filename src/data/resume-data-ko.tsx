import { Github } from 'lucide-react';
export const RESUME_DATA_KO: ResumeData = {
  name: '김상준',
  initials: '상준',
  location: 'Seoul, South Korea, KST',
  locationLink: 'https://www.google.com/maps/place/seoul',
  about: '풀스택 개발자',
  summary: `**행동력**과 **포기하지 않는 집념**으로 문제를 해결하며 성장하는 개발자입니다.
**새로운 기술에 대한 탐구심**과 **꾸준한 학습 습관**을 바탕으로 끊임없이 역량을 확장하고 있으며, **사용자 중심의 사고**로 더 나은 경험을 제공하는 서비스를 만들어가고자 합니다.
또한 **팀원들과의 협업**을 통해 개인의 성장을 넘어 **좋은 결과**를 함께 만들어내는 것을 중요하게 생각하며, 이를 바탕으로 꾸준히 발전하는 **풀스택 개발자**가 되기를 꿈꾸고 있습니다.`,
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
      school: '한성대학교',
      degree: '컴퓨터공학부',
      start: '2020',
      end: '',
    },
    {
      school: '킨키대학',
      degree: '정보학부 교환학생',
      start: '2025.09',
      end: '',
    },
  ],
  work: [
    {
      company: '에브리아이',
      link: '',
      title: 'Full Stack Developer',
      start: '2025.06',
      end: undefined,
      description: '한성대학교 산학연계 프로젝트',
      points: ['챗봇 인터페이스 개발', 'FastAPI 백앤드 서버 개발', 'LangChain 파이프라인 구축', 'Neo4j 활용 Graph RAG 개발'],
    },
  ],
  skills: ['Flutter', 'React.js', 'Next.js'],
} as const;

export type RESUME = typeof RESUME_DATA_KO;
