import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentDir = join(__dirname, '../content');
const outputDir = join(__dirname, '../app/blog');

async function buildMDX() {
  const files = readdirSync(contentDir);

  for (const file of files) {
    if (!file.endsWith('.mdx')) continue;

    const filePath = join(contentDir, file);
    const content = readFileSync(filePath, 'utf8');
    const { data, content: mdxContent } = matter(content);

    const source = await serialize(mdxContent, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypePrettyCode, { theme: 'github-dark' }]],
      },
      parseFrontmatter: true,
    });

    const slug = file.replace('.mdx', '');
    const outputPath = join(outputDir, slug);
    
    try {
      mkdirSync(outputPath, { recursive: true });
    } catch (error) {
      // Directory already exists
    }

    writeFileSync(
      join(outputPath, 'page.json'),
      JSON.stringify({
        source,
        frontmatter: {
          title: data.title,
          description: data.description,
          date: data.date,
          tags: data.tags,
        },
      })
    );
  }
}

buildMDX().catch(console.error);
