import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMobile } from '../../hooks/useMobile'

gsap.registerPlugin(ScrollTrigger)

interface HorizontalScrollProps {
  children: ReactNode
}

export default function HorizontalScroll({ children }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  useEffect(() => {
    if (isMobile) return
    const container = containerRef.current
    const scrollContainer = scrollRef.current
    if (!container || !scrollContainer) return

    const totalWidth = scrollContainer.scrollWidth - window.innerWidth

    // Store the animation in a ref-like variable for cleanup
    let tween: gsap.core.Tween | null = null

    const sections = scrollContainer.children
    const numSections = sections.length
    const snapStep = 1 / (numSections - 1)

    const ctx = gsap.context(() => {
      tween = gsap.to(scrollContainer, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1.5,
          end: () => `+=${totalWidth}`,
          invalidateOnRefresh: true,
          snap: {
            snapTo: (progress: number) => {
              const target = Math.round(progress / snapStep) * snapStep
              return Math.max(0, Math.min(1, target))
            },
            duration: { min: 0.15, max: 0.4 },
            delay: 0,
            ease: 'power2.out',
          },
        },
      })
    })

    return () => {
      if (tween) {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
      ctx.revert()
    }
  }, [isMobile])

  if (isMobile) {
    return <div style={{ display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' }}>{children}</div>
  }

  return (
    <div ref={containerRef} style={{ overflow: 'hidden' }}>
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          width: 'max-content',
          height: '100vh',
        }}
      >
        {children}
      </div>
    </div>
  )
}
