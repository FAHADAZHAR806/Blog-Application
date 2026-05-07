# 🌟 Lumina Feed | The Art of Digital Storytelling

![Next.js](https://img.shields.io/badge/Next.js-15%2F16-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)

Lumina Feed is a high-performance, professional blogging platform designed for modern thinkers. Built with a **Wix-inspired flat design philosophy**, it offers a seamless experience for authors and readers alike.

---

## 🚀 Key Features

- **Next.js 16 (Turbopack):** Lightning-fast development and optimized production builds.
- **Advanced Auth System:** Secure Login/Register and a robust **Token-based Password Reset** mechanism.
- **Role-Based Access (RBAC):** Tailored dashboards for **Admin**, **Author**, and **Reader**.
- **Modern UI Components:** Custom-built Navbar, Footer, and Page transitions using **Tailwind CSS 4**.
- **Media Management:** Integrated with **Cloudinary** for professional image hosting.
- **SEO Ready:** Optimized metadata and clean semantic HTML for better search engine indexing.
- **Performance First:** Font optimization using `next/font` and layout stability with React Suspense.

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4 (Custom Config)
- **Icons:** Lucide React
- **Fonts:** Poppins (Google Fonts)

### Backend & Database

- **Server:** Next.js Serverless Functions
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Security:** Bcrypt.js, SHA-256 Crypto Tokens

---

## 📂 Project Structure

```text
blog-platform/
├── src/
│   ├── app/                # App Router (Pages, Layouts, APIs)
│   │   ├── api/            # Serverless API Endpoints
│   │   ├── (auth)/         # Authentication Routes
│   │   └── layout.tsx      # Root Layout with Footer/Navbar
│   ├── components/
│   │   └── ui/             # Reusable UI components
│   ├── models/             # Mongoose Schemas (User, Post)
│   ├── lib/                # Database and Auth Utilities
│   └── styles/             # Global CSS & Tailwind Config
├── public/                 # Static assets & Images
├── next.config.mjs         # Next.js Configuration
└── README.md               # Project Documentation
```
