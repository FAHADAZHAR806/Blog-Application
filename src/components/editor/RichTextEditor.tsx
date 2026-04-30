"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Toolbar } from "./Toolbar";

interface Props {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Heading levels define kar sakte hain
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      // Image support with sizing classes
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class:
            "rounded-xl shadow-lg border border-gray-200 my-4 max-w-full h-auto",
        },
      }),
      // Professional link handling
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline font-semibold cursor-pointer",
        },
      }),
      // Text alignment (Left, Center, Right)
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Start writing your masterpiece...",
      }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // 'prose-img:mx-auto' images ko center karne ke liye hai
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[500px] p-8 border border-t-0 border-gray-200 rounded-b-2xl max-w-none cursor-text bg-white prose-img:mx-auto prose-headings:font-black",
      },
    },
  });

  // Agar user niche khali jagah pe click kare to editor focus ho jaye
  const handleWrapperClick = () => {
    if (editor && !editor.isFocused) {
      editor.chain().focus().run();
    }
  };

  return (
    <div className="w-full flex flex-col shadow-sm rounded-2xl overflow-hidden border border-gray-200">
      {/* Toolbar will now have access to image and align functions */}
      <Toolbar editor={editor} />

      <div
        className="bg-white overflow-y-auto scrollbar-hide"
        onClick={handleWrapperClick}
      >
        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}
