import { api } from "../../convex/_generated/api";
import { getConvexPublicUrl } from "../lib/convexPublicUrl";
import {
  ConvexProvider,
  ConvexReactClient,
  useMutation,
} from "convex/react";
import { useMemo, useState } from "react";

function SubscribeFormInner() {
  const subscribe = useMutation(api.subscribers.subscribe);
  const [message, setMessage] = useState<string | null>(null);
  const [messageKind, setMessageKind] = useState<"ok" | "err" | null>(null);
  const [pending, setPending] = useState(false);
  const [joined, setJoined] = useState(false);

  return (
    <form
      className="flex flex-col gap-4 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const email = (new FormData(form).get("email") as string)?.trim();
        if (!email) return;

        setPending(true);
        setMessage(null);
        setMessageKind(null);

        void subscribe({ email })
          .then((res) => {
            if (res.alreadySubscribed) {
              setMessage("You're already on the list!");
            } else {
              setMessage("You're on the list! Talk soon.");
            }
            setMessageKind("ok");
            setJoined(true);
            form.reset();
            setTimeout(() => {
              setJoined(false);
              setMessage(null);
              setMessageKind(null);
            }, 5000);
          })
          .catch((err: Error) => {
            setMessage(err.message || "Failed to join. Try again.");
            setMessageKind("err");
          })
          .finally(() => setPending(false));
      }}
    >
      <div className="relative group">
        <input
          className="w-full h-14 px-4 bg-off-white-paper border-b-2 border-border-color focus:border-terracotta focus:ring-0 text-text-dark placeholder-text-light outline-none transition-colors rounded-t-md"
          placeholder="Enter your email address..."
          required
          type="email"
          name="email"
          disabled={pending}
        />
      </div>
      <button
        className="h-14 px-6 bg-terracotta hover:bg-terracotta/90 text-white font-quirky font-bold text-lg tracking-wide rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-md shadow-terracotta/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        type="submit"
        disabled={pending}
      >
        <span>{pending ? "Joining..." : joined ? "Joined!" : "Get Notified"}</span>
        <span className="material-symbols-outlined">
          {joined ? "check" : "arrow_forward"}
        </span>
      </button>
      {message ? (
        <p
          className={
            messageKind === "ok"
              ? "text-sm font-quirky text-center mt-2 text-terracotta font-bold"
              : "text-sm font-quirky text-center mt-2 text-red-500"
          }
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

export default function SubscribeIsland() {
  const url = getConvexPublicUrl();
  const client = useMemo(
    () => (url ? new ConvexReactClient(url) : null),
    [url],
  );

  if (!client) {
    return (
      <p className="text-sm font-quirky text-center text-red-600">
        Waitlist is not configured (set{" "}
        <code className="text-xs">PUBLIC_CONVEX_URL</code> in{" "}
        <code className="text-xs">.env.local</code>, then restart dev).
      </p>
    );
  }

  return (
    <ConvexProvider client={client}>
      <SubscribeFormInner />
    </ConvexProvider>
  );
}
