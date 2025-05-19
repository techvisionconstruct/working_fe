import React from 'react'
import { BentoGrid } from './bento-grid/bento-grid'
import { BentoCard } from './bento-grid/bento-card'
import { Badge, Button } from '@/components/shared'
import { FileCheck, PenTool, FileText, Settings, ArrowRight } from 'lucide-react'

export default function FeatureSection() {
  return (
    <section className="w-full">
      <div className="container max-w-7xl mx-auto">
        <div className="grid gap-4 lg:grid-cols-2 items-center">
          <div>
            <BentoGrid className="auto-rows-[16rem]">
              <BentoCard 
                name="Smart Templates"
                className="md:col-span-2"
                background={
                  <div className="absolute inset-0 bg-card/50 backdrop-blur-sm">
                    <div className="absolute right-6 bottom-6 opacity-10">
                      <FileCheck className="w-20 h-20" />
                    </div>
                  </div>
                }
                Icon={FileCheck}
                description="Pre-built, industry-ready templates for proposals and contracts — just plug in your job details and go."
                href="#"
                cta="Learn more"
              />
              
              <BentoCard 
                name="E-Signature Ready"
                className="md:col-span-1"
                background={
                  <div className="absolute inset-0 bg-card/50 backdrop-blur-sm">
                    <div className="absolute right-4 bottom-4 opacity-10">
                      <PenTool className="w-20 h-20" />
                    </div>
                  </div>
                }
                Icon={PenTool}
                description=" Send and sign contracts directly — no extra tools."
                href="#"
                cta="Learn more"
              />
              
              <BentoCard 
                name="Easy Sharing"
                className="md:col-span-1"
                background={
                  <div className="absolute inset-0 bg-card/50 backdrop-blur-sm">
                    <div className="absolute right-4 bottom-4 opacity-10">
                      <FileText className="w-20 h-20" />
                    </div>
                  </div>
                }
                Icon={FileText}
                description="Share via link or download in a tap."
                href="#"
                cta="Learn more"
              />
              
              <BentoCard 
                name="Trade-Specific Elements"
                className="md:col-span-2"
                background={
                  <div className="absolute inset-0 bg-card/50 backdrop-blur-sm">
                    <div className="absolute right-6 bottom-6 opacity-10">
                      <Settings className="w-20 h-20" />
                    </div>
                  </div>
                }
                Icon={Settings}
                description="Add job-specific categories and items — materials, labor, timelines — all tailored for construction, electrical, and more."
                href="#"
                cta="Learn more"
              />
            </BentoGrid>
          </div>
          
          {/* Right Column - Content */}
          <div className="flex flex-col justify-center space-y-6 ml-4">
            <div className="space-y-2">
              <Badge variant="outline" className="rounded-full mb-1 w-fit py-1 px-3 text-sm">Features</Badge>
              <h2 className="text-4xl lg:text-6xl tracking-tighter">No Fluff. Just Tools.</h2>
              <p className="max-w-[500px] text-muted-foreground md:text-lg">
                Simple, powerful tools designed specifically for construction professionals. Stop wasting time with complicated software and start getting more done.
              </p>
            </div>
            <div>
              <Button asChild className="py-4 px-6 rounded-xl">
                <a href="/features">
                  <div className="text-base font-light">Learn More</div>
                  <ArrowRight className="!w-4 !h-4" strokeWidth={1.5} />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
