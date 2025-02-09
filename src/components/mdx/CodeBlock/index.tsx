'use client';

import { Check, Clipboard } from 'lucide-react';
import { DetailedHTMLProps, HTMLAttributes, useRef, useState } from 'react';
import './codeBlock.css';

interface CodeBlockProps extends DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement> {
  title?: string;
  caption?: string;
}

const CodeBlock = ({ className = '', children, title, caption, ...props }: CodeBlockProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const preRef = useRef<HTMLPreElement>(null);

  const handleClickCopy = async () => {
    const code = preRef.current?.textContent;

    if (code) {
      setIsLoading(true);
      await navigator.clipboard.writeText(code);
      setIsLoading(false);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2500);
    }
  };

  return (
    <figure data-rehype-pretty-code-figure className="relative m-0">
      {title && (
        <figcaption data-rehype-pretty-code-title className="code-block-title ">
          {title}
        </figcaption>
      )}

      <pre ref={preRef} {...props} className={className}>
        {children}
      </pre>

      {caption && (
        <figcaption data-rehype-pretty-code-caption className="code-block-caption">
          {caption}
        </figcaption>
      )}

      <button
        disabled={isCopied || isLoading}
        aria-label={isCopied ? 'Copied!' : 'Copy code'}
        onClick={handleClickCopy}
        className="code-copy-button absolute right-[0.1rem] top-[0.35rem] flex h-fit w-fit items-center gap-x-[0.4rem] rounded-[0.4rem] bg-transparent px-[0.8rem] py-[0.4rem]"
      >
        <span className="icon-wrapper">
          <Clipboard className={`icon clipboard-icon ${isCopied ? 'icon-hidden' : ''}`} strokeWidth={1.5} />
          <Check className={`icon check-icon ${isCopied ? 'icon-visible' : ''}`} strokeWidth={2} />
        </span>
      </button>
    </figure>
  );
};

export default CodeBlock;
