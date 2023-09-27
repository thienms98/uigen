import Image from "next/image";

{/*R_IMPORT_START*/}
          import HeaderSection1 from '@/components/HeaderSection1'
          import NewsletterSection1 from '@/components/NewsletterSection1'
          import Footers1 from '@/components/Footers1'
          {/*R_IMPORT_END*/}

export default function Home() {
  return <>

{/*R_CONTENT_START*/}
          <HeaderSection1 />
          <NewsletterSection1 />
          <Footers1 />
          {/*R_CONTENT_END*/}
    
    </>;
}
