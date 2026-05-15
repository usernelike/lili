import { useState, useEffect, useRef } from 'react'

interface PupilProps {
  size?: number
  maxDistance?: number
  pupilColor?: string
  forceLookX?: number
  forceLookY?: number
}

const Pupil = ({
  size = 12,
  maxDistance = 5,
  pupilColor = 'black',
  forceLookX,
  forceLookY,
}: PupilProps) => {
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const pupilRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setMouseX(e.clientX)
      setMouseY(e.clientY)
    }
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [])

  const pos = (() => {
    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY }
    }
    if (!pupilRef.current) return { x: 0, y: 0 }
    const rect = pupilRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = mouseX - cx
    const dy = mouseY - cy
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance)
    const ang = Math.atan2(dy, dx)
    return { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist }
  })()

  return (
    <div
      ref={pupilRef}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: pupilColor,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  )
}

interface EyeBallProps {
  size?: number
  pupilSize?: number
  maxDistance?: number
  eyeColor?: string
  pupilColor?: string
  isBlinking?: boolean
  forceLookX?: number
  forceLookY?: number
}

const EyeBall = ({
  size = 48,
  pupilSize = 16,
  maxDistance = 10,
  eyeColor = 'white',
  pupilColor = 'black',
  isBlinking = false,
  forceLookX,
  forceLookY,
}: EyeBallProps) => {
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const eyeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setMouseX(e.clientX)
      setMouseY(e.clientY)
    }
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [])

  const pos = (() => {
    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY }
    }
    if (!eyeRef.current) return { x: 0, y: 0 }
    const rect = eyeRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = mouseX - cx
    const dy = mouseY - cy
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance)
    const ang = Math.atan2(dy, dx)
    return { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist }
  })()

  return (
    <div
      ref={eyeRef}
      style={{
        width: size,
        height: isBlinking ? 2 : size,
        borderRadius: '50%',
        backgroundColor: eyeColor,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s ease-out',
      }}
    >
      {!isBlinking && (
        <div
          style={{
            width: pupilSize,
            height: pupilSize,
            borderRadius: '50%',
            backgroundColor: pupilColor,
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}
    </div>
  )
}

/* ========== 场景组件 ========== */

export function AnimatedCharacters({
  isTyping = false,
  showPassword = false,
  passwordLength = 0,
}: {
  isTyping?: boolean
  showPassword?: boolean
  passwordLength?: number
}) {
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false)
  const [isBlackBlinking, setIsBlackBlinking] = useState(false)
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false)
  const [isPurplePeeking, setIsPurplePeeking] = useState(false)
  const purpleRef = useRef<HTMLDivElement>(null)
  const blackRef = useRef<HTMLDivElement>(null)
  const yellowRef = useRef<HTMLDivElement>(null)
  const orangeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setMouseX(e.clientX)
      setMouseY(e.clientY)
    }
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [])

  // Purple blinking
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    const schedule = () => {
      t = setTimeout(() => {
        setIsPurpleBlinking(true)
        setTimeout(() => {
          setIsPurpleBlinking(false)
          schedule()
        }, 150)
      }, Math.random() * 4000 + 3000)
    }
    schedule()
    return () => clearTimeout(t)
  }, [])

  // Black blinking
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    const schedule = () => {
      t = setTimeout(() => {
        setIsBlackBlinking(true)
        setTimeout(() => {
          setIsBlackBlinking(false)
          schedule()
        }, 150)
      }, Math.random() * 4000 + 3000)
    }
    schedule()
    return () => clearTimeout(t)
  }, [])

  // Looking at each other when typing
  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true)
      const t = setTimeout(() => setIsLookingAtEachOther(false), 800)
      return () => clearTimeout(t)
    }
    setIsLookingAtEachOther(false)
  }, [isTyping])

  // Purple peeking when password visible
  useEffect(() => {
    if (passwordLength > 0 && showPassword) {
      const t = setTimeout(() => {
        setIsPurplePeeking(true)
        setTimeout(() => setIsPurplePeeking(false), 800)
      }, Math.random() * 3000 + 2000)
      return () => clearTimeout(t)
    }
    setIsPurplePeeking(false)
  }, [passwordLength, showPassword])

  const calc = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 }
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 3
    const dx = mouseX - cx
    const dy = mouseY - cy
    return {
      faceX: Math.max(-15, Math.min(15, dx / 20)),
      faceY: Math.max(-10, Math.min(10, dy / 30)),
      bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
    }
  }

  const purplePos = calc(purpleRef)
  const blackPos = calc(blackRef)
  const yellowPos = calc(yellowRef)
  const orangePos = calc(orangeRef)

  const isHidingPassword = passwordLength > 0 && !showPassword

  return (
    <div style={{ position: 'relative', width: 420, height: 320 }}>
      {/* Purple tall rectangle - Back */}
      <div
        ref={purpleRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 50,
          width: 140,
          height: isTyping || isHidingPassword ? 340 : 300,
          backgroundColor: '#7c3aed',
          borderRadius: '10px 10px 0 0',
          zIndex: 1,
          transform:
            passwordLength > 0 && showPassword
              ? 'skewX(0deg)'
              : isTyping || isHidingPassword
                ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(30px)`
                : `skewX(${purplePos.bodySkew || 0}deg)`,
          transformOrigin: 'bottom center',
          transition: 'all 0.7s ease-in-out',
        }}
      >
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            gap: 24,
            transition: 'all 0.7s ease-in-out',
            left:
              passwordLength > 0 && showPassword
                ? 15
                : isLookingAtEachOther
                  ? 42
                  : 35 + (purplePos.faceX || 0),
            top:
              passwordLength > 0 && showPassword
                ? 28
                : isLookingAtEachOther
                  ? 52
                  : 30 + (purplePos.faceY || 0),
          }}
        >
          <EyeBall
            size={16}
            pupilSize={6}
            maxDistance={4}
            eyeColor="white"
            pupilColor="#1f2937"
            isBlinking={isPurpleBlinking}
            forceLookX={
              passwordLength > 0 && showPassword
                ? isPurplePeeking
                  ? 3
                  : -3
                : isLookingAtEachOther
                  ? 2
                  : undefined
            }
            forceLookY={
              passwordLength > 0 && showPassword
                ? isPurplePeeking
                  ? 4
                  : -3
                : isLookingAtEachOther
                  ? 3
                  : undefined
            }
          />
          <EyeBall
            size={16}
            pupilSize={6}
            maxDistance={4}
            eyeColor="white"
            pupilColor="#1f2937"
            isBlinking={isPurpleBlinking}
            forceLookX={
              passwordLength > 0 && showPassword
                ? isPurplePeeking
                  ? 3
                  : -3
                : isLookingAtEachOther
                  ? 2
                  : undefined
            }
            forceLookY={
              passwordLength > 0 && showPassword
                ? isPurplePeeking
                  ? 4
                  : -3
                : isLookingAtEachOther
                  ? 3
                  : undefined
            }
          />
        </div>
      </div>

      {/* Black tall rectangle - Middle */}
      <div
        ref={blackRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 185,
          width: 90,
          height: 240,
          backgroundColor: '#1f2937',
          borderRadius: '8px 8px 0 0',
          zIndex: 2,
          transform:
            passwordLength > 0 && showPassword
              ? 'skewX(0deg)'
              : isLookingAtEachOther
                ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 8}deg) translateX(15px)`
                : isTyping || isHidingPassword
                  ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)`
                  : `skewX(${blackPos.bodySkew || 0}deg)`,
          transformOrigin: 'bottom center',
          transition: 'all 0.7s ease-in-out',
        }}
      >
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            gap: 16,
            transition: 'all 0.7s ease-in-out',
            left:
              passwordLength > 0 && showPassword
                ? 8
                : isLookingAtEachOther
                  ? 24
                  : 20 + (blackPos.faceX || 0),
            top:
              passwordLength > 0 && showPassword
                ? 22
                : isLookingAtEachOther
                  ? 10
                  : 26 + (blackPos.faceY || 0),
          }}
        >
          <EyeBall
            size={14}
            pupilSize={5}
            maxDistance={3}
            eyeColor="white"
            pupilColor="#1f2937"
            isBlinking={isBlackBlinking}
            forceLookX={
              passwordLength > 0 && showPassword ? -3 : isLookingAtEachOther ? 0 : undefined
            }
            forceLookY={
              passwordLength > 0 && showPassword ? -3 : isLookingAtEachOther ? -3 : undefined
            }
          />
          <EyeBall
            size={14}
            pupilSize={5}
            maxDistance={3}
            eyeColor="white"
            pupilColor="#1f2937"
            isBlinking={isBlackBlinking}
            forceLookX={
              passwordLength > 0 && showPassword ? -3 : isLookingAtEachOther ? 0 : undefined
            }
            forceLookY={
              passwordLength > 0 && showPassword ? -3 : isLookingAtEachOther ? -3 : undefined
            }
          />
        </div>
      </div>

      {/* Orange semi-circle - Front left */}
      <div
        ref={orangeRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 180,
          height: 150,
          zIndex: 3,
          backgroundColor: '#f97316',
          borderRadius: '90px 90px 0 0',
          transform:
            passwordLength > 0 && showPassword
              ? 'skewX(0deg)'
              : `skewX(${orangePos.bodySkew || 0}deg)`,
          transformOrigin: 'bottom center',
          transition: 'all 0.7s ease-in-out',
        }}
      >
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            gap: 24,
            transition: 'all 0.2s ease-out',
            left:
              passwordLength > 0 && showPassword
                ? 38
                : 62 + (orangePos.faceX || 0),
            top:
              passwordLength > 0 && showPassword
                ? 65
                : 68 + (orangePos.faceY || 0),
          }}
        >
          <Pupil
            size={10}
            maxDistance={4}
            pupilColor="#1f2937"
            forceLookX={
              passwordLength > 0 && showPassword ? -4 : undefined
            }
            forceLookY={
              passwordLength > 0 && showPassword ? -3 : undefined
            }
          />
          <Pupil
            size={10}
            maxDistance={4}
            pupilColor="#1f2937"
            forceLookX={
              passwordLength > 0 && showPassword ? -4 : undefined
            }
            forceLookY={
              passwordLength > 0 && showPassword ? -3 : undefined
            }
          />
        </div>
      </div>

      {/* Yellow rounded rectangle - Front right */}
      <div
        ref={yellowRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 240,
          width: 100,
          height: 180,
          backgroundColor: '#eab308',
          borderRadius: '50px 50px 0 0',
          zIndex: 4,
          transform:
            passwordLength > 0 && showPassword
              ? 'skewX(0deg)'
              : `skewX(${yellowPos.bodySkew || 0}deg)`,
          transformOrigin: 'bottom center',
          transition: 'all 0.7s ease-in-out',
        }}
      >
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            gap: 16,
            transition: 'all 0.2s ease-out',
            left:
              passwordLength > 0 && showPassword
                ? 15
                : 38 + (yellowPos.faceX || 0),
            top:
              passwordLength > 0 && showPassword
                ? 28
                : 32 + (yellowPos.faceY || 0),
          }}
        >
          <Pupil
            size={10}
            maxDistance={4}
            pupilColor="#1f2937"
            forceLookX={
              passwordLength > 0 && showPassword ? -4 : undefined
            }
            forceLookY={
              passwordLength > 0 && showPassword ? -3 : undefined
            }
          />
          <Pupil
            size={10}
            maxDistance={4}
            pupilColor="#1f2937"
            forceLookX={
              passwordLength > 0 && showPassword ? -4 : undefined
            }
            forceLookY={
              passwordLength > 0 && showPassword ? -3 : undefined
            }
          />
        </div>
        {/* Mouth */}
        <div
          style={{
            position: 'absolute',
            width: 56,
            height: 3,
            backgroundColor: '#1f2937',
            borderRadius: 2,
            transition: 'all 0.2s ease-out',
            left:
              passwordLength > 0 && showPassword
                ? 8
                : 28 + (yellowPos.faceX || 0),
            top:
              passwordLength > 0 && showPassword
                ? 68
                : 68 + (yellowPos.faceY || 0),
          }}
        />
      </div>
    </div>
  )
}
