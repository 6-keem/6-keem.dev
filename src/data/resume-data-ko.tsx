import { Github } from "lucide-react";
export const RESUME_DATA_KO: ResumeData = {
    name: "김상준",
    initials: "상준",
    location: "Seoul, South Korea, KST",
    locationLink: "https://www.google.com/maps/place/seoul",
    about: "풀스택 개발자",
    summary: "안녕하세요",
    avatarUrl: "https://avatars.githubusercontent.com/u/113224939?v=4",
    contact: {
        email: "6ukeem@gmail.com",
        social: [
            {
                name: "GitHub",
                url: "https://github.com/6-keem",
                icon: Github,
            },
        ],
    },
    education: [
        {
            school: "한성대학교",
            degree: "컴퓨터공학부 재학중",
            start: "2020",
            end: "",
        },
    ],
    work: [
        {
            company: "",
            link: "",
            title: "",
            start: "",
            end: undefined,
            description: "",
            points: [],
        },
    ],
    skills: ["Flutter", "React.js", "Next.js"],
} as const;

export type RESUME = typeof RESUME_DATA_KO;
