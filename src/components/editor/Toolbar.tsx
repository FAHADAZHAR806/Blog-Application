"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Code,
  Image as ImageIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Strikethrough,
  Highlighter,
} from "lucide-react";

interface Props {
  editor: Editor | null;
}

export function Toolbar({ editor }: Props) {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Enter Image URL (Cloudinary/Unsplash):");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const options = [
    {
      icon: <Bold size={16} />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
      group: "text",
    },
    {
      icon: <Italic size={16} />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
      group: "text",
    },
    {
      icon: <Underline size={16} />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      active: editor.isActive("underline"),
      group: "text",
    },
    {
      icon: <Strikethrough size={16} />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      active: editor.isActive("strike"),
      group: "text",
    },
    {
      icon: <Heading1 size={16} />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive("heading", { level: 1 }),
      group: "format",
    },
    {
      icon: <Heading2 size={16} />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
      group: "format",
    },
    {
      icon: <List size={16} />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
      group: "list",
    },
    {
      icon: <ListOrdered size={16} />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
      group: "list",
    },
    {
      icon: <Quote size={16} />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive("blockquote"),
      group: "extra",
    },
    {
      icon: <AlignCenter size={16} />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      active: editor.isActive({ textAlign: "center" }),
      group: "align",
    },
    {
      icon: <LinkIcon size={16} />,
      onClick: setLink,
      active: editor.isActive("link"),
      group: "media",
    },
    {
      icon: <ImageIcon size={16} />,
      onClick: addImage,
      active: false,
      group: "media",
    },
    {
      icon: <Code size={16} />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      active: editor.isActive("codeBlock"),
      group: "extra",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-3 md:px-10">
      <div className="flex flex-wrap items-center gap-1 bg-white/50 p-1.5 rounded-2xl border border-zinc-100">
        {options.map((item, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              item.onClick();
            }}
            title={item.group}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              item.active
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            {item.icon}
          </button>
        ))}

        <div className="w-[1px] h-6 bg-zinc-200 mx-2 hidden sm:block" />

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().undo().run();
            }}
            className="p-2.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 rounded-xl transition-all"
          >
            <Undo size={16} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().redo().run();
            }}
            className="p-2.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 rounded-xl transition-all"
          >
            <Redo size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
