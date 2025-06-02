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
      <div
        style={{
          height: '1px',
          backgroundColor: '#e4e4e4',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      />
      <TestimonialsWork />
      <div
        style={{
          height: '1px',
          backgroundColor: '#e4e4e4',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      />
      <DreamsTracker />
      <div
        style={{
          height: '1px',
          backgroundColor: '#e4e4e4',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      />
      <WorkProjectsSection />
      <Footer />
    </div>
  )
}

export default Home
