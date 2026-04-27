"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Quote,
  Undo,
  Redo,
} from "lucide-react";

interface ToolbarProps {
  editor: Editor | null;
}

export const Toolbar = ({ editor }: ToolbarProps) => {
  if (!editor) return null;

  // Helper to toggle styles and keep UI active state in sync
  const options = [
    {
      icon: <Heading2 size={18} />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading"),
    },
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
      icon: <List size={18} />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
    },
    {
      icon: <Quote size={18} />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive("blockquote"),
    },
  ];

  return (
    <div className="border border-gray-200 bg-gray-50 p-2 rounded-t-md flex flex-wrap gap-2">
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={(e) => {
            e.preventDefault();
            opt.onClick();
          }}
          className={`p-2 rounded hover:bg-gray-200 ${opt.active ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
};
