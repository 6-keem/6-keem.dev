"use client";

import { useRouter } from "next/navigation";

import { CategoryButton } from "./CategoryButton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CategoryDetail } from "@/config/types";

interface CategoryListProps {
    categoryList: CategoryDetail[];
    allPostCount: number;
    currentCategory?: string;
}

const CategoryList = ({
    categoryList,
    allPostCount,
    currentCategory = "All",
}: CategoryListProps) => {
    return (
        <>
            <section className="flex flex-col items-center justify-center mb-8">
                <div className="text-4xl font-bold mb-2">{`${currentCategory}`}</div>
                <div className="text-2xl">{`
                ${
                    currentCategory === "All"
                        ? allPostCount
                        : categoryList.find(
                              (category) => category.dirName === currentCategory
                          )?.count || 0
                } posts`}</div>
            </section>

            <section className="mb-10 hidden sm:block">
                <ul className="flex gap-3">
                    <CategoryButton
                        href="/blog"
                        isCurrent={currentCategory === "All"}
                        displayName="All"
                        count={allPostCount}
                    />
                    {categoryList.map((cg) => (
                        <CategoryButton
                            key={cg.dirName}
                            href={`/blog/${cg.dirName}`}
                            displayName={cg.publicName}
                            isCurrent={cg.dirName === currentCategory}
                            count={cg.count}
                        />
                    ))}
                </ul>
            </section>
        </>
    );
};

export default CategoryList;
