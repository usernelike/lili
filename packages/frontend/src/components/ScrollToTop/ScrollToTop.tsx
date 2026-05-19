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

    // Only reset body overflow if no overlay (mobile menu / modal) is active.
    // Other components may legitimately lock body scroll.
    const isBodyLockedByOther = document.body.dataset.scrollLocked === 'true'
    if (!isBodyLockedByOther) {
      document.body.style.overflow = ''
    }
  }, [pathname])

  return null
}
