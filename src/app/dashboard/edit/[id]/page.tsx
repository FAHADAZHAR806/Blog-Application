"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

export default function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    coverImage: "",
  });
  const [loading, setLoading] = useState(true);

  // 1. Purana data load karein
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/${id}`);
        const json = await res.json();

        // Console mein check karein ke data aa bhi raha hai ya nahi
        console.log("Fetched Data:", json);

        if (json.success && json.data) {
          setFormData({
            title: json.data.title || "",
            content: json.data.content || "",
            coverImage: json.data.coverImage || "",
          });
        }
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);
  // 2. Update function
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/post/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Post Updated!");
      router.push("/dashboard/my-posts");
    } else {
      alert("Update failed");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Post...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-black mb-6">Edit Your Story</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          className="w-full p-4 border-2 rounded-2xl text-xl font-bold"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Post Title"
        />
        <textarea
          className="w-full p-4 border-2 rounded-2xl h-64"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          placeholder="Write your story..."
        />
        <button className="bg-primary text-white px-8 py-3 rounded-full font-bold">
          Save Changes
        </button>
      </form>
    </div>
  );
}
