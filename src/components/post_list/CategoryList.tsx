"use client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CategoryButton } from "./CategoryButton";
import { CategoryDetail } from "@/config/types";
import { useRouter } from "next/navigation";

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
    const router = useRouter();

    const onCategoryChange = (value: string) => {
        if (value === "All") {
            router.push("/blog");
        } else {
            router.push(`/blog/${value}`);
        }
    };
    return (
        <>
            <section className="flex flex-col mb-12 items-center justify-center">
                <div className="text-4xl font-normal mb-2 text-primary">{`${currentCategory}`}</div>
                <div className="text-2xl font-thin">{`
                ${
                    currentCategory === "All"
                        ? allPostCount
                        : categoryList.find(
                              (category) => category.dirName === currentCategory
                          )?.count || 0
                } posts`}</div>
            </section>

            <section className="mb-6 px-4 hidden sm:block">
                <ul className="flex gap-4">
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
            <section className="mb-6 sm:hidden">
                <Select
                    onValueChange={onCategoryChange}
                    defaultValue={currentCategory}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {categoryList.map((cg) => (
                            <SelectItem key={cg.dirName} value={cg.dirName}>
                                {cg.publicName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </section>
        </>
    );
};

export default CategoryList;
