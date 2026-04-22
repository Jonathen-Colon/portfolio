import { ConvexReactClient } from "convex/react";

const url = import.meta.env.PUBLIC_CONVEX_URL;

export const convexClient = url ? new ConvexReactClient(url) : null;

export function hasConvex(): boolean {
  return Boolean(url);
}
