import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { normalizeBody } from "../../convex/lib/normalizeBody";
import type { Post, Project } from "../data/portfolioContent";
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

/**
 * Loads posts and projects from Convex when PUBLIC_CONVEX_URL is set.
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

  if (!useRemote || allProjects === undefined || remotePosts === undefined) {
    return {
      webProjects: [],
      gameProjects: [],
      posts: [],
      fromConvex: false,
    };
  }

  const webProjects = allProjects.filter((p) => p.kind === "web").map(docToProject);
  const gameProjects = allProjects.filter((p) => p.kind === "game").map(docToProject);
  const posts = remotePosts.map(docToPost);

  return { webProjects, gameProjects, posts, fromConvex: true };
}
