import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useConvex, useMutation } from "convex/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { bodyToHtmlForEditor, editorHtmlToStorageBody } from "../../lib/portfolioBody";

type BodyValue = string[] | string | undefined;

export function AdminRichBodyEditor({
  idPrefix,
  body,
  onChange,
  label = "Body",
  hint,
}: {
  idPrefix: string;
  body: BodyValue;
  onChange: (next: string[] | string) => void;
  label?: string;
  hint?: string;
}) {
  const convex = useConvex();
  const generateBodyImageUploadUrl = useMutation(api.assets.generateBodyImageUploadUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const initialHtml = bodyToHtmlForEditor(body);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        // StarterKit v3 includes Link; we register Link separately with app-specific options.
        link: false,
      }),
      Placeholder.configure({
        placeholder: "Write the full article or project story here…",
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Image.configure({ inline: false, allowBase64: false }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        class: "admin-rich-editor-content",
        id: `${idPrefix}-rich-body`,
        spellCheck: "true",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(editorHtmlToStorageBody(ed.getHTML()));
    },
  });

  useEffect(() => {
    if (!editor) return;
    const next = bodyToHtmlForEditor(body);
    const cur = editor.getHTML();
    if (next === cur) return;
    editor.commands.setContent(next, { emitUpdate: false });
  }, [body, editor]);

  const pickImage = useCallback(() => {
    setUploadError(null);
    fileInputRef.current?.click();
  }, []);

  const onImageFile = useCallback(
    async (file: File | undefined) => {
      if (!file || !editor) return;
      if (!file.type.startsWith("image/")) {
        setUploadError("Choose an image file (PNG, JPEG, GIF, WebP, …).");
        return;
      }
      setUploading(true);
      setUploadError(null);
      try {
        const uploadUrl = await generateBodyImageUploadUrl({});
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!res.ok) {
          throw new Error("Upload failed.");
        }
        const payload = (await res.json()) as { storageId?: string };
        if (!payload.storageId) {
          throw new Error("No storage id returned.");
        }
        const imageUrl = await convex.query(api.assets.getBodyImageUrl, {
          storageId: payload.storageId as Id<"_storage">,
        });
        if (!imageUrl) {
          throw new Error("Could not resolve image URL.");
        }
        editor.chain().focus().setImage({ src: imageUrl, alt: file.name.replace(/"/g, "") }).run();
        onChange(editorHtmlToStorageBody(editor.getHTML()));
      } catch (e) {
        setUploadError(e instanceof Error ? e.message : String(e));
      } finally {
        setUploading(false);
      }
    },
    [convex, editor, generateBodyImageUploadUrl, onChange],
  );

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const next = window.prompt("Link URL", prev ?? "https://");
    if (next === null) return;
    const trimmed = next.trim();
    if (trimmed === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    const href = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="form-field">
        <label>{label}</label>
        <p className="admin-body-editor-hint">Loading editor…</p>
      </div>
    );
  }

  return (
    <div className="form-field">
      <label htmlFor={`${idPrefix}-rich-body`}>{label}</label>
      {hint ? <p className="admin-body-editor-hint">{hint}</p> : null}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          void onImageFile(f);
        }}
      />
      <div className="admin-rich-editor-wrap">
        <div className="admin-rich-toolbar" role="toolbar" aria-label="Formatting">
          <button
            type="button"
            className={`admin-rich-tool ${editor.isActive("bold") ? "is-active" : ""}`}
            onClick={() => editor.chain().focus().toggleBold().run()}
            aria-pressed={editor.isActive("bold")}
          >
            Bold
          </button>
          <button
            type="button"
            className={`admin-rich-tool ${editor.isActive("italic") ? "is-active" : ""}`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            aria-pressed={editor.isActive("italic")}
          >
            Italic
          </button>
          <button
            type="button"
            className={`admin-rich-tool ${editor.isActive("strike") ? "is-active" : ""}`}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            aria-pressed={editor.isActive("strike")}
          >
            Strike
          </button>
          <span className="admin-rich-toolbar-sep" aria-hidden="true" />
          <button
            type="button"
            className={`admin-rich-tool ${editor.isActive("heading", { level: 2 }) ? "is-active" : ""}`}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </button>
          <button
            type="button"
            className={`admin-rich-tool ${editor.isActive("heading", { level: 3 }) ? "is-active" : ""}`}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            H3
          </button>
          <button
            type="button"
            className={`admin-rich-tool ${editor.isActive("blockquote") ? "is-active" : ""}`}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            Quote
          </button>
          <span className="admin-rich-toolbar-sep" aria-hidden="true" />
          <button
            type="button"
            className={`admin-rich-tool ${editor.isActive("bulletList") ? "is-active" : ""}`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            List
          </button>
          <button
            type="button"
            className={`admin-rich-tool ${editor.isActive("orderedList") ? "is-active" : ""}`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1. List
          </button>
          <span className="admin-rich-toolbar-sep" aria-hidden="true" />
          <button type="button" className="admin-rich-tool" onClick={() => setLink()}>
            Link
          </button>
          <button type="button" className="admin-rich-tool" onClick={pickImage} disabled={uploading}>
            {uploading ? "Uploading…" : "Image"}
          </button>
        </div>
        {uploadError ? (
          <p className="mono" style={{ color: "var(--red)", margin: "0 0 8px", fontSize: 13 }}>
            {uploadError}
          </p>
        ) : null}
        <EditorContent editor={editor} />
      </div>
      <p className="admin-body-meta">Saved as sanitized HTML so bold, links, and images show correctly on the site.</p>
    </div>
  );
}
