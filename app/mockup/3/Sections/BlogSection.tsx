
'use client';
import React, { useState} from "react";
import { useEffect } from "react";
import { Lightbulb, ChevronLeft, ChevronRight, Clock, ArrowRight } from "lucide-react";
import { Badge, Button } from "@/components/shared";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shared";
import { useTheme } from "next-themes";
import { PopupModal } from "react-calendly";

const posts = [
  {
    title: "The Future of Construction Project Management in 2025",
    date: "May 13, 2025",
    author: {
      name: "Simple ProjeX Admin",
      role: "Platform Team",
      avatar: "/icons/logo.svg",
    },
    excerpt:
      "Discover how AI-powered templates and real-time collaboration are transforming how construction professionals manage projects, with productivity gains of up to 40% reported by early adopters.",
    image: "/template/template1.jpg",
    tags: ["AI", "Industry Trends"],
    readTime: "6 min read",
    link: "#",
  },
  {
    title: "How to Cut Estimation Time in Half While Improving Accuracy",
    date: "May 7, 2025",
    author: {
      name: "Simple ProjeX Admin",
      role: "Platform Team",
      avatar: "/icons/logo.svg",
    },
    excerpt:
      "Learn the proven strategies that top contractors are using to create faster, more accurate estimates. We break down the exact workflow that saved one company over 20 hours per week on paperwork.",
    image: "/template/template2.jpg",
    tags: ["Productivity", "Case Study"],
    readTime: "8 min read",
    link: "#",
  },
  {
    title:
      "Specialized Templates: The Secret Weapon for Electrical Contractors",
    date: "April 28, 2025",
    author: {
      name: "Simple ProjeX Admin",
      role: "Platform Team",
      avatar: "/icons/logo.svg",
    },
    excerpt:
      "Electrical contractors face unique documentation challenges. Discover how trade-specific templates with built-in code compliance checks are helping electricians win more bids with less effort.",
    image: "/competitive.jpg",
    tags: ["Electrical", "Templates"],
    readTime: "5 min read",
    link: "#",
  },
  {
    title: "Client Communication Masterclass: From Proposal to Final Payment",
    date: "April 20, 2025",
    author: {
      name: "Simple ProjeX Admin",
      role: "Platform Team",
      avatar: "/icons/logo.svg",
    },
    excerpt:
      "The way you communicate with clients can make or break your projects. This comprehensive guide shows you exactly how to structure your client communications for maximum clarity and satisfaction.",
    image: "/contractors.png",
    tags: ["Client Relations", "Best Practices"],
    readTime: "10 min read",
    link: "#",
  },
];

const BlogSection = () => {
  const { theme } = useTheme ? useTheme() : { theme: "light" };
  const [current, setCurrent] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const [calendlyUrl, setCalendlyUrl] = useState("");
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_CALENDLY_URL;
    if (url) {
      setCalendlyUrl(url);
    }
  }, []);

  const prevPost = () =>
    setCurrent((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  const nextPost = () =>
    setCurrent((prev) => (prev === posts.length - 1 ? 0 : prev + 1));

  return (
    <div>
      <section
        id="blog"
        className={`p-4 py-24 relative overflow-hidden ${
          theme === "dark" ? "bg-[#191919] text-white" : "bg-white text-black"
        }`}
      >
        {/* Abstract background elements */}
        <div
          className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${
            theme === "dark" ? "bg-red-900/20" : "bg-red-900/10"
          }`}
        ></div>
        <div
          className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${
            theme === "dark" ? "bg-red-900/10" : "bg-red-900/5"
          }`}
        ></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <Badge
                variant="outline"
                className={`mb-4 font-medium ${
                  theme === "dark"
                    ? "text-red-400 border-red-900/30"
                    : "text-red-400 border-red-900/30"
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 mr-1.5" />
                <span>INDUSTRY INSIGHTS</span>
              </Badge>

              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                Latest from our <span className="text-red-500">Experts</span>
              </h2>

              <p
                className={`text-lg max-w-2xl ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Practical advice and insights to help you stay ahead in the
                rapidly evolving world of project management.
              </p>
            </div>

            <div className="flex items-center gap-2 mt-6 md:mt-0">
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full ${
                  theme === "dark"
                    ? "border-gray-700 text-gray-400 hover:text-white hover:bg-red-900 hover:border-red-900"
                    : "border-gray-800 text-gray-400 hover:text-white hover:bg-red-900 hover:border-red-900"
                }`}
                onClick={prevPost}
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Previous post</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full ${
                  theme === "dark"
                    ? "border-gray-700 text-gray-400 hover:text-white hover:bg-red-900 hover:border-red-900"
                    : "border-gray-800 text-gray-400 hover:text-white hover:bg-red-900 hover:border-red-900"
                }`}
                onClick={nextPost}
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Next post</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Featured Post */}
            <Card
              className={`overflow-hidden hover:border-red-900/50 transition-all duration-300 group ${
                theme === "dark"
                  ? "bg-gradient-to-br from-[#23272e] to-[#191919] border-gray-700 text-white"
                  : "bg-gradient-to-br from-gray-200 to-white border-gray-800 text-black"
              }`}
            >
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <img
                  src={posts[current].image || "/placeholder.svg"}
                  alt={posts[current].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 z-20">
                  <Badge className="bg-red-600/90 hover:bg-red-700 text-white border-none">
                    Featured
                  </Badge>
                </div>
              </div>

              <CardHeader className="relative z-20 -mt-14 pb-0">
                <div className="flex flex-wrap gap-2 mb-3">
                  {posts[current].tags.map((tag, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className={`backdrop-blur-sm ${
                        theme === "dark"
                          ? "bg-black/50 text-white border-gray-700"
                          : "bg-black/50 text-white border-gray-700"
                      }`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <CardTitle
                  className={`text-2xl md:text-3xl font-bold group-hover:text-red-400 transition-colors ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {posts[current].title}
                </CardTitle>

                <div
                  className={`flex items-center gap-2 text-sm mt-3 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span>{posts[current].readTime}</span>
                  <span
                    className={`w-1 h-1 rounded-full ${
                      theme === "dark" ? "bg-gray-500" : "bg-gray-800"
                    }`}
                  ></span>
                  <span>{posts[current].date}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                <p
                  className={`mb-6 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  {posts[current].excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={posts[current].author.avatar || "/icons/logo.svg"}
                      />
                      <AvatarFallback
                        className={`bg-red-900 ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        {posts[current].author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        {posts[current].author.name}
                      </div>
                      <div
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-300" : "text-gray-800"
                        }`}
                      >
                        {posts[current].author.role}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    className="text-red-400 gap-1 group/btn hover:underline"
                    asChild
                  >
                    <a href={posts[current].link}>
                      <span>Read Article</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Post List */}
            <div className="space-y-6">
              {posts
                .filter((_, i) => i !== current)
                .slice(0, 3)
                .map((post, idx) => (
                  <Card
                    key={idx}
                    className={`overflow-hidden hover:border-red-900/50 transition-all duration-300 group flex ${
                      theme === "dark"
                        ? "bg-gradient-to-br from-[#23272e] to-[#191919] border-gray-700 text-white"
                        : "bg-gradient-to-br from-gray-200 to-white border-gray-800 text-black"
                    }`}
                  >
                    <div className="w-1/3 relative overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80"></div>
                    </div>

                    <div className="w-2/3 p-4">
                      <div
                        className={`flex items-center gap-2 text-xs mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-800"
                        }`}
                      >
                        <Badge
                          variant="outline"
                          className={`bg-transparent text-red-400 border-red-900/30 text-xs px-2 py-0`}
                        >
                          {post.tags[0]}
                        </Badge>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>

                      <h3
                        className={`text-lg font-bold mb-2 line-clamp-2 group-hover:text-red-400 transition-colors ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        {post.title}
                      </h3>

                      <p
                        className={`text-sm line-clamp-2 mb-3 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage
                              src={post.author.avatar || "/icons/logo.svg"}
                            />
                            <AvatarFallback
                              className={`bg-red-900 text-xs ${
                                theme === "dark" ? "text-white" : "text-black"
                              }`}
                            >
                              {post.author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span
                            className={`text-xs ${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-900"
                            }`}
                          >
                            {post.author.name}
                          </span>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-transparent p-0 h-auto"
                          asChild
                        >
                          <a href={post.link}>
                            <ArrowRight className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

              <div className="flex justify-center mt-8">
                <Button
                  className={`border text-red-400 hover:bg-red-900 hover:text-white ${
                    theme === "dark"
                      ? "bg-transparent border-red-900/50"
                      : "bg-transparent border-red-900/50"
                  }`}
                  asChild
                >
                  <a href="#">
                    <span>View All Blogs</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          {/* <div
          className={`mt-20 border rounded-xl p-8 relative overflow-hidden shadow-sm ${
            theme === "dark"
              ? "bg-gradient-to-r from-[#23272e] via-[#191919] to-[#23272e] border-gray-700"
              : "bg-gradient-to-r from-white via-gray-50 to-white border-gray-200"
          }`}
        >
          <div
            className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none ${
              theme === "dark" ? "bg-red-900/20" : "bg-red-100"
            }`}
          ></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
              <h3
                className={`text-2xl font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Stay ahead of the curve
              </h3>
              <p
                className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
              >
                Get the latest industry insights, tips, and exclusive content
                delivered straight to your inbox.
              </p>
            </div>

            <form className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 placeholder-gray-400"
                style={{
                  background: theme === "dark" ? "#23272e" : "#fff",
                  borderColor: "#e11d48",
                  color: theme === "dark" ? "#fff" : "#191919",
                }}
              />
              <Button
                className="bg-red-600 hover:bg-red-700 text-white whitespace-nowrap shadow-md"
                onClick={() => setIsCalendlyOpen(true)}
              >
                Get Started Now!
              </Button>
            </form>
          </div>
        </div> */}
        </div>

        {/* Calendly Popup */}
        {hasMounted && calendlyUrl && (
          <PopupModal
            url={calendlyUrl}
            onModalClose={() => setIsCalendlyOpen(false)}
            open={isCalendlyOpen}
            rootElement={
              typeof window !== "undefined"
                ? document.body
                : (document.body as HTMLElement)
            }
          />
        )}
      </section>
    </div>
  );
}

export default BlogSection;
