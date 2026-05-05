"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect } from "react";
import { Toolbar } from "./Toolbar";

interface Props {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class:
            "rounded-3xl shadow-2xl border border-zinc-100 my-8 max-w-full h-auto mx-auto ring-1 ring-zinc-200",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-blue-600 underline decoration-blue-200 underline-offset-4 font-bold cursor-pointer hover:text-blue-700 transition-colors",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Write your masterpiece here...",
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-zinc-300 before:float-left before:h-0 before:pointer-events-none before:italic",
      }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-zinc focus:outline-none min-h-[600px] p-10 md:p-16 border-t-0 rounded-b-[2.5rem] max-w-none cursor-text bg-white prose-headings:font-black prose-headings:tracking-tighter prose-p:text-zinc-600 prose-p:leading-relaxed prose-strong:text-zinc-900 prose-img:rounded-[2rem]",
      },
    },
  });

  // AI Content Sync: Jab AI content generate karega toh editor update hoga
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleWrapperClick = () => {
    if (editor && !editor.isFocused) {
      editor.chain().focus().run();
    }
  };

  return (
    <div className="w-full flex flex-col bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)]">
      {/* Sticky Toolbar for better UX during long writes */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-zinc-100 py-2">
        <Toolbar editor={editor} />
      </div>

      {/* Editor Content Area */}
      <div
        className="relative min-h-[600px] transition-colors duration-300 group"
        onClick={handleWrapperClick}
      >
        <EditorContent editor={editor} />

        {/* Subtle decorative element at the bottom */}
        <div className="absolute bottom-6 right-10 pointer-events-none">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">
            Lumina Editor <span className="text-blue-500">v2.0</span>
          </p>
        </div>
      </div>
    </div>
  );
}
