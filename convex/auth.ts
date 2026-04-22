import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile: (params) => {
        if (params.flow === "signUp") {
          throw new Error("Sign up is disabled.");
        }
        const email = params.email;
        if (typeof email !== "string" || !email.trim()) {
          throw new Error("Missing email");
        }
        return { email: email.trim() };
      },
    }),
  ],
});
