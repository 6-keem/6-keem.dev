import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

interface Props {
    url: string;
}

export const GitRepo = ({ url }: Props) => {
    return (
        <Link href={url} target="_blank">
            <Button className="gap-2" variant="outline">
                <Github className="size-4" />
                Git Repository
            </Button>
        </Link>
    );
};
