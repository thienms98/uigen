import Image from "next/image";

{/*R_IMPORT_START*/}
          import FeatureSection2 from '@/components/FeatureSection2'
          import PricingSection3 from '@/components/PricingSection3'
          import Testimonials3 from '@/components/Testimonials3'
          import Testimonials2 from '@/components/Testimonials2'
          {/*R_IMPORT_END*/}

export default function Home() {
  return <>

{/*R_CONTENT_START*/}
          <FeatureSection2 />
          <PricingSection3 />
          <Testimonials3 />
          <Testimonials2 />
          {/*R_CONTENT_END*/}
    
    </>;
}
