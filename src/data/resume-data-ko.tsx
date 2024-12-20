import { Github } from "lucide-react";
export const RESUME_DATA_KO = {
    name: "",
    initials: "",
    location: "Seoul, South Korea, KST",
    locationLink: "https://www.google.com/maps/place/seoul",
    about: "",
    summary: "",
    avatarUrl: "",
    contact: {
        email: "ehgud456456@naver.com",
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
            school: "",
            degree: "",
            start: "",
            end: "",
        },
    ],
    work: [
        {
            company: "",
            link: "",
            title: "",
            start: "",
            end: null,
            description: "",
            points: [""],
        },
        {
            company: "",
            link: "",
            title: "",
            start: "",
            end: null,
            description: "",
            points: [""],
        },
    ],
    skills: ["Javascript", "Typescript", "React.js", "Vue.js", "Next.js"],
} as const;

export type RESUME = typeof RESUME_DATA_KO;
