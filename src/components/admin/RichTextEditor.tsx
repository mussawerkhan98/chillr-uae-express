import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useEffect, useState } from "react";
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link2, Image as ImageIcon, Quote, Undo2, Redo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadMedia } from "@/lib/upload";
import { toast } from "sonner";

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
        Image.configure({ HTMLAttributes: { class: "rounded-lg my-4 max-w-full h-auto" } }),
      ],
      content: value || "<p></p>",
      onUpdate: ({ editor }) => onChange(editor.getHTML()),
      editorProps: {
        attributes: {
          class:
            "prose prose-slate max-w-none min-h-[400px] p-4 focus:outline-none prose-headings:font-display prose-headings:text-navy prose-a:text-primary",
        },
      },
      immediatelyRender: false,
    },
    [mounted],
  );

  if (!mounted || !editor) {
    return <div className="min-h-[440px] rounded-lg border border-input bg-card animate-pulse" />;
  }

  async function handleImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        toast.loading("Uploading image...", { id: "img" });
        const url = await uploadMedia(file, "blog/inline");
        editor?.chain().focus().setImage({ src: url, alt: file.name }).run();
        toast.success("Image inserted", { id: "img" });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload failed", { id: "img" });
      }
    };
    input.click();
  }

  function handleLink() {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  const btn = (active: boolean) =>
    `h-8 w-8 p-0 ${active ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`;

  return (
    <div className="rounded-lg border border-input bg-card overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-2">
        <Button type="button" size="sm" variant="ghost" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></Button>
        <Button type="button" size="sm" variant="ghost" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button type="button" size="sm" variant="ghost" className={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></Button>
        <Button type="button" size="sm" variant="ghost" className={btn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button type="button" size="sm" variant="ghost" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></Button>
        <Button type="button" size="sm" variant="ghost" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></Button>
        <Button type="button" size="sm" variant="ghost" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button type="button" size="sm" variant="ghost" className={btn(editor.isActive("link"))} onClick={handleLink}><Link2 className="h-4 w-4" /></Button>
        <Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={handleImage}><ImageIcon className="h-4 w-4" /></Button>
        <div className="ml-auto flex gap-1">
          <Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => editor.chain().focus().undo().run()}><Undo2 className="h-4 w-4" /></Button>
          <Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => editor.chain().focus().redo().run()}><Redo2 className="h-4 w-4" /></Button>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
