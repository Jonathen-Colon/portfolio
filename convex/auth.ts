import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

function normalizeEmail(raw: unknown) {
  if (typeof raw !== "string") return "";
  return raw.trim().toLowerCase();
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        const email = normalizeEmail(params.email);
        const flow = params.flow as string | undefined;
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

        if (!email.includes("@")) {
          throw new ConvexError("Invalid email");
        }

        if (flow === "signUp") {
          if (!adminEmail) {
            throw new ConvexError(
              "Set ADMIN_EMAIL in the Convex dashboard (Deployment → Environment Variables), then try again.",
            );
          }
          if (email !== adminEmail) {
            throw new ConvexError(
              "That email does not match ADMIN_EMAIL in your Convex deployment settings.",
            );
          }
        }

        return { email };
      },
    }),
  ],
});
