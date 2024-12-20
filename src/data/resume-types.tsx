type WorkPoint = string | { title: string; slug: string };

interface Work {
    company: string;
    link: string;
    start: string;
    end?: string;
    description: string;
    title: string;
    points?: WorkPoint[];
}

interface Education {
    school: string;
    degree: string;
    start: string;
    end?: string;
}

interface Social {
    name: string;
    url: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface Contact {
    email: string;
    social: Social[];
}

interface ResumeData {
    name: string;
    initials: string;
    location: string;
    locationLink: string;
    about: string;
    summary: string;
    avatarUrl: string;
    contact: Contact;
    education: Education[];
    work: Work[];
    skills: string[];
}
