import { Github } from "lucide-react";
export const RESUME_DATA_EN: ResumeData = {
    name: "SANGJUN KIM",
    initials: "KSJ",
    location: "Seoul, South Korea, KST",
    locationLink: "https://www.google.com/maps/place/seoul",
    about: "Full Stack Developer",
    summary: "Hello",
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
            school: "Hansung Univ.",
            degree: "Currently enrolled in Computer Science",
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

export type RESUME = typeof RESUME_DATA_EN;
