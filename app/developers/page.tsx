"use client";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DevelopersPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(78,205,196,0.1),transparent_50%)]" />

      {/* Back Button */}
      <Link
        href="/"
        className="fixed top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white group"
      >
        <ArrowLeft className="w-5 h-5 text-neutral-900 group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="text-sm font-medium text-neutral-900">Home</span>
      </Link>

      <div className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center justify-center gap-8 sm:gap-12"
        >
          {/* Logo */}
          <Logo className="h-24 w-auto sm:h-32 lg:h-40 text-[#4ECDC4]" />

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight text-neutral-900 mb-4">
              Developers
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto">
              Build the future with our comprehensive developer tools and resources.
            </p>
          </motion.div>

          {/* Content Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-12"
          >
            {[
              {
                title: "Documentation",
                description: "Comprehensive guides and API references",
                icon: "📚",
              },
              {
                title: "SDKs & Libraries",
                description: "Ready-to-use development kits for multiple platforms",
                icon: "🛠️",
              },
              {
                title: "Community",
                description: "Join our thriving developer community",
                icon: "👥",
              },
              {
                title: "Code Examples",
                description: "Sample projects and tutorials",
                icon: "💻",
              },
              {
                title: "Developer Portal",
                description: "Manage your projects and API keys",
                icon: "🔐",
              },
              {
                title: "Support",
                description: "Technical support and consultation",
                icon: "💬",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-neutral-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Footer */}
        <div className="mt-24">
          <Footer />
        </div>
      </div>
    </div>
  );
}

