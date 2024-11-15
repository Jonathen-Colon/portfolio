'use server';

import { notFound } from 'next/navigation';
import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { PostHeader } from '@/components/blog/post-header';
import { MDXContent } from '@/components/mdx-content';

interface Props {
  params: {
    slug: string;
  };
}

async function getPost(slug: string) {
  const postsDirectory = join(process.cwd(), 'content');
  const fullPath = join(postsDirectory, `${slug}.mdx`);

  try {
    const fileContents = readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      frontmatter: data,
      content,
    };
  } catch (error) {
    return null;
  }
}

export default async function BlogPost({ params }: Props) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container relative mx-auto max-w-4xl px-6 py-16">
      <article className="mx-auto">
        <PostHeader
          title={post.frontmatter.title}
          description={post.frontmatter.description}
          date={post.frontmatter.date}
          tags={post.frontmatter.tags}
        />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-8 [&_:not(pre)>code]:bg-neutral-200 dark:[&_:not(pre)>code]:bg-neutral-800">
          <MDXContent source={post.content} />
        </div>
      </article>
    </div>
  );
}
