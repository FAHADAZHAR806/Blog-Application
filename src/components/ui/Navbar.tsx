"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PenSquare,
  LayoutDashboard,
  LogOut,
  Compass,
  Menu,
  X,
  ChevronRight,
  User,
  Settings,
  Camera,
  Loader2,
  CheckCircle,
} from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    bio: "",
    profileImage: "",
  });

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setEditData({
        name: parsed.name || "",
        bio: parsed.bio || "",
        profileImage: parsed.profileImage || "",
      });
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/pages/logout");
    setIsOpen(false);
    setShowDropdown(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({ ...editData, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user._id || user.id, ...editData }),
      });
      const json = await res.json();
      if (json.success) {
        localStorage.setItem("user", JSON.stringify(json.data));
        setUser(json.data);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setIsEditModalOpen(false);
        }, 1500);
      }
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="h-16 border-b border-gray-200 bg-white sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Brand Name */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-gray-900"
        >
          Lumina<span className="text-blue-600">.</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-[14px] font-medium text-gray-600 hover:text-black"
          >
            Explore
          </Link>

          {user ? (
            <div className="flex items-center gap-5">
              {(user.role === "author" || user.role === "admin") && (
                <>
                  <Link
                    href="/dashboard/create"
                    className="text-[13px] font-semibold bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-all"
                  >
                    Write
                  </Link>
                  <Link
                    href="/dashboard/my-posts"
                    className="text-[13px] font-semibold bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-all"
                  >
                    My Blogs
                  </Link>
                </>
              )}

              {/* Profile Avatar & Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 pl-4 border-l border-gray-100 group"
                >
                  <div className="text-right">
                    <p className="text-[13px] font-semibold text-gray-900 leading-none group-hover:text-blue-600 transition-colors">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                      {user.role}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[12px] font-bold text-blue-600 overflow-hidden">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-[20px] shadow-2xl p-2 z-[60] animate-in fade-in zoom-in duration-200">
                    <button
                      onClick={() => {
                        setIsEditModalOpen(true);
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-xl text-sm font-bold text-gray-700 transition-all"
                    >
                      <Settings className="w-4 h-4 text-blue-600" />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl text-sm font-bold text-red-600 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/pages/login"
                className="text-[14px] font-medium text-gray-600"
              >
                Login
              </Link>
              <Link
                href="/pages/register"
                className="text-[14px] font-semibold bg-blue-600 text-white px-5 py-2 rounded-md"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* --- EDIT PROFILE MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <header className="mb-8 text-center">
              <h2 className="text-2xl font-black text-gray-900 tracking-tighter">
                Edit <span className="text-blue-600">Profile</span>
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                Update your Lumina identity
              </p>
            </header>

            <div className="space-y-6">
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-[30px] bg-blue-50 border-2 border-dashed border-blue-200 flex items-center justify-center overflow-hidden">
                    {editData.profileImage ? (
                      <img
                        src={editData.profileImage}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-blue-300" />
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 p-3 bg-white border border-gray-100 rounded-2xl shadow-lg text-blue-600 cursor-pointer hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-600 outline-none font-bold transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2 block">
                    Bio
                  </label>
                  <textarea
                    value={editData.bio}
                    onChange={(e) =>
                      setEditData({ ...editData, bio: e.target.value })
                    }
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-600 outline-none font-bold transition-all text-sm min-h-[100px] resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className={`w-full py-5 rounded-[22px] font-black flex items-center justify-center gap-3 transition-all ${
                  success
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-900 text-white hover:bg-blue-600 active:scale-95"
                }`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : success ? (
                  <CheckCircle className="w-5 h-5" />
                ) : null}
                {success
                  ? "Success!"
                  : loading
                    ? "Updating..."
                    : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MOBILE SIDEBAR --- */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 md:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 flex flex-col h-full">
          <button
            onClick={() => setIsOpen(false)}
            className="self-end p-2 mb-4 text-gray-400"
          >
            <X className="w-6 h-6" />
          </button>

          {user && (
            <div className="mb-8 p-4 bg-blue-600 rounded-2xl text-white flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-black text-xl overflow-hidden">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="font-bold leading-tight">{user.name}</p>
                <p className="text-[10px] opacity-70 uppercase font-bold tracking-widest">
                  {user.role}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2 flex-1">
            <MobileLink
              href="/"
              icon={<Compass className="w-5 h-5 text-blue-500" />}
              label="Explore"
              onClick={() => setIsOpen(false)}
            />
            {user && (user.role === "author" || user.role === "admin") && (
              <>
                <MobileLink
                  href="/dashboard/create"
                  icon={<PenSquare className="w-5 h-5 text-emerald-500" />}
                  label="Write Post"
                  onClick={() => setIsOpen(false)}
                />
                <MobileLink
                  href="/dashboard/my-posts"
                  icon={<LayoutDashboard className="w-5 h-5 text-purple-500" />}
                  label="My Blogs"
                  onClick={() => setIsOpen(false)}
                />
                <button
                  onClick={() => {
                    setIsEditModalOpen(true);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-between w-full p-4 hover:bg-gray-50 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <span className="p-2 bg-white rounded-lg shadow-sm border border-gray-50">
                      <Settings className="w-5 h-5 text-blue-600" />
                    </span>
                    <span className="font-bold text-gray-700">
                      Edit Profile
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </button>
              </>
            )}
          </div>

          {user && (
            <button
              onClick={handleLogout}
              className="mt-auto flex items-center justify-between p-4 bg-red-50 text-red-600 rounded-xl font-bold"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5" /> <span>Logout</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-40" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

function MobileLink({ href, icon, label, onClick }: any) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all group"
    >
      <div className="flex items-center gap-4">
        <span className="p-2 bg-white rounded-lg shadow-sm border border-gray-50 group-hover:scale-110 transition-transform">
          {icon}
        </span>
        <span className="font-bold text-gray-700">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300" />
    </Link>
  );
}
