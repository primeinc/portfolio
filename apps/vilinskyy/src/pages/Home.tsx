import React from 'react'
import HeroSectionVideoIntro from '../components/HeroSectionVideoIntro'
import DetailedProjectListings from '../components/DetailedProjectListings'
import TestimonialSlider from '../components/TestimonialSlider'
import NewsletterForm from '../components/NewsletterForm'
import MultiColumnLayout from '../components/MultiColumnLayout'
import SocialMediaLinks from '../components/SocialMediaLinks'

const Home: React.FC = () => {
  const productivityColumns = [
    {
      title: 'Tools & Systems',
      items: [
        'Notion for project management',
        'Figma for all design work',
        'Linear for task tracking',
        'Loom for async communication',
        'Raycast for productivity shortcuts',
      ],
    },
    {
      title: 'Daily Habits',
      items: [
        'Morning deep work blocks',
        'Time-boxed email checking',
        'Walking meetings',
        'Evening reflection',
        'Weekly reviews',
      ],
    },
  ]

  const achievementsColumns = [
    {
      title: 'Design Leadership',
      items: [
        'Led design at 3 unicorn startups',
        'Built design systems from scratch',
        'Managed teams of 10+ designers',
        'Shipped products to millions',
      ],
    },
    {
      title: 'Entrepreneurship',
      items: [
        'Founded Super Clear studio',
        'Built and sold Unicorn Platform',
        'Created multiple profitable courses',
        'Angel invested in 5 startups',
      ],
    },
    {
      title: 'Recognition',
      items: [
        'UK Exceptional Talent visa',
        'Featured in TechCrunch',
        'Product Hunt #1 launches',
        'Speaker at design conferences',
      ],
    },
  ]

  return (
    <div className="homePage">
      <HeroSectionVideoIntro />
      <DetailedProjectListings />
      <TestimonialSlider />
      
      <section className="section">
        <div className="container">
          <MultiColumnLayout
            title="My Productivity Stack"
            columns={productivityColumns}
            variant="default"
          />
        </div>
      </section>
      
      <section className="section">
        <div className="container">
          <MultiColumnLayout
            title="Notable Achievements"
            columns={achievementsColumns}
            variant="default"
          />
        </div>
      </section>
      
      <NewsletterForm />
      
      <footer className="section text-center">
        <div className="container">
          <SocialMediaLinks variant="default" />
          <p className="mt-3" style={{ color: 'var(--color-text-tertiary)' }}>
            © {new Date().getFullYear()} Alexander Vilinskyy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home