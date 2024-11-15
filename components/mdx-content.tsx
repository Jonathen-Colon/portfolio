'use client';

import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useEffect, useState } from 'react';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import components from './mdx-components';

interface MDXContentProps {
  source: string;
}

export function MDXContent({ source }: MDXContentProps) {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    async function processContent() {
      const mdxSource = await serialize(source, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug, [rehypePrettyCode, { theme: 'github-dark' }]],
        },
        parseFrontmatter: true,
      });
      setContent(mdxSource);
    }

    processContent();
  }, [source]);

  if (!content) {
    return <div>Loading...</div>;
  }

  return <MDXRemote {...content} components={components} />;
}
