import React from "react";
import CategoryList from "./CategoryList";
import PostCard from "./PostCard";
import {
    getAllPostCount,
    getCategoryDetailList,
    getSortedPostList,
} from "@/lib/post";

interface PostListProps {
    category?: string;
}

const PostListPage = async ({ category }: PostListProps) => {
    const postList = await getSortedPostList(category);
    const categoryList = await getCategoryDetailList();
    const allPostCount = await getAllPostCount();

    return (
        <section className="mx-auto mt-12 w-full max-w-[950px] px-4">
            <CategoryList
                allPostCount={allPostCount}
                categoryList={categoryList}
                currentCategory={category}
            />
            <section>
                <ul className="grid grid-cols-1">
                    {postList.map((post, index) => (
                        <React.Fragment key={post.uniqueKey || index}>
                            <PostCard post={post} />
                            {index !== postList.length - 1 && (
                                <hr className="my-3" />
                            )}
                        </React.Fragment>
                    ))}
                    {postList.length > 3 && <div className="mb-8"></div>}
                </ul>
            </section>
        </section>
    );
};

export default PostListPage;
