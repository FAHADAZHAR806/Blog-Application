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
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class:
            "rounded-xl shadow-lg border border-gray-200 my-4 max-w-full h-auto",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline font-semibold cursor-pointer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Start writing your masterpiece...",
        // Yeh line ensure karti hai ke placeholder har empty node pe dikhe
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: content,
    // CRITICAL FIX: Hydration mismatch se bachne ke liye
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[500px] p-8 border border-t-0 border-gray-200 rounded-b-2xl max-w-none cursor-text bg-white prose-img:mx-auto prose-headings:font-black",
      },
    },
  });

  const handleWrapperClick = () => {
    if (editor && !editor.isFocused) {
      editor.chain().focus().run();
    }
  };

  return (
    <div className="w-full flex flex-col shadow-sm rounded-2xl overflow-hidden border border-gray-200">
      <Toolbar editor={editor} />

      <div className="bg-white overflow-y-auto" onClick={handleWrapperClick}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
