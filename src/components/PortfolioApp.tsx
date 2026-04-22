import type { ComponentProps } from "react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { convexClient, hasConvex } from "../lib/convexClient";
import PortfolioShell from "./portfolio/PortfolioApp";
import PortfolioWithConvexData from "./portfolio/PortfolioWithConvexData";

export default function PortfolioApp(props: ComponentProps<typeof PortfolioShell>) {
  if (hasConvex() && convexClient) {
    return (
      <ConvexAuthProvider client={convexClient}>
        <PortfolioWithConvexData initialPage={props.initialPage} />
      </ConvexAuthProvider>
    );
  }
  return <PortfolioShell {...props} />;
}
