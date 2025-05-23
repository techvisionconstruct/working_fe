
import React from 'react';
import { Oswald } from 'next/font/google';
import { motion } from 'framer-motion';
import { Button } from '@/components/shared';
import { Play, CheckCircle } from 'lucide-react';


const CTASection = () => {
  // No additional state or handlers needed from page.tsx for this CTA section
  return (
    <div>
             {/* REDESIGNED: Call to action with modern 3D elements and updated colors */}
        <section className="py-32 relative overflow-hidden" style={{ backgroundColor: "hsl(0, 85%, 30%)" }}>
          {/* 3D geometric shapes for visual interest */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute -top-20 -right-20 w-80 h-80 rounded-full"
              animate={{
                y: [0, -20, 0],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{ backgroundColor: "hsl(0, 0%, 100%)" }}
            />
            <motion.div 
              className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full"
              animate={{
                y: [0, 20, 0],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1
              }}
              style={{ backgroundColor: "hsl(0, 0%, 100%)" }}
            />
            
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
          </div>
          
          <div className="container px-4 mx-auto relative z-10 max-w-5xl">
            <motion.div 
              className="bg-white/10 backdrop-blur-lg p-1 rounded-full inline-block mx-auto mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white/10 backdrop-blur-lg px-6 py-1.5 rounded-full text-white text-sm font-medium">
                Ready to get started?
              </div>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-6xl font-bold text-white text-center max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Transform Your Proposal Process Today
            </motion.h2>
            
            <motion.p 
              className="text-xl text-white/80 text-center max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Join thousands of construction professionals who are winning more projects with Simple ProjeX
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size="lg"
                className="rounded-xl py-6 px-8 bg-white text-primary hover:bg-white/90 text-lg w-full shadow-lg shadow-white/10"
              >
                Schedule a Demo
              </Button>
              <Button
                size="lg"
                className="rounded-xl py-6 px-8 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-lg w-full"
              >
                <Play className="h-5 w-5 mr-2" /> Watch Demo
              </Button>
            </motion.div>
            
            <motion.div 
              className="mt-16 flex items-center justify-center gap-8 flex-wrap"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <p className="text-white/60 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> No credit card required
              </p>
              <p className="text-white/60 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> 14-day free trial
              </p>
              <p className="text-white/60 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> Cancel anytime
              </p>
            </motion.div>
          </div>
        </section>
    </div>
  )
}

export default CTASection
