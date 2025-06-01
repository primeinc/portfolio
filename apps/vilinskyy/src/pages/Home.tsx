import React from 'react'
import HeroSectionVideoIntro from '../components/HeroSectionVideoIntro'
import TestimonialsWork from '../components/TestimonialsWork'
import DreamsTracker from '../components/DreamsTracker'
import WorkProjectsSection from '../components/WorkProjectsSection'
import Footer from '../components/Footer'

const Home: React.FC = () => {
  return (
    <div className="homePage">
      <HeroSectionVideoIntro />
      <TestimonialsWork />
      <DreamsTracker />
      <WorkProjectsSection />
      <Footer />
    </div>
  )
}

export default Home
