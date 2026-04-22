import { usePortfolioContent } from "../../hooks/usePortfolioContent";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import PortfolioApp from "./PortfolioApp";
import type { ContactFormInput } from "./Contact";

export default function PortfolioWithConvexData(props: { initialPage?: string }) {
  const { webProjects, gameProjects, posts } = usePortfolioContent();
  const submitContact = useMutation(api.contacts.submitContact);
  const resumePdf = useQuery(api.assets.getResumePdf, {});

  const onSubmitContact = async (input: ContactFormInput) => {
    await submitContact({
      name: input.name,
      email: input.email,
      kind: input.kind,
      body: input.body,
    });
  };

  return (
    <PortfolioApp
      initialPage={props.initialPage}
      webProjects={webProjects}
      gameProjects={gameProjects}
      posts={posts}
      onSubmitContact={onSubmitContact}
      resumePdfUrl={resumePdf?.url ?? null}
      resumePdfFilename={resumePdf?.filename ?? "resume.pdf"}
    />
  );
}
