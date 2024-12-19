import Link from "next/link";

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
                <Link href={href} className={`text-xl ${textColor}`}>
                    <span className="font-normal">{displayName}</span>
                </Link>
            </div>
        </li>
    );
};
