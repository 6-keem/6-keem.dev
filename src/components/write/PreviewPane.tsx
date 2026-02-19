'use client';

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

import { PostMeta } from './types';
import { Callout } from '@/components/mdx/Callout';
import { Highlight } from '@/components/mdx/Highlight';
import { Quotation } from '@/components/mdx/Quotation';
import { escapeHtmlExceptCustom } from './toolbar/escapeHtmlExceptCustom';

type Props = {
  meta: PostMeta;
  content: string;
  thumbnailPreview: string;
};

const schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'callout', 'highlight', 'quotation'],
  attributes: {
    ...(defaultSchema.attributes ?? {}),
    callout: ['type', 'title', 'className'],
    highlight: ['color', 'className'],
    quotation: ['className'],
    img: ['src', 'alt', 'title', 'loading', 'className'],
    a: ['href', 'target', 'rel', 'title', 'className'],
  },
};

function isBlockish(node: React.ReactNode) {
  if (!React.isValidElement(node)) return false;

  if (node.type === Callout) return true;
  if (node.type === Quotation) return true;

  const t = node.type;
  if (typeof t === 'string') {
    return (
      t === 'div' ||
      t === 'section' ||
      t === 'article' ||
      t === 'aside' ||
      t === 'header' ||
      t === 'footer' ||
      t === 'nav' ||
      t === 'table' ||
      t === 'pre' ||
      t === 'ul' ||
      t === 'ol' ||
      t === 'li' ||
      t === 'blockquote' ||
      t === 'hr' ||
      /^h[1-6]$/.test(t)
    );
  }

  return false;
}

export default function PreviewPane({ meta, content, thumbnailPreview }: Props) {
  const previewTitle = meta.title || '제목을 입력하세요';
  const safeContent = useMemo(() => escapeHtmlExceptCustom(content, ['callout', 'highlight', 'quotation']), [content]);

  return (
    <section className="h-full min-h-0 overflow-auto bg-background">
      <div className="p-8 pb-48">
        {thumbnailPreview ? (
          <div className="mb-8">
            <img src={thumbnailPreview} alt="thumbnail" className="w-full max-h-[340px] rounded-2xl object-cover border border-border" />
          </div>
        ) : null}

        <div className="mb-10">
          <h1 className="text-[2.6rem] font-extrabold leading-tight tracking-tight text-foreground">{previewTitle}</h1>

          {meta.desc ? <p className="mt-4 text-base text-muted-foreground">{meta.desc}</p> : null}

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {meta.seriesName ? (
              <span className="rounded-full border border-border bg-background/60 px-3 py-1">Series: {meta.seriesName}</span>
            ) : null}

            {meta.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {meta.tags.map((t) => (
                  <span key={t} className="rounded-full bg-muted px-3 py-1 text-sm text-foreground">
                    #{t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
            components={{
              p: ({ children }) => <div className="my-4 leading-7">{children}</div>,

              img: (props) => (
                <img
                  {...props}
                  alt={props.alt ?? ''}
                  loading="lazy"
                  className="my-6 w-full rounded-2xl border border-border object-contain"
                />
              ),

              callout: (props: any) => (
                <Callout type={props.type} title={props.title}>
                  {props.children}
                </Callout>
              ),

              highlight: (props: any) => <Highlight color={props.color}>{props.children}</Highlight>,

              quotation: (props: any) => <Quotation className={props.className}>{props.children}</Quotation>,
            }}
          >
            {safeContent}
          </ReactMarkdown>
        </article>
      </div>
    </section>
  );
}
