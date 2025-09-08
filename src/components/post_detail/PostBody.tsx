import { Post } from '@/config/types';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkA11yEmoji from '@fec/remark-a11y-emoji';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { MDXComponent } from '../mdx';
import plasticTheme from '@/../plastic-theme.json';
import Series from '../mdx/Series';

interface Props {
  post: Post;
  posts: Post[];
}

export const PostBody = ({ post, posts }: Props) => {
  let seriesPost: Post[] = [];
  try {
    seriesPost = posts.filter((p) => p.seriesName === post.seriesName);
  } catch {}

  return (
    <div className="w-full max-w-[750px] mx-auto">
      <hr className="mt-5 border-foreground-100" />
      {post.seriesName !== undefined ? <Series seriesName={post.seriesName} slug={post.slug} posts={seriesPost} /> : <></>}
      <MDXRemote
        source={post.content}
        options={{
          mdxOptions: {
            remarkPlugins: [
              // 깃허브 Flavored 마크다운 지원 추가 (version downgrade)
              remarkGfm,
              // 이모티콘 접근성 향상
              remarkA11yEmoji,
              // mdx 1줄 개행 지원
              remarkBreaks,
            ],
            rehypePlugins: [
              // pretty code block
              [
                // @ts-ignore
                rehypePrettyCode,
                {
                  theme: {
                    dark: plasticTheme,
                    light: 'github-light',
                  },
                },
              ],
              // toc id를 추가하고 제목을 연결
              rehypeSlug,
            ],
          },
        }}
        components={MDXComponent}
      />
    </div>
  );
};
