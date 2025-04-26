import { Callout } from './Callout';
import { Image } from './Image';
import { ExternalLink } from './Link';
import { MDXComponents } from 'mdx/types';
import { Thumbnail } from './Thumbnail';
import { Highlight } from './Highlight';
import CodeBlock from './CodeBlock';
import { Quotation } from './Quotation';

export const MDXComponent: MDXComponents = {
  a: ExternalLink as any,
  img: Image as any,
  blockquote: Callout,
  Callout,
  Thumbnail: Thumbnail,
  Highlight: Highlight,
  pre: (props: any) => <CodeBlock {...props} />,
  Quotation
};
