import React from 'react'
import HeroHeader from '../components/HeroHeader'
import HeroLogos from '../components/HeroLogos'
import HeroVideo from '../components/HeroVideo'
import HeroNewsletter from '../components/HeroNewsletter'
import TestimonialsWork from '../components/TestimonialsWork'
import DreamsTracker from '../components/DreamsTracker'
import WorkProjectsSection from '../components/WorkProjectsSection'
import Footer from '../components/Footer'

const Home: React.FC = () => {
  return (
    <div className="homePage">
      <HeroHeader />
      <HeroLogos />
      <HeroVideo />
      <HeroNewsletter />
      <TestimonialsWork />
      <DreamsTracker />
      <WorkProjectsSection />
      <Footer />
    </div>
  )
}

export default Home
