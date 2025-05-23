"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/shared";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shared";
import { motion, AnimatePresence } from "framer-motion";
import { Oswald } from "next/font/google";
import Link from "next/link";

const oswald = Oswald({
  subsets: ["latin"],
});

const posts = [
  {
    title: "How Simple ProjeX Is Revolutionizing Construction Proposals",
    date: "May 20, 2025",
    author: {
      name: "Simple ProjeX Team",
      role: "Simple ProjeX Team",
      avatar: "/icons/logo.svg",
    },
    excerpt:
      "Discover how Simple ProjeX empowers contractors with industry-specific templates, real-time collaboration, and digital signatures—making proposal creation faster, easier, and more professional.",
    image:
      "https://simpleprojexbucket.s3.us-west-1.amazonaws.com/static/landing/blog1.jpg",
    tags: ["Product Update", "Features"],
    readTime: "5 min read",
    content: (
      <>
        <h2 className="text-2xl font-bold mb-4">
          How Simple ProjeX Is Revolutionizing Construction Proposals
        </h2>
        <p>
          In the fast-paced world of construction, time is money. Simple ProjeX
          is designed to help contractors and builders create professional
          proposals in minutes, not hours. With industry-specific templates,
          real-time collaboration, and digital signatures, you can streamline
          your workflow and impress your clients.
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>
            Industry-specific templates for electrical, plumbing, ADU, and more
          </li>
          <li>Real-time collaboration with your team and clients</li>
          <li>Secure digital signatures for faster approvals</li>
        </ul>
        <p>
          Join thousands of professionals who have transformed their proposal
          process with Simple ProjeX!
        </p>
      </>
    ),
  },
  {
    title: "Customer Success: 3 Ways Our Users Win More Projects",
    date: "May 14, 2025",
    author: {
      name: "Simple ProjeX Admin",
      role: "Customer Success",
      avatar: "/icons/logo.svg",
    },
    excerpt:
      "See how real contractors are saving hours each week, improving win rates, and impressing clients with Simple ProjeX. Read their stories and learn how you can do the same.",
    image:
      "https://simpleprojexbucket.s3.us-west-1.amazonaws.com/static/landing/blog2.jpg",
    tags: ["Case Study", "Success"],
    readTime: "7 min read",
    content: (
      <>
        <h2 className="text-2xl font-bold mb-4">
          Customer Success: 3 Ways Our Users Win More Projects
        </h2>
        <ol className="list-decimal pl-6 my-4">
          <li>
            <b>Faster Proposals:</b> Automated templates cut proposal creation
            time by 60%.
          </li>
          <li>
            <b>Higher Win Rates:</b> Professional, branded proposals help users
            stand out.
          </li>
          <li>
            <b>Client Satisfaction:</b> Real-time updates and e-signatures keep
            clients happy and informed.
          </li>
        </ol>
        <p>
          Read more stories from our community and see how you can achieve
          similar results!
        </p>
      </>
    ),
  },
  {
    title: "Why Industry-Specific Templates Matter for Your Business",
    date: "May 7, 2025",
    author: {
      name: "Simple ProjeX Team",
      role: "Platform Insights",
      avatar: "/icons/logo.svg",
    },
    excerpt:
      "Generic proposals don’t cut it. Learn how our tailored templates for electrical, plumbing, and ADU builders help you stand out and win more bids.",
    image:
      "https://simpleprojexbucket.s3.us-west-1.amazonaws.com/static/landing/blog3.jpg",
    tags: ["Templates", "Best Practices"],
    readTime: "6 min read",
    content: (
      <>
        <h2 className="text-2xl font-bold mb-4">
          Why Industry-Specific Templates Matter for Your Business
        </h2>
        <p>
          Every trade is different. That's why Simple ProjeX offers templates
          tailored to your specialty—whether you're an electrician, plumber, or
          ADU builder.
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>Meet industry standards and compliance</li>
          <li>Highlight your expertise</li>
          <li>Win more bids with targeted proposals</li>
        </ul>
        <p>
          Upgrade your business with templates that speak your clients'
          language.
        </p>
      </>
    ),
  },
  {
    title: "From Estimate to E-Signature: The Simple ProjeX Workflow",
    date: "April 28, 2025",
    author: {
      name: "Simple ProjeX Admin",
      role: "Product Team",
      avatar: "/icons/logo.svg",
    },
    excerpt:
      "Walk through a typical project lifecycle in Simple ProjeX—from fast, accurate estimates to client-ready proposals and secure digital signatures—all in one place.",
    image:
      "https://simpleprojexbucket.s3.us-west-1.amazonaws.com/static/landing/blog4.png",
    tags: ["Workflow", "How-To"],
    readTime: "8 min read",
    content: (
      <>
        <h2 className="text-2xl font-bold mb-4">
          From Estimate to E-Signature: The Simple ProjeX Workflow
        </h2>
        <ol className="list-decimal pl-6 my-4">
          <li>
            <b>Estimate:</b> Use our cost estimation tools for fast, accurate
            quotes.
          </li>
          <li>
            <b>Proposal:</b> Customize industry-specific templates for your
            client.
          </li>
          <li>
            <b>E-Signature:</b> Get client approval instantly with secure
            digital signatures.
          </li>
        </ol>
        <p>Experience a seamless workflow from start to finish!</p>
      </>
    ),
  },
];

const BlogSection = () => {
  const [current, setCurrent] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const [openBlogIndex, setOpenBlogIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openBlogIndex !== null) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [openBlogIndex]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const prevPost = () =>
    setCurrent((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  const nextPost = () =>
    setCurrent((prev) => (prev === posts.length - 1 ? 0 : prev + 1));

  return (
    <div>
      <section
        id="Blog"
        className="relative overflow-hidden p-4 py-32"
        style={{
          background:
            "linear-gradient(to bottom, hsl(0, 0%, 100%), hsl(20, 10%, 96%))",
        }}
      >

       

        <div className="container mx-auto max-w-6xl relative z-10">
          {/* Section Header */}
          <motion.div
            className="mb-12 sm:mb-16 md:mb-20 text-center max-w-3xl mx-auto px-4 sm:px-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div
              className={`${oswald.className} inline-flex items-center gap-2 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium mb-3 sm:mb-4`}
              style={{
                backgroundColor: "hsla(0, 85%, 30%, 0.1)",
                color: "hsl(0, 85%, 30%)",
                border: "1px dashed hsl(0, 85%, 30%)",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "hsl(0, 85%, 30%)" }}
              ></span>
              Blog
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "hsl(0, 85%, 30%)" }}
              ></span>
            </div>
            <h2
              className={`${oswald.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6 uppercase leading-tight`}
              style={{ color: "hsl(20, 10%, 15%)" }}
            >
              INDUSTRY{" "}
              <span style={{ color: "hsl(0, 85%, 30%)" }}>INSIGHTS</span>
            </h2>
            <div className="flex justify-center items-center mb-4 sm:mb-6">
              <div
                className="h-0.5 w-8 sm:w-12 md:w-16"
                style={{ backgroundColor: "hsl(40, 100%, 50%)" }}
              ></div>
              <div
                className="h-2 w-2 sm:h-3 sm:w-3 mx-2 transform rotate-45"
                style={{ backgroundColor: "hsl(40, 100%, 50%)" }}
              ></div>
              <div
                className="h-0.5 w-8 sm:w-12 md:w-16"
                style={{ backgroundColor: "hsl(40, 100%, 50%)" }}
              ></div>
            </div>
            <p
              className="text-base sm:text-lg md:text-xl leading-relaxed"
              style={{ color: "hsl(20, 10%, 40%)" }}
            >
              Practical advice and insights to help you stay ahead in the
              rapidly evolving world of project management.
            </p>
          </motion.div>

          {/* Blog Carousel Controls */}
          <div className="flex items-center gap-2 justify-center mb-12">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-red-600 text-red-600 hover:text-white hover:bg-red-700 hover:border-red-700 shadow-lg"
              onClick={prevPost}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous post</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-red-600 text-red-600 hover:text-white hover:bg-red-700 hover:border-red-700 shadow-lg"
              onClick={nextPost}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next post</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Featured Post */}
            <motion.div
              className="overflow-hidden group bg-gradient-to-br from-white via-gray-100 to-gray-500 border-2 border-black rounded-3xl shadow-2xl hover:shadow-black/30 transition-all duration-300 cursor-pointer relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onClick={() => setOpenBlogIndex(current)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={posts[current].image || "/placeholder.svg"}
                  alt={posts[current].title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  style={{ filter: "brightness(0.93) saturate(1.1)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <div className="absolute top-4 right-4 z-20">
                  <span className="bg-red-700 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg border border-white/30">
                    Featured
                  </span>
                </div>
              </div>
              <div className="relative z-20 -mt-14 pb-0 px-8 pt-8">
                <div className="flex flex-wrap gap-2 mb-3">
                  {posts[current].tags.map((tag, i) => (
                    <span
                      key={i}
                      className="backdrop-blur-sm bg-red-700 text-white border border-red-800 rounded-full px-3 py-1 text-xs shadow"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold group-hover:text-black transition-colors text-black">
                  {posts[current].title}
                </h3>
                <div className="flex items-center gap-2 text-sm mt-3 text-black">
                  <Clock className="h-3.5 w-3.5 text-black" />
                  <span>{posts[current].readTime}</span>
                  <span className="w-1 h-1 rounded-full bg-black"></span>
                  <span>{posts[current].date}</span>
                </div>
                <p className="mb-3 mt-4 text-gray-800">
                  {posts[current].excerpt}
                </p>
                <div className="flex flex-col md:p-3 sm:flex-row sm:items-center gap-3 sm:gap-4 w-full">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={
                          posts[current].author.avatar ||
                          "/icons/logo-white.png"
                        }
                      />
                      <AvatarFallback className="bg-black text-white">
                        {posts[current].author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col px-0 py-2 sm:p-0 items-start text-left">
                      <div className="font-semibold text-black">
                        {posts[current].author.name}
                      </div>
                      <div className="text-xs text-gray-700">
                        {posts[current].author.role}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-black gap-1 group/btn hover:underline sm:mt-0 w-full sm:w-auto"
                    onClick={() => setOpenBlogIndex(current)}
                  >
                    <span>Read Article</span>
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Post List */}
            <div className="space-y-6">
              {posts
                .filter((_, i) => i !== current)
                .slice(0, 3)
                .map((post, idx) => (
                  <motion.div
                    key={idx}
                    className="overflow-hidden group flex bg-gradient-to-br from-white via-gray-100 to-black border border-black rounded-2xl shadow hover:shadow-black/40 transition-all duration-300 cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * idx }}
                    onClick={() =>
                      setOpenBlogIndex(idx >= current ? idx + 1 : idx)
                    }
                  >
                    <div className="w-1/3 relative overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-700"
                        style={{ filter: "brightness(0.9) saturate(1.2)" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80"></div>
                    </div>
                    <div className="w-2/3 p-4">
                      <div className="flex items-center gap-2 text-xs mb-2">
                        <span className="bg-red-700 text-white border border-red-800 rounded-full px-2 py-0">
                          {post.tags[0]}
                        </span>
                        <span>•</span>
                        <span className="text-black">{post.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-black transition-colors text-black">
                        {post.title}
                      </h3>
                      <p className="text-sm line-clamp-2 mb-3 text-gray-800">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage
                              src={post.author.avatar || "/icons/logo.svg"}
                            />
                            <AvatarFallback className="bg-black text-xs text-white">
                              {post.author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-black">
                            {post.author.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

              <div className="flex justify-center mt-8">
                <Button
                  className="border text-black hover:bg-black hover:text-white bg-transparent border-black"
                  asChild
                >
                  <Link href="/mockup/3/Sections/Dedicated-Pages/all-blogs">
                    <span>View All Blogs</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Modal */}
        <AnimatePresence>
          {openBlogIndex !== null && (
            <motion.div
              className="fixed p-4 md:p-0 inset-0 z-50 flex items-center justify-center bg-black/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              tabIndex={-1}
              onKeyDown={(e) => {
                if (e.key === "Escape") setOpenBlogIndex(null);
              }}
            >
              <motion.div
                className="relative w-full max-w-2xl p-6 bg-white rounded-xl shadow-xl overflow-y-auto max-h-[90vh]"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
              >
                {/* Improved Close Button */}
                <button
                  className="fixed z-50 flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-primary/90 hover:text-white text-gray-700 text-2xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={() => setOpenBlogIndex(null)}
                  aria-label="Close blog post"
                  tabIndex={0}
                  style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    width={28}
                    height={28}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-7 h-7"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <div className="mb-6">
                  <img
                    src={posts[openBlogIndex].image}
                    alt={posts[openBlogIndex].title}
                    className="w-full rounded-lg mb-4"
                  />
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src={posts[openBlogIndex].author.avatar} />
                      <AvatarFallback>
                        {posts[openBlogIndex].author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {posts[openBlogIndex].author.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {posts[openBlogIndex].author.role}
                      </div>
                    </div>
                    <span className="ml-4 text-gray-400">
                      {posts[openBlogIndex].date}
                    </span>
                  </div>
                </div>
                <article className="prose max-w-none">
                  {posts[openBlogIndex].content}
                </article>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default BlogSection;
