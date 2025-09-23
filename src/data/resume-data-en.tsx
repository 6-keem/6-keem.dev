import { Github } from 'lucide-react';
export const RESUME_DATA_EN: ResumeData = {
  name: 'SANGJUN KIM',
  initials: 'KEEM',
  location: 'Seoul, South Korea, KST',
  locationLink: 'https://www.google.com/maps/place/seoul',
  about: 'Full Stack Developer',
  summary: `
A developer who grows by solving problems with **initiative** and **relentless perseverance**.
Continuously expanding my capabilities through **curiosity for new technologies** and **consistent learning habits**, I aim to create services that offer **better user experiences**.
I also value **teamwork**, working together with colleagues to achieve **great results**, and aspire to become a steadily evolving **full-stack developer**.
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
      school: 'Hansung University',
      degree: 'Department of Computer Engineering',
      start: '2020',
      end: '',
    },
    {
      school: 'Kindai University',
      degree: 'Exchange Student, Department of Informatics',
      start: '2025.09',
      end: '',
    },
  ],
  work: [
    {
      company: 'Every I',
      link: '',
      title: 'Full Stack Developer',
      start: '2025.06',
      end: undefined,
      description: 'Hansung University Industry-Academia Project',
      points: [
        'Developed chatbot interface',
        'Built FastAPI backend server',
        'Implemented LangChain pipeline',
        'Developed Graph RAG using Neo4j',
      ],
    },
  ],
  skills: ['Flutter', 'React.js', 'Next.js'],
} as const;

export type RESUME = typeof RESUME_DATA_EN;
