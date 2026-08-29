import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { normalizeBody } from "../../convex/lib/normalizeBody";
import type { Post, Project } from "../data/portfolioContent";
import {
  gameProjects as staticGameProjects,
  posts as staticPosts,
  webProjects as staticWebProjects,
} from "../data/portfolioContent";
import { hasConvex } from "../lib/convexClient";

function docToProject(d: Doc<"projects">): Project {
  return {
    id: d.id,
    title: d.title,
    year: d.year,
    kind: d.kind,
    role: d.role,
    desc: d.desc,
    tags: d.tags,
    accent: d.accent,
    thumb: d.thumb,
    live: d.live,
    repo: d.repo,
    itch: d.itch,
    media: d.media,
    body: normalizeBody(d.body as string | string[]),
    shots: d.shots,
  };
}

function docToPost(d: Doc<"posts">): Post {
  return {
    id: d.id,
    date: d.date,
    title: d.title,
    excerpt: d.excerpt,
    read: d.read,
    tag: d.tag,
    thumb: d.thumb,
    body: normalizeBody(d.body as string | string[]),
  };
}

function unionById<T extends { id: string }>(remote: T[], local: T[]): T[] {
  const seen = new Set(remote.map((item) => item.id));
  return [...remote, ...local.filter((item) => !seen.has(item.id))];
}

/**
 * Loads posts and projects from Convex when PUBLIC_CONVEX_URL is set.
 * Static repo content fills any ids Convex does not have yet.
 */
export function usePortfolioContent(): {
  webProjects: Project[];
  gameProjects: Project[];
  posts: Post[];
  fromConvex: boolean;
} {
  const useRemote = hasConvex();
  const allProjects = useQuery(api.projects.listProjects, useRemote ? {} : "skip");
  const remotePosts = useQuery(api.posts.listPosts, useRemote ? {} : "skip");

  if (!useRemote) {
    return {
      webProjects: staticWebProjects,
      gameProjects: staticGameProjects,
      posts: staticPosts,
      fromConvex: false,
    };
  }

  if (allProjects === undefined || remotePosts === undefined) {
    return {
      webProjects: [],
      gameProjects: [],
      posts: [],
      fromConvex: false,
    };
  }

  const webProjects = unionById(
    allProjects.filter((p) => p.kind === "web").map(docToProject),
    staticWebProjects,
  );
  const gameProjects = unionById(
    allProjects.filter((p) => p.kind === "game").map(docToProject),
    staticGameProjects,
  );
  const posts = unionById(remotePosts.map(docToPost), staticPosts).sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
  );

  return { webProjects, gameProjects, posts, fromConvex: true };
}
