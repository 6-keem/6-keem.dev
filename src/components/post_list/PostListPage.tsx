import React from "react";
import CategoryList from "./CategoryList";
import PostCard from "./PostCard";
import { getAllPostCount, getCategoryDetailList, getSortedPostList } from "@/lib/post";
import { auth } from "@/lib/auth";
import { Post } from "@/config/types";
import { Session } from "next-auth";

interface PostListProps {
    category?: string;
}

export interface PostWithVisibility extends Post {
    visibility: "public" | "private";
}

export const PRIVATE_CATEGORY = ["日本生活🔰"];

const getIsAuthorized = (session: Session | null): boolean => {
    if (!session) return false;

    if (session.user?.email === "6ukeem@gmail.com") return true;

    const follwers = session.user?.followers;
    if (!follwers || follwers.length === 0) return false;

    follwers.map((follwer) => {
        if (follwer.login === "6-keem") return true;
    });
    return false;
};

const getIsPrivate = (categoryName: string) => {
    return PRIVATE_CATEGORY.includes(categoryName);
};

const PostListPage = async ({ category }: PostListProps) => {
    const postList: Post[] = await getSortedPostList(category);
    const categoryList = await getCategoryDetailList();
    const allPostCount = await getAllPostCount();
    const session = await auth();
    const isAuthorized = getIsAuthorized(session);
    const visibilityPostList: PostWithVisibility[] = postList.map((post) => {
        const visibilityPost: PostWithVisibility = {
            ...post,
            visibility: isAuthorized ? "public" : getIsPrivate(post.categoryPublicName) ? "private" : "public",
        };
        return visibilityPost;
    });

    return (
        <section className="mx-auto mt-12 w-full max-w-[950px] px-4">
            <CategoryList allPostCount={allPostCount} categoryList={categoryList} currentCategory={category} />
            <section>
                <ul className="grid grid-cols-1">
                    {visibilityPostList.map((post, index) => (
                        <React.Fragment key={post.uniqueKey || index}>
                            <PostCard post={post} />
                            {index !== postList.length - 1 && <hr className="my-3" />}
                        </React.Fragment>
                    ))}
                    {postList.length > 3 && <div className="mb-8"></div>}
                </ul>
            </section>
        </section>
    );
};

export default PostListPage;
