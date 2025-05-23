"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, X } from "lucide-react";
import { Oswald } from "next/font/google";

const oswald = Oswald({ subsets: ["latin"] });

const posts = [
  {
    title: "10 Proposal Mistakes Contractors Make (And How to Avoid Them)",
    date: "June 1, 2025",
    author: "Simple ProjeX Team",
    excerpt:
      "Discover the most common pitfalls in construction proposals and learn actionable tips to win more bids with clarity and professionalism.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    tags: ["Proposals", "Best Practices"],
    readTime: "6 min read",
    content: (
      <div>
        <p>
          In the competitive world of construction, a well-crafted proposal can
          be the difference between winning and losing a project. However, many
          contractors fall into common traps that can undermine their chances of
          success. Here are ten mistakes to avoid:
        </p>
        <ol className="list-decimal pl-6">
          <li>Neglecting to tailor your proposal to the client’s needs.</li>
          <li>Using jargon or technical language that confuses clients.</li>
          <li>Failing to provide clear pricing and payment terms.</li>
          <li>Ignoring the importance of visuals in your proposal.</li>
          <li>Not including testimonials or case studies from past clients.</li>
          <li>Overlooking the need for a professional layout and design.</li>
          <li>Rushing through the proposal without proofreading.</li>
          <li>Not addressing potential risks or challenges upfront.</li>
          <li>Failing to follow up after submitting your proposal.</li>
          <li>Not using digital tools to streamline the proposal process.</li>
        </ol>
        <p className="mt-4">
          By avoiding these pitfalls, you can create proposals that not only
          stand out but also resonate with your clients, increasing your chances
          of winning more projects.
        </p>
      </div>
    ),
  },
  {
    title: "How to Use Templates to Speed Up Your Project Bids",
    date: "May 28, 2025",
    author: "Simple ProjeX Admin",
    excerpt:
      "Templates save time and ensure consistency. See how Simple ProjeX templates help you create winning bids in minutes, not hours.",
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    tags: ["Templates", "Efficiency"],
    readTime: "5 min read",
    content: (
      <div>
        <p>
          In the fast-paced world of construction, time is money. Using
          templates can significantly speed up your project bidding process.
          Here’s how:
        </p>
        <ul className="list-disc pl-6">
          <li>
            <strong>Consistency:</strong> Templates ensure that all your bids
            follow a consistent format, making it easier for clients to review.
          </li>
          <li>
            <strong>Speed:</strong> With pre-defined sections, you can fill in
            the details quickly, reducing the time spent on each bid.
          </li>
          <li>
            <strong>Customization:</strong> Templates can be easily customized
            to fit specific projects or client needs.
          </li>
        </ul>
        <p className="mt-4">
          By leveraging templates, you can focus more on the quality of your
          proposals and less on formatting, ultimately winning more projects.
        </p>
      </div>
    ),
  },
  {
    title: "Digital Contracts: The Future of Construction Agreements",
    date: "May 22, 2025",
    author: "Simple ProjeX Admin",
    excerpt:
      "Say goodbye to paperwork. Learn how digital contracts streamline approvals, reduce errors, and keep your projects moving.",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
    tags: ["Contracts", "Digital Transformation"],
    readTime: "7 min read",
    content: (
      <div>
        <p>
          In an era where efficiency and speed are paramount, digital contracts
          are revolutionizing the construction industry. Gone are the days of
          cumbersome paperwork and lengthy approval processes. With digital
          contracts, you can:
        </p>
        <ul className="list-disc pl-6">
          <li>Streamline the approval process with e-signatures.</li>
          <li>Reduce errors and miscommunication.</li>
          <li>Access contracts from anywhere, anytime.</li>
          <li>Store all documents securely in the cloud.</li>
        </ul>
        <p className="mt-4">
          Embracing digital contracts not only saves time but also enhances
          professionalism, making it easier to manage projects and maintain
          client relationships.
        </p>
      </div>
    ),
  },
  {
    title: "Winning More Projects: Secrets from Top Contractors",
    date: "May 18, 2025",
    author: "Simple ProjeX Team",
    excerpt:
      "We interviewed successful contractors to uncover their strategies for winning more projects and building lasting client relationships.",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    tags: ["Success", "Projects"],
    readTime: "8 min read",
    content: (
      <div>
        <p>
          We spoke with some of the most successful contractors in the industry
          to learn their secrets for winning more projects. Here are their top
          tips:
        </p>
        <ul className="list-disc pl-6">
          <li>Build strong relationships with clients.</li>
          <li>Be transparent about pricing and timelines.</li>
          <li>Utilize technology to streamline processes.</li>
          <li>Always follow up after submitting a proposal.</li>
        </ul>
        <p className="mt-4">
          By implementing these strategies, you can enhance your chances of
          winning more projects and building a successful contracting business.
        </p>
      </div>
    ),
  },
  {
    title: "From Estimate to E-Signature: The Simple ProjeX Workflow",
    date: "May 12, 2025",
    author: "Simple ProjeX Admin",
    excerpt:
      "Walk through a typical project lifecycle in Simple ProjeX—from fast, accurate estimates to client-ready proposals and secure digital signatures.",
    image:
      "https://simpleprojexbucket.s3.us-west-1.amazonaws.com/static/landing/blog4.png",
    tags: ["Workflow", "How-To"],
    readTime: "8 min read",
    content: (
      <div>
        <p>
          Simple ProjeX streamlines the entire project lifecycle, making it
          easier for contractors to manage their work. Here’s a typical
          workflow:
        </p>
        <ol className="list-decimal pl-6">
          <li>Create accurate estimates quickly.</li>
          <li>Customize proposals with industry-specific templates.</li>
          <li>Send proposals for client review and approval.</li>
          <li>Collect digital signatures securely.</li>
        </ol>
        <p className="mt-4">
          This streamlined process not only saves time but also enhances
          professionalism, helping you win more projects.
        </p>
      </div>
    ),
  },
  {
    title: "Why Industry-Specific Templates Matter for Your Business",
    date: "May 7, 2025",
    author: "Simple ProjeX Team",
    excerpt:
      "Generic proposals don’t cut it. Learn how our tailored templates for electrical, plumbing, and ADU builders help you stand out and win more bids.",
    image:
      "https://simpleprojexbucket.s3.us-west-1.amazonaws.com/static/landing/blog3.jpg",
    tags: ["Templates", "Best Practices"],
    readTime: "6 min read",
    content: (
      <div>
        <p>
          In a competitive market, generic proposals can hurt your chances of
          winning projects. Industry-specific templates are designed to meet the
          unique needs of different trades, such as electrical, plumbing, and
          ADU builders. Here’s why they matter:
        </p>
        <ul className="list-disc pl-6">
          <li>They save time by providing a solid foundation.</li>
          <li>They ensure compliance with industry standards.</li>
          <li>They enhance professionalism and credibility.</li>
        </ul>
        <p className="mt-4">
          By using tailored templates, you can create proposals that resonate
          with clients and increase your chances of winning more bids.
        </p>
      </div>
    ),
  },
  {
    title: "How Simple ProjeX Is Revolutionizing Construction Proposals",
    date: "May 2, 2025",
    author: "Simple ProjeX Team",
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
    author: "Simple ProjeX Admin",
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
    title: "Managing Multiple Projects: Tips for Staying Organized",
    date: "April 18, 2025",
    author: "Simple ProjeX Admin",
    excerpt:
      "Juggling several jobs? Learn how to keep your projects on track with digital tools and smart workflows.",
    image:
      "https://images.unsplash.com/photo-1468421870903-4df1664ac249?auto=format&fit=crop&w=800&q=80",
    tags: ["Project Management", "Organization"],
    readTime: "7 min read",
    content: (
      <div>
        <p>
          Managing multiple projects can be challenging, but with the right
          tools and strategies, you can stay organized and on track. Here are
          some tips:
        </p>
        <ul className="list-disc pl-6">
          <li>Use digital tools to manage tasks and deadlines.</li>
          <li>Prioritize tasks based on urgency and importance.</li>
          <li>Communicate regularly with your team and clients.</li>
          <li>Set clear expectations for each project.</li>
        </ul>
        <p className="mt-4">
          By implementing these strategies, you can effectively manage multiple
          projects and ensure their success.
        </p>
      </div>
    ),
  },
];

export default function AllBlogs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex !== null) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [openIndex]);

  return (
    <section className="relative overflow-hidden w-full bg-gradient-to-b from-white to-orange-50 py-16 px-2">
      {/* Decorative blobs */}
      <div className="absolute top-[-6rem] left-[-8rem] w-[32rem] h-[32rem] rounded-full bg-orange-400/20 blur-3xl z-0"></div>
      <div className="absolute bottom-[-8rem] right-[-6rem] w-[28rem] h-[28rem] rounded-full bg-primary/20 blur-3xl z-0"></div>
      <div className="absolute top-1/2 left-1/2 w-[18rem] h-[18rem] rounded-full bg-yellow-300/10 blur-2xl z-0 -translate-x-1/2 -translate-y-1/2"></div>

      {/* Header */}
      <div className="relative z-10 max-w-3xl mx-auto text-center mb-12 px-4">
        <div
          className={`${oswald.className} inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-4`}
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
          All Blogs
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "hsl(0, 85%, 30%)" }}
          ></span>
        </div>
        <h1
          className={`${oswald.className} text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 uppercase`}
          style={{ color: "hsl(20, 10%, 15%)" }}
        >
          Simple ProjeX{" "}
          <span style={{ color: "hsl(0, 85%, 30%)" }}>Blog Library</span>
        </h1>
        <div className="flex justify-center items-center mb-6">
          <div
            className="h-0.5 w-12"
            style={{ backgroundColor: "hsl(40, 100%, 50%)" }}
          ></div>
          <div
            className="h-3 w-3 mx-2 transform rotate-45"
            style={{ backgroundColor: "hsl(40, 100%, 50%)" }}
          ></div>
          <div
            className="h-0.5 w-12"
            style={{ backgroundColor: "hsl(40, 100%, 50%)" }}
          ></div>
        </div>
        <p
          className="text-lg sm:text-xl"
          style={{ color: "hsl(20, 10%, 40%)" }}
        >
          Explore expert tips, industry news, and actionable guides for
          contractors, builders, and project managers.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="relative z-10 container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <motion.div
              key={idx}
              className="group bg-white border border-gray-100 rounded-2xl shadow hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
            >
              <div className="relative h-48 overflow-hidden rounded-t-2xl">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                  {post.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-primary/80 text-white border border-primary/30 rounded-full px-3 py-1 text-xs shadow"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between p-5">
                <div>
                  <div className="flex items-center gap-2 text-xs mb-2 text-primary">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm line-clamp-2 mb-2 text-gray-900">
                    {post.excerpt}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-900 font-semibold">
                    {post.author}
                  </span>
                </div>
              </div>
              <div className="flex justify-end px-5 pb-5">
                <button
                  className="inline-flex items-center text-primary hover:underline font-medium group"
                  onClick={() => setOpenIndex(idx)}
                >
                  Read More
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Blog Modal */}
      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenIndex(null)}
          >
            <motion.div
              className="bg-white max-w-2xl w-full rounded-2xl shadow-xl p-0 relative flex flex-col"
              initial={{ scale: 0.95, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 40 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fixed X button */}
              <button
                className="fixed md:absolute top-6 right-6 z-20 text-gray-500 hover:text-primary bg-white/80 rounded-full p-2 shadow"
                style={{ backdropFilter: "blur(4px)" }}
                onClick={() => setOpenIndex(null)}
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
              {/* Scrollable content */}
              <div className="overflow-y-auto max-h-[80vh] p-8 pt-16">
                <img
                  src={posts[openIndex!].image}
                  alt={posts[openIndex!].title}
                  className="w-full h-56 object-cover rounded-xl mb-6"
                />
                <div className="mb-2 flex flex-wrap gap-2">
                  {posts[openIndex!].tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-primary/80 text-white border border-primary/30 rounded-full px-3 py-1 text-xs shadow"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mb-2 text-xs text-primary flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{posts[openIndex!].readTime}</span>
                  <span>•</span>
                  <span>{posts[openIndex!].date}</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {posts[openIndex!].title}
                </h2>
                <div className="mb-4 text-sm text-gray-700 font-semibold">
                  By {posts[openIndex!].author}
                </div>
                <div className="prose max-w-none">
                  {posts[openIndex!].content}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
