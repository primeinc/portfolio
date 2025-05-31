import HeroSectionBoldTypography from './features/hero-section-bold-typography/HeroSectionBoldTypography'
import ProjectShowcaseGrid from './features/project-showcase-grid-list/ProjectShowcaseGrid'
import AboutMeSection from './features/embedded-about-me-section/AboutMeSection'
import ScrollAppearEffect from './features/subtle-scroll-animations-appear/ScrollAppearEffect'
import ContactCTA from './features/contact-call-to-action/ContactCTA'
import ResponsiveLayoutWrapper from './features/responsive-layout-wrapper/ResponsiveLayoutWrapper'

function App() {
  return (
    <ResponsiveLayoutWrapper>
      <HeroSectionBoldTypography />
      <ScrollAppearEffect>
        <ProjectShowcaseGrid />
      </ScrollAppearEffect>
      <ScrollAppearEffect>
        <AboutMeSection />
      </ScrollAppearEffect>
      <ContactCTA />
    </ResponsiveLayoutWrapper>
  )
}

export default App
