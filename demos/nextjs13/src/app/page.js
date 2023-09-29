'use client'

import Image from "next/image";

{/*R_IMPORT_START*/}
          import HeroSection2 from '@/components/HeroSection2'
          import HeroSection4 from '@/components/HeroSection4'
          import PricingSection8 from '@/components/PricingSection8'
          import Testimonials6 from '@/components/Testimonials6'
          import BlogSection6 from '@/components/BlogSection6'
          {/*R_IMPORT_END*/}

export default function Home() {
  return <>

{/*R_CONTENT_START*/}
          <HeroSection2 />
          <HeroSection4 />
          <PricingSection8 />
          <Testimonials6 />
          <BlogSection6 />
          {/*R_CONTENT_END*/}
    
    </>;
}
