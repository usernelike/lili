import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ParticleBackground from '../components/ParticleBackground/ParticleBackground'
import HorizontalScroll from '../components/HorizontalScroll/HorizontalScroll'
import HeroSection from '../sections/HeroSection'
import DataSourcesSection from '../sections/DataSourcesSection'
import FinancialPreviewSection from '../sections/FinancialPreviewSection'
import EnterprisePreviewSection from '../sections/EnterprisePreviewSection'
import TechStackSection from '../sections/TechStackSection'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  useEffect(() => {
    // Refresh ScrollTrigger after all content is loaded
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    return () => {
      clearTimeout(timeout)
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <ParticleBackground />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <HorizontalScroll>
          <HeroSection />
          <DataSourcesSection />
          <FinancialPreviewSection />
          <EnterprisePreviewSection />
          <TechStackSection />
        </HorizontalScroll>
      </div>
    </div>
  )
}
