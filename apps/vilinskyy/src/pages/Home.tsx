import HeroSectionVideoIntro from '../components/HeroSectionVideoIntro'
import DetailedProjectListings from '../components/DetailedProjectListings'
import TestimonialSlider from '../components/TestimonialSlider'
import NewsletterForm from '../components/NewsletterForm'
import MultiColumnLayout from '../components/MultiColumnLayout'
import SocialMediaLinks from '../components/SocialMediaLinks'

const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.`

export default function Home() {
  return (
    <div>
      <HeroSectionVideoIntro />
      <MultiColumnLayout text={longText} />
      <DetailedProjectListings />
      <TestimonialSlider />
      <NewsletterForm />
      <SocialMediaLinks />
    </div>
  )
}
