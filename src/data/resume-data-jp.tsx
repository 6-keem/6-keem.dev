import { Github } from "lucide-react";
export const RESUME_DATA_JP: ResumeData = {
    name: "キム・サンジュン",
    initials: "サンジュン",
    location: "ソウル、韓国、KST",
    locationLink: "https://www.google.com/maps/place/seoul",
    about: "フルスタック開発者",
    summary: "こんにちは",
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
            school: "漢城大学校",
            degree: "コンピュータ工学部在学中",
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

export type RESUME = typeof RESUME_DATA_JP;
