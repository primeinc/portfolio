import React from 'react'
import HeroSectionVideoIntro from '../components/HeroSectionVideoIntro'
import DreamsTracker from '../components/DreamsTracker'
import InvestingSection from '../components/InvestingSection'
import CurrentWorkSection from '../components/CurrentWorkSection'
import Footer from '../components/Footer'

const Home: React.FC = () => {
  return (
    <div className="homePage">
      <HeroSectionVideoIntro />
      <DreamsTracker />
      <InvestingSection />
      <CurrentWorkSection />
      <Footer />
    </div>
  )
}

export default Home
