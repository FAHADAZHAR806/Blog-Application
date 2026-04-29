"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Toolbar } from "./Toolbar";

interface Props {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your story here...",
      }),
    ],
    content: content,
    // FIX 1: This prevents the editor from "freezing" during Next.js hydration
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // Added 'cursor-text' to show the user they can type here
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[400px] p-6 border border-t-0 border-surface-variant rounded-b-md-3 max-w-none cursor-text",
      },
    },
  });

  return (
    <div className="w-full">
      <Toolbar editor={editor} />
      {/* FIX 2: We wrap the content in a div that forces focus if the user clicks the empty space */}
      <div className="bg-surface" onClick={() => editor?.chain().focus().run()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
