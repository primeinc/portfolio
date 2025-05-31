import React from 'react'
import ExpandableProjectSection from './ExpandableProjectSection'

const projectsData = [
  {
    id: 'decipad',
    summary: {
      title: 'Decipad',
      shortDescription: 'Led company design and communications to explore numbers in narrative.',
      category: 'Data storytelling app',
    },
    detail: {
      longDescription: `At Decipad, I led the design and communications strategy for a revolutionary data storytelling platform. The challenge was to make working with numbers as intuitive as writing text, breaking down the barriers between quantitative analysis and narrative storytelling.

      Key achievements:
      • Designed a unique interface that seamlessly blends calculations with prose
      • Created a visual language that makes complex data relationships understandable
      • Led user research with early adopters from journalism, finance, and education
      • Developed the brand identity and go-to-market strategy
      
      The result was a product that empowers users to create interactive documents where numbers update in real-time, making data-driven storytelling accessible to a broader audience.`,
      images: [],
      role: 'Head of Design',
      duration: '2020-2022',
      link: 'https://decipad.com'
    }
  },
  {
    id: 'grammarly',
    summary: {
      title: 'Grammarly',
      shortDescription: 'Designed core features for the AI-powered writing assistant used by 30M+ people daily.',
      category: 'Writing assistant',
    },
    detail: {
      longDescription: `At Grammarly, I worked on designing features that help millions of people communicate more effectively. My focus was on making AI-powered writing suggestions feel natural and non-intrusive while maintaining the user's voice and intent.

      Key contributions:
      • Redesigned the suggestion card system for better clarity and actionability
      • Created new interaction patterns for tone detection and adjustment
      • Worked on the design system to ensure consistency across platforms
      • Collaborated with ML engineers to improve suggestion relevance
      
      The designs I worked on are now part of the core Grammarly experience, helping users write with confidence across various platforms and contexts.`,
      images: [],
      role: 'Senior Product Designer',
      duration: '2018-2019',
      link: 'https://grammarly.com'
    }
  },
  {
    id: 'spark',
    summary: {
      title: 'Spark',
      shortDescription: 'Reimagined email for teams with a focus on collaboration and productivity.',
      category: 'Email client',
    },
    detail: {
      longDescription: `Spark presented a unique challenge: how to evolve email from a solo activity into a collaborative team tool. I led the design of features that allow teams to discuss emails privately, delegate messages, and create shared inboxes.

      Design highlights:
      • Created the collaborative commenting system for email threads
      • Designed the delegation workflow and team inbox interface
      • Developed visual patterns for distinguishing personal vs team emails
      • Led the design of the onboarding experience for team features
      
      The team features I designed helped Spark differentiate itself in the crowded email client market and attract thousands of business teams.`,
      images: [],
      role: 'Lead Product Designer',
      duration: '2017-2018',
      link: 'https://sparkmailapp.com'
    }
  },
  {
    id: 'unicorn',
    summary: {
      title: 'Unicorn Platform',
      shortDescription: 'Built and sold a website builder for startups that reached $10K MRR.',
      category: 'Website builder',
    },
    detail: {
      longDescription: `Unicorn Platform started as a side project to help startups launch beautiful websites without coding. What began as a weekend project grew into a profitable business that I eventually sold.

      Journey highlights:
      • Designed and developed the entire platform solo
      • Created 50+ website templates optimized for startup use cases
      • Built a component library that balanced flexibility with ease of use
      • Grew to 1000+ paying customers through content marketing
      • Successfully exited the business at $10K MRR
      
      This project taught me invaluable lessons about building, marketing, and scaling a SaaS product independently.`,
      images: [],
      role: 'Founder & Designer',
      duration: '2018-2020',
      link: 'https://unicornplatform.com'
    }
  },
  {
    id: 'porsche-911',
    summary: {
      title: 'Buy a Porsche 911',
      shortDescription: 'Documented my journey of researching and purchasing a dream car.',
      category: 'Personal project',
    },
    detail: {
      longDescription: `This project combined my love for design, cars, and storytelling. I created a comprehensive guide documenting every aspect of buying a Porsche 911, from understanding different models to negotiating with dealers.

      Project components:
      • Designed an interactive model comparison tool
      • Created detailed buying guides for each generation
      • Photographed and reviewed different 911 variants
      • Built a community of enthusiasts around the content
      
      What started as personal research became a resource used by thousands of potential 911 buyers, showing how good design can make complex decisions easier.`,
      images: [],
      role: 'Creator',
      duration: '2021',
      link: '#'
    }
  },
  {
    id: 'figma-ai-plugin',
    summary: {
      title: 'AI & Dev Tools',
      shortDescription: 'Created Figma plugins and AI experiments reaching 10K+ designers.',
      category: 'Tools & plugins',
    },
    detail: {
      longDescription: `I've always been passionate about building tools that enhance designer productivity. This led me to create several Figma plugins and explore AI applications in design workflows.

      Notable projects:
      • Arthropod: AI-powered design critique plugin for Figma
      • Component Sync: Automated design system synchronization
      • Various ChatGPT experiments for design tasks
      • Open-source contributions to design tooling
      
      These experiments helped me understand how AI can augment (not replace) human creativity and informed my approach to integrating new technologies into design processes.`,
      images: [],
      role: 'Creator',
      duration: 'Ongoing',
      link: '#'
    }
  },
  {
    id: 'energy-courses',
    summary: {
      title: 'Energy',
      shortDescription: 'Teaching energy management and productivity through courses and content.',
      category: 'Education',
    },
    detail: {
      longDescription: `After years of optimizing my own productivity, I started teaching others how to manage their energy for peak creative performance. This evolved into courses and content reaching thousands of knowledge workers.

      Course topics:
      • "STEALTH+": Advanced productivity techniques
      • Energy management for creative professionals
      • Building sustainable work habits
      • Designing your environment for focus
      
      The courses combine neuroscience research with practical techniques, helping people work smarter rather than harder.`,
      images: [],
      role: 'Instructor',
      duration: '2022-Present',
      link: '#'
    }
  },
  {
    id: 'real-estate',
    summary: {
      title: 'Real Estate Investments',
      shortDescription: 'Invested in and renovated properties in London, achieving strong returns.',
      category: 'Investment',
    },
    detail: {
      longDescription: `Applied design thinking to real estate investment, focusing on properties with potential for transformation. This venture combined creativity with financial discipline.

      Portfolio highlights:
      • Renovated 3 properties in prime London locations
      • Achieved 20%+ value increase through design improvements
      • Created detailed renovation playbooks
      • Built relationships with contractors and architects
      
      This experience taught me about physical space design, project management at scale, and the intersection of aesthetics and value creation.`,
      images: [],
      role: 'Investor & Designer',
      duration: '2019-Present',
      link: '#'
    }
  },
  {
    id: 'angelfuturism',
    summary: {
      title: 'Angelfuturism',
      shortDescription: 'Explored UK\'s unique position as a leader in science and social innovation.',
      category: 'Research project',
    },
    detail: {
      longDescription: `Angelfuturism is a research project exploring how the UK can leverage its unique strengths in science, technology, and social innovation to build a better future.

      Research areas:
      • UK's advantages in AI, biotech, and green technology
      • Policy recommendations for innovation ecosystems
      • Case studies of successful UK tech companies
      • Vision for UK's role in global innovation
      
      This work connects my interest in technology with broader questions about society, progress, and how design can shape better futures.`,
      images: [],
      role: 'Researcher',
      duration: '2023',
      link: '#'
    }
  },
  {
    id: 'meet-founders',
    summary: {
      title: 'Meet 3000 Founders',
      shortDescription: 'Challenged myself to meet 3000 startup founders in one year.',
      category: 'Networking experiment',
    },
    detail: {
      longDescription: `This ambitious project pushed me to systematically expand my network and understand the startup ecosystem at scale. Meeting 3000 founders taught me patterns in successful entrepreneurship.

      Key learnings:
      • Developed a system for high-quality networking at scale
      • Identified common patterns in successful founders
      • Built lasting relationships leading to collaborations
      • Created content sharing insights from conversations
      
      This experiment transformed how I approach networking and led to numerous design opportunities and partnerships.`,
      images: [],
      role: 'Experimenter',
      duration: '2022',
      link: '#'
    }
  },
  {
    id: 'exceptional-talent',
    summary: {
      title: 'Exceptional Talent Visa',
      shortDescription: 'Successfully obtained UK exceptional talent visa for contributions to design.',
      category: 'Achievement',
    },
    detail: {
      longDescription: `Being recognized as an exceptional talent in digital design by the UK government was a significant milestone. The application process itself became a design challenge.

      Application highlights:
      • Curated a portfolio demonstrating impact across multiple ventures
      • Secured endorsements from industry leaders
      • Documented contributions to the UK tech ecosystem
      • Created a compelling narrative about future contributions
      
      This recognition validates the impact of design-driven innovation and opens new opportunities for contributing to the UK's digital economy.`,
      images: [],
      role: 'Applicant',
      duration: '2021',
      link: '#'
    }
  },
  {
    id: 'media-features',
    summary: {
      title: 'Media & Recognition',
      shortDescription: 'Featured in major publications and recognized for design innovation.',
      category: 'Press & awards',
    },
    detail: {
      longDescription: `My work has been featured in various publications and recognized by the design community, helping spread ideas about design, productivity, and innovation.

      Notable features:
      • TechCrunch: Coverage of Unicorn Platform acquisition
      • Product Hunt: Multiple product launches reaching #1
      • Design conferences: Speaking engagements on design systems
      • Podcast appearances: Discussing design and entrepreneurship
      
      These opportunities allow me to share learnings and contribute to broader conversations about design's role in technology and business.`,
      images: [],
      role: 'Subject',
      duration: 'Ongoing',
      link: '#'
    }
  },
];

const DetailedProjectListings: React.FC = () => {
  return (
    <section className="section">
      <div className="container">
        <h2 className="mb-5">Projects & Work</h2>
        <div>
          {projectsData.map((project) => (
            <ExpandableProjectSection key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default DetailedProjectListings