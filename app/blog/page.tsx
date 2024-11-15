import Link from 'next/link';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Post {
  slug: string;
  frontmatter: {
    title: string;
    description?: string;
    date: string;
    tags?: string[];
  };
}

async function getPosts(): Promise<Post[]> {
  const postsDirectory = join(process.cwd(), 'content');
  const filenames = readdirSync(postsDirectory);
  
  const posts = filenames
    .filter(filename => filename.endsWith('.mdx'))
    .map(filename => {
      const filePath = join(postsDirectory, filename);
      const fileContents = readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      return {
        slug: filename.replace('.mdx', ''),
        frontmatter: {
          title: data.title,
          description: data.description,
          date: data.date,
          tags: data.tags,
        },
      };
    })
    .sort((a, b) => 
      new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    );

  return posts;
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="container relative mx-auto max-w-4xl px-6 py-16">
      <div className="flex flex-col items-start gap-4">
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground leading-8">
            Thoughts, ideas, and tutorials about web development and technology.
          </p>
        </div>
        <Separator className="my-4" />
      </div>
      <div className="grid gap-6 pt-8 md:grid-cols-2">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
            <Card className="h-full transition-colors hover:border-primary">
              <CardHeader>
                <CardTitle className="line-clamp-2">{post.frontmatter.title}</CardTitle>
                {post.frontmatter.description && (
                  <CardDescription className="line-clamp-2">
                    {post.frontmatter.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {post.frontmatter.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <time className="text-sm text-muted-foreground">
                  {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
