import Link from "next/link";

import { Button } from "../ui/button";

interface Props {
    isCurrent: boolean;
    displayName: string;
    href: string;
    count: number;
}

export const CategoryButton = ({ isCurrent, displayName, href }: Props) => {
    const textColor = isCurrent ? "text-text-selected" : "text-text-unselected";
    return (
        <li>
            <div className="">
                <Link href={href} className={`text-2xl ${textColor}`}>
                    {displayName}
                </Link>
            </div>
        </li>
    );
};
