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
} from "lucide-react";

interface Props {
  editor: Editor | null;
}

export function Toolbar({ editor }: Props) {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt(
      "Enter Image URL (from Cloudinary or elsewhere):",
    );
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
      icon: <Bold size={18} />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
    },
    {
      icon: <Italic size={18} />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
    },
    {
      icon: <Underline size={18} />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      active: editor.isActive("underline"),
    },
    {
      icon: <Strikethrough size={18} />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      active: editor.isActive("strike"),
    },
    {
      icon: <Heading1 size={18} />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 size={18} />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <List size={18} />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered size={18} />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
    },
    {
      icon: <Quote size={18} />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive("blockquote"),
    },
    {
      icon: <AlignLeft size={18} />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      active: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenter size={18} />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      active: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRight size={18} />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      active: editor.isActive({ textAlign: "right" }),
    },
    {
      icon: <LinkIcon size={18} />,
      onClick: setLink,
      active: editor.isActive("link"),
    },
    { icon: <ImageIcon size={18} />, onClick: addImage, active: false },
    {
      icon: <Code size={18} />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      active: editor.isActive("codeBlock"),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
      {options.map((item, index) => (
        <button
          key={index}
          onClick={(e) => {
            e.preventDefault();
            item.onClick();
          }}
          className={`p-2 rounded-md transition-all duration-200 ${
            item.active
              ? "bg-primary text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
          }`}
        >
          {item.icon}
        </button>
      ))}

      <div className="flex items-center gap-1 ml-auto border-l pl-2">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded-md"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded-md"
        >
          <Redo size={18} />
        </button>
      </div>
    </div>
  );
}
