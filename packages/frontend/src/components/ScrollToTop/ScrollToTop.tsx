import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Reset scroll position to top
    window.scrollTo(0, 0)

    // Clean up any pinned ScrollTrigger instances from previous pages
    // to prevent scroll hijacking on the new page
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars.pin) {
        trigger.kill()
      }
    })

    // Ensure body overflow is reset
    document.body.style.overflow = ''
  }, [pathname])

  return null
}
