import { useState, useRef, useEffect, useCallback } from 'react'
import { Sparkles, Loader2, RefreshCw, ChevronRight, Star, Moon, Sun, Wind, Flame, Droplets, Mountain, Eye, Compass, Clock, Heart, Zap } from 'lucide-react'
import { apiFetch } from '../utils/api'
import { useMobile } from '../hooks/useMobile'

// ---------- Types ----------

interface QAPair {
  question: string
  options: string[]
  answer: string
}

type Step = 'idle' | 'asking' | 'waiting_answer' | 'analyzing' | 'result'

// ---------- Constants ----------

const SYSTEM_PROMPT = `你是一位神秘而智慧的占卜大师，精通东方玄学、西方占星、塔罗牌、易经、紫微斗数、生命灵数等多种占卜术。你有着温暖而深邃的洞察力，善于通过细节看到本质。

【绝对规则 - 必须严格遵守】
1. 你最多只能向用户提出5个选择题
2. 当你已经提出了5个问题后，无论如何都必须输出[RESULT]格式给出最终占卜结果，绝对不能再输出[QUESTION]
3. 如果用户说"所有问题已回答完毕，请给出最终占卜结果"，你必须立即输出[RESULT]格式

【占卜流程】
1. 用户会提出一个想问的问题（关于事业、爱情、财运、健康、学业、人生选择等）
2. 你根据用户的问题，逐步提出选择题来深入了解用户
3. 每个问题必须是四选一的选择题，选项要有区分度且与占卜主题相关
4. 问题应该帮助了解用户的：当前状态/性格倾向/处境/潜在能量/时间感等维度
5. 问完5个问题后（或用户要求结束时），你必须综合所有信息进行深度占卜分析

【提问要求】
- 每个问题要有深度，不要问太表面化的问题
- 选项要简洁（不超过12个字）
- 问题之间要有递进关系，逐步深入
- 问题风格要有神秘感，但不迷信

【输出格式 - 提问时必须严格使用】
[QUESTION]
问题内容（要有神秘感，50字以内）...
A. 选项1
B. 选项2
C. 选项3
D. 选项4
[/QUESTION]

【输出格式 - 最终结果时必须严格使用】
[RESULT]
🔮 卦象/星象解读...

✨ 核心启示...

🎯 具体建议...

📅 时机指引...

💫 一句话总结...
[/RESULT]

【重要】
- 如果当前已经问了少于5个问题，输出[QUESTION]格式
- 如果当前已经问了5个问题，必须输出[RESULT]格式，这是强制要求
- 不要输出任何格式之外的解释性文字
- 占卜结果要有洞察力，给出具体可行的建议，不要泛泛而谈`

const DIVINATION_ICONS = [Star, Moon, Sun, Wind, Flame, Droplets, Mountain]

const LOADING_TIPS = [
  '星辰正在排列，命运即将显现...',
  '古老的符文正在解读你的能量...',
  '塔罗牌在月光下缓缓翻开...',
  '易经八卦正在推演你的运势...',
  '水晶球中的迷雾正在散去...',
  '紫微星盘正在计算你的命格...',
  '宇宙的涟漪传递着关于你的信息...',
  '命运的丝线正在编织你的未来...',
  '神秘的符号在虚空中浮现...',
  '时空的裂缝中闪过你的影像...',
]

const LOADING_QUOTES = [
  { text: '你是精神病啊', source: '小欣大魔王.' },
  { text: '命运不是等待，而是选择。', source: '古希腊箴言' },
  { text: '知命者不怨天，知己者不怨人。', source: '荀子' },
  { text: '未来不是被预测的，而是被创造的。', source: '彼得·德鲁克' },
  { text: '万物皆有裂痕，那是光照进来的地方。', source: '莱昂纳德·科恩' },
  { text: '你的能量决定了你吸引什么。', source: '吸引力法则' },
  { text: '我受不了了', source: '慕慕遥' },
  { text: '月有阴晴圆缺，此事古难全。', source: '苏轼' },
  { text: '行到水穷处，坐看云起时。', source: '王维' },
  { text: '心若改变，你的态度跟着改变。', source: '马斯洛' },
  { text: '活着', source: '里奥玫' },
]

// ---------- Parser ----------

function parseQuestion(text: string): { question: string; options: string[] } | null {
  const match = text.match(/\[QUESTION\]([\s\S]*?)\[\/QUESTION\]/)
  if (!match) return null
  const content = match[1].trim()
  const lines = content.split('\n').filter(l => l.trim())
  if (lines.length < 2) return null

  const question = lines[0].trim()
  const options: string[] = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    const optMatch = line.match(/^([A-D])[.．、\s]+(.+)$/)
    if (optMatch) {
      options.push(optMatch[2].trim())
    }
  }
  if (options.length < 2) return null
  return { question, options }
}

function parseResult(text: string): string | null {
  const match = text.match(/\[RESULT\]([\s\S]*?)\[\/RESULT\]/)
  if (!match) return null
  return match[1].trim()
}

function stripTags(text: string): string {
  return text.replace(/\[QUESTION\][\s\S]*?\[\/QUESTION\]/g, '').replace(/\[RESULT\][\s\S]*?\[\/RESULT\]/g, '').trim()
}

// ---------- SSE Reader ----------

async function* streamChat(message: string, history: { role: string; content: string }[]) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history,
    { role: 'user', content: message },
  ]
  const res = await apiFetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history: messages.slice(0, -1) }),
  })

  if (!res.ok) {
    throw new Error(`请求失败 (${res.status})`)
  }

  const reader = res.body?.getReader()
  const decoder = new TextDecoder()
  if (!reader) throw new Error('连接失败')

  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data: ')) continue
      const data = trimmed.slice(6)
      if (data === '[DONE]') continue
      try {
        const parsed = JSON.parse(data)
        const content = parsed.choices?.[0]?.delta?.content
        if (content) yield content
      } catch {
        // ignore
      }
    }
  }
}

// ---------- Loading Animation Component ----------

function CrystalBallLoading({ step, tips }: { step: Step; tips: string }) {
  const icons = [Eye, Compass, Clock, Heart, Zap]
  const [rotatingIndex, setRotatingIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingIndex(prev => (prev + 1) % icons.length)
    }, 800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      gap: 24,
    }}>
      {/* Crystal ball animation */}
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        {/* Outer glow rings */}
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 80 + i * 30,
            height: 80 + i * 30,
            borderRadius: '50%',
            border: `1px solid rgba(139,92,246,${0.4 - i * 0.12})`,
            animation: `pulse-ring ${2 + i * 0.5}s ease-in-out infinite`,
          }} />
        ))}
        {/* Center crystal ball */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 70,
          height: 70,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, rgba(196,181,253,0.8), rgba(139,92,246,0.4), rgba(76,29,149,0.6))',
          boxShadow: '0 0 30px rgba(139,92,246,0.5), inset 0 0 20px rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'float 3s ease-in-out infinite',
        }}>
          {icons.map((Icon, i) => (
            <div key={i} style={{
              position: 'absolute',
              opacity: i === rotatingIndex ? 1 : 0,
              transition: 'opacity 0.3s',
            }}>
              <Icon size={28} color="#fff" />
            </div>
          ))}
        </div>
        {/* Sparkle particles */}
        {[...Array(6)].map((_, i) => (
          <div key={`sparkle-${i}`} style={{
            position: 'absolute',
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: '#c4b5fd',
            top: `${20 + Math.random() * 60}%`,
            left: `${20 + Math.random() * 60}%`,
            animation: `sparkle-float ${1.5 + Math.random()}s ease-in-out ${i * 0.2}s infinite alternate`,
          }} />
        ))}
      </div>

      {/* Status text */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#c4b5fd',
          marginBottom: 10,
          minHeight: 28,
        }}>
          {step === 'analyzing' ? '🔮 正在解读命运...' : '✨ 神秘力量正在汇聚...'}
        </div>
        <div style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.5)',
          maxWidth: 300,
          lineHeight: 1.6,
          minHeight: 44,
        }}>
          {tips}
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: i === 0 ? '#8b5cf6' : 'rgba(139,92,246,0.3)',
            animation: `dot-pulse 1.2s ease-in-out ${i * 0.15}s infinite`,
          }} />
        ))}
      </div>
    </div>
  )
}

// ---------- Component ----------

export default function Divination() {
  const isMobile = useMobile()
  const [step, setStep] = useState<Step>('idle')
  const [userQuestion, setUserQuestion] = useState('')
  const [qaPairs, setQaPairs] = useState<QAPair[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<QAPair | null>(null)
  const [resultText, setResultText] = useState('')
  const [loading, setLoading] = useState(false)
  const [, setStreamingText] = useState('')
  const [error, setError] = useState('')
  const [loadingTipIndex, setLoadingTipIndex] = useState(0)
  const [loadingQuoteIndex, setLoadingQuoteIndex] = useState(0)

  // Typewriter effect for result
  const [displayedResult, setDisplayedResult] = useState('')
  const resultRef = useRef('')
  const typewriterRef = useRef<number | null>(null)

  const questionCount = qaPairs.length
  // isFinalQuestion guard is handled in submitAnswer directly

  // Rotating loading tips
  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => {
      setLoadingTipIndex(prev => (prev + 1) % LOADING_TIPS.length)
      setLoadingQuoteIndex(prev => (prev + 1) % LOADING_QUOTES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [loading])

  // Build history for AI
  const buildHistory = useCallback(() => {
    const history: { role: string; content: string }[] = []
    history.push({ role: 'user', content: `我想占卜的问题是：${userQuestion}` })
    for (const qa of qaPairs) {
      history.push({ role: 'assistant', content: `[QUESTION]\n${qa.question}\nA. ${qa.options[0] || ''}\nB. ${qa.options[1] || ''}\nC. ${qa.options[2] || ''}\nD. ${qa.options[3] || ''}\n[/QUESTION]` })
      history.push({ role: 'user', content: `我选择：${qa.answer}` })
    }
    return history
  }, [userQuestion, qaPairs])

  // Start divination - ask first question
  const startDivination = async () => {
    if (!userQuestion.trim() || loading) return
    setStep('asking')
    setLoading(true)
    setError('')
    setStreamingText('')
    setLoadingTipIndex(0)

    try {
      let fullText = ''
      for await (const chunk of streamChat(userQuestion.trim(), [])) {
        fullText += chunk
        setStreamingText(fullText)
      }

      const parsed = parseQuestion(fullText)
      if (parsed) {
        setCurrentQuestion({ question: parsed.question, options: parsed.options, answer: '' })
        setStep('waiting_answer')
      } else {
        setError('解析问题失败，请重试')
        setStep('idle')
      }
    } catch (err) {
      setError('连接失败: ' + (err as Error).message)
      setStep('idle')
    } finally {
      setLoading(false)
      setStreamingText('')
    }
  }

  // Submit answer and get next question or result
  const submitAnswer = async (answerIndex: number) => {
    if (!currentQuestion || loading) return
    const answerLabel = ['A', 'B', 'C', 'D'][answerIndex]
    const answerText = `${answerLabel}. ${currentQuestion.options[answerIndex] || ''}`

    // Save current Q&A
    const updatedPairs = [...qaPairs, { ...currentQuestion, answer: answerText }]
    setQaPairs(updatedPairs)
    setCurrentQuestion(null)
    setLoading(true)
    setError('')
    setStreamingText('')
    setLoadingTipIndex(0)

    // Check if we've reached 5 questions
    const willBeFinal = updatedPairs.length >= 5
    if (willBeFinal) {
      setStep('analyzing')
    } else {
      setStep('asking')
    }

    try {
      const history = buildHistory()
      // Need to include the just-answered question in history
      const completeHistory = [
        ...history,
        { role: 'user', content: `我选择：${answerText}` },
      ]

      // Determine message based on whether this is the final question
      const nextMessage = willBeFinal
        ? '所有5个问题已回答完毕。根据规则，你必须立即输出[RESULT]格式给出最终占卜结果，绝对不能再提问。'
        : '请继续提问下一个问题。'

      let fullText = ''
      for await (const chunk of streamChat(nextMessage, completeHistory.slice(0, -1))) {
        fullText += chunk
        setStreamingText(fullText)
      }

      // FORCE GUARD: If we already have 5 Q&A pairs, always treat as result
      if (updatedPairs.length >= 5) {
        const resultParsed = parseResult(fullText)
        if (resultParsed) {
          setResultText(resultParsed)
        } else {
          // Fallback: strip tags and use as result
          const clean = stripTags(fullText)
          setResultText(clean.length > 50 ? clean : fullText)
        }
        setStep('result')
        return
      }

      // Normal flow for questions 1-4
      const resultParsed = parseResult(fullText)
      if (resultParsed) {
        setResultText(resultParsed)
        setStep('result')
      } else {
        const questionParsed = parseQuestion(fullText)
        if (questionParsed) {
          setCurrentQuestion({ question: questionParsed.question, options: questionParsed.options, answer: '' })
          setStep('waiting_answer')
        } else {
          const clean = stripTags(fullText)
          if (clean.length > 50) {
            setResultText(clean)
            setStep('result')
          } else {
            setError('解析响应失败，请重试')
            setStep('waiting_answer')
            setQaPairs(updatedPairs.slice(0, -1))
            setCurrentQuestion({ ...currentQuestion, answer: '' })
          }
        }
      }
    } catch (err) {
      setError('连接失败: ' + (err as Error).message)
      setStep('waiting_answer')
      setQaPairs(updatedPairs.slice(0, -1))
      setCurrentQuestion({ ...currentQuestion, answer: '' })
    } finally {
      setLoading(false)
      setStreamingText('')
    }
  }

  // Typewriter effect for result
  useEffect(() => {
    if (step !== 'result' || !resultText) return

    resultRef.current = resultText
    let index = 0
    const speed = 18 // ms per char

    const tick = () => {
      if (index < resultRef.current.length) {
        index += 1
        setDisplayedResult(resultRef.current.slice(0, index))
        typewriterRef.current = window.setTimeout(tick, speed)
      }
    }

    tick()
    return () => {
      if (typewriterRef.current) clearTimeout(typewriterRef.current)
    }
  }, [step, resultText])

  // Reset everything
  const reset = () => {
    setStep('idle')
    setUserQuestion('')
    setQaPairs([])
    setCurrentQuestion(null)
    setResultText('')
    setDisplayedResult('')
    setError('')
    setStreamingText('')
    setLoading(false)
    setLoadingTipIndex(0)
  }

  // Get icon for current question
  const CurrentIcon = DIVINATION_ICONS[questionCount % DIVINATION_ICONS.length]

  return (
    <div style={{
      paddingTop: isMobile ? 60 : 80,
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0d0b1a 0%, #1a1333 40%, #0f0c1c 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(1); }
          100% { opacity: 0.8; transform: scale(1.5); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139,92,246,0.3); }
          50% { box-shadow: 0 0 40px rgba(139,92,246,0.6); }
        }
        @keyframes pulse-ring {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.2; }
        }
        @keyframes sparkle-float {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          100% { transform: translateY(-15px) scale(1.3); opacity: 0; }
        }
        @keyframes dot-pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.4); opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Background decorations */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '10%',
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Floating stars */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${10 + (i * 7) % 80}%`,
            left: `${5 + (i * 13) % 90}%`,
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.3)',
            animation: `twinkle ${2 + (i % 3)}s ease-in-out infinite alternate`,
            pointerEvents: 'none',
          }}
        />
      ))}

      <div style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '24px 16px' : '40px 24px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            marginBottom: 16,
            animation: 'pulse-glow 3s ease-in-out infinite',
          }}>
            <Sparkles size={32} color="#fff" />
          </div>
          <h1 style={{
            fontSize: isMobile ? 28 : 36,
            fontWeight: 800,
            color: '#fff',
            margin: '0 0 8px',
            background: 'linear-gradient(135deg, #c4b5fd, #f9a8d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            AI 瞎占卜
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
            原生的问题，伴侣的冷战，亲人的隔阂，同事的八卦，遗憾的故事，阶级的差距，周边的新闻，军事的战略，大国的博弈，生命的演化，宇宙的尽头，未知的深渊狗 都可以找我畅谈
            <br />
            通过5个神秘选择题，揭示未来的可能性
          </p>
        </div>

        {/* Progress bar */}
        {step !== 'idle' && step !== 'result' && (
          <div style={{ marginBottom: 32 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>占卜进度</span>
              <span style={{ fontSize: 12, color: '#c4b5fd', fontWeight: 600 }}>
                {Math.min(questionCount, 5)} / 5
              </span>
            </div>
            <div style={{
              height: 4,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.1)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${(Math.min(questionCount, 5) / 5) * 100}%`,
                borderRadius: 2,
                background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        )}

        {/* Idle: Input Question */}
        {step === 'idle' && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 20,
            border: '1px solid rgba(139,92,246,0.2)',
            padding: isMobile ? '24px 20px' : '32px',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Moon size={40} color="#c4b5fd" style={{ marginBottom: 12 }} />
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>
                你想占卜什么？
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                事业 · 爱情 · 财运 · 健康 · 学业 · 人生选择
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <textarea
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="例如：我最近的职业发展会顺利吗？我和TA的感情会有结果吗？"
                rows={3}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: '1px solid rgba(139,92,246,0.3)',
                  background: 'rgba(0,0,0,0.3)',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'vertical',
                  lineHeight: 1.6,
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.metaKey) {
                    startDivination()
                  }
                }}
              />
            </div>

            <button
              onClick={startDivination}
              disabled={!userQuestion.trim() || loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: !userQuestion.trim() || loading ? 'not-allowed' : 'pointer',
                opacity: !userQuestion.trim() || loading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontFamily: 'inherit',
                transition: 'all 0.3s',
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  正在连接神秘力量...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  开始占卜
                </>
              )}
            </button>

            {error && (
              <div style={{
                marginTop: 12,
                padding: '10px 14px',
                borderRadius: 8,
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5',
                fontSize: 13,
              }}>
                {error}
              </div>
            )}

            {/* Example questions */}
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 10, textAlign: 'center' }}>
                💡 试试这些问题
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  '我最近的事业发展会顺利吗？',
                  '我和TA的感情会有结果吗？',
                  '今年我的财运如何？',
                  '我适合现在换工作吗？',
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setUserQuestion(q)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid rgba(139,92,246,0.15)',
                      background: 'rgba(139,92,246,0.05)',
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: 13,
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'
                      e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading states with crystal ball */}
        {(step === 'asking' || step === 'analyzing') && loading && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 20,
            border: '1px solid rgba(139,92,246,0.2)',
            backdropFilter: 'blur(10px)',
          }}>
            <CrystalBallLoading
              step={step}
              tips={LOADING_TIPS[loadingTipIndex % LOADING_TIPS.length]}
            />

            {/* Quote card */}
            <div style={{
              margin: '0 24px 24px',
              padding: '16px 20px',
              borderRadius: 12,
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(139,92,246,0.1)',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.6)',
                fontStyle: 'italic',
                lineHeight: 1.6,
                marginBottom: 8,
              }}>
                "{LOADING_QUOTES[loadingQuoteIndex % LOADING_QUOTES.length].text}"
              </div>
              <div style={{
                fontSize: 12,
                color: 'rgba(139,92,246,0.6)',
              }}>
                — {LOADING_QUOTES[loadingQuoteIndex % LOADING_QUOTES.length].source}
              </div>
            </div>
          </div>
        )}

        {/* Waiting answer: show question and options */}
        {step === 'waiting_answer' && currentQuestion && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 20,
            border: '1px solid rgba(139,92,246,0.2)',
            padding: isMobile ? '24px 20px' : '32px',
            backdropFilter: 'blur(10px)',
            animation: 'float 6s ease-in-out infinite',
          }}>
            {/* Question number badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}>
              <div style={{
                padding: '6px 16px',
                borderRadius: 20,
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                fontSize: 12,
                fontWeight: 700,
                color: '#fff',
              }}>
                第 {questionCount + 1} / 5 问
              </div>
            </div>

            {/* Question icon */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <CurrentIcon size={36} color="#c4b5fd" />
            </div>

            {/* Question text */}
            <h2 style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#fff',
              textAlign: 'center',
              margin: '0 0 24px',
              lineHeight: 1.6,
            }}>
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {currentQuestion.options.map((opt, i) => {
                const labels = ['A', 'B', 'C', 'D']
                const gradients = [
                  'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  'linear-gradient(135deg, #a855f7, #9333ea)',
                  'linear-gradient(135deg, #c084fc, #a855f7)',
                  'linear-gradient(135deg, #d8b4fe, #c084fc)',
                ]
                return (
                  <button
                    key={i}
                    onClick={() => submitAnswer(i)}
                    disabled={loading}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '14px 18px',
                      borderRadius: 12,
                      border: '1px solid rgba(139,92,246,0.25)',
                      background: 'rgba(0,0,0,0.25)',
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.5 : 1,
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      if (loading) return
                      e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)'
                      e.currentTarget.style.background = 'rgba(139,92,246,0.1)'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)'
                      e.currentTarget.style.background = 'rgba(0,0,0,0.25)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: gradients[i],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 800,
                      color: '#fff',
                      flexShrink: 0,
                    }}>
                      {labels[i]}
                    </div>
                    <span style={{ flex: 1 }}>{opt}</span>
                    <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
                  </button>
                )
              })}
            </div>

            {error && (
              <div style={{
                marginTop: 16,
                padding: '10px 14px',
                borderRadius: 8,
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5',
                fontSize: 13,
                textAlign: 'center',
              }}>
                {error}
              </div>
            )}
          </div>
        )}

        {/* Result */}
        {step === 'result' && (
          <div>
            {/* Result card */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 20,
              border: '1px solid rgba(139,92,246,0.25)',
              padding: isMobile ? '24px 20px' : '32px',
              backdropFilter: 'blur(10px)',
              marginBottom: 24,
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Glow effect */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 50%)',
                pointerEvents: 'none',
              }} />

              <div style={{ textAlign: 'center', marginBottom: 24, position: 'relative' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  marginBottom: 12,
                  boxShadow: '0 0 30px rgba(251,191,36,0.3)',
                }}>
                  <Sparkles size={28} color="#fff" />
                </div>
                <h2 style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#fbbf24',
                  margin: '0 0 4px',
                }}>
                  🔮 占卜结果
                </h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                  基于你的5个回答，为你揭示命运的指引
                </p>
              </div>

              {/* Q&A Summary */}
              <div style={{
                marginBottom: 24,
                padding: '16px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 12,
              }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
                  📋 你的占卜问题
                </div>
                <div style={{ fontSize: 14, color: '#c4b5fd', fontWeight: 600, marginBottom: 12 }}>
                  {userQuestion}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {qaPairs.map((qa, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: 'rgba(139,92,246,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#c4b5fd',
                        flexShrink: 0,
                        marginTop: 2,
                      }}>
                        {i + 1}
                      </span>
                      <div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>{qa.question}</div>
                        <div style={{ fontSize: 12, color: '#fbbf24' }}>{qa.answer}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Result content */}
              <div style={{
                padding: '20px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 12,
                border: '1px solid rgba(251,191,36,0.15)',
              }}>
                <div style={{
                  fontSize: 15,
                  color: '#fff',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {displayedResult}
                  {displayedResult.length < resultText.length && (
                    <span style={{
                      display: 'inline-block',
                      width: 2,
                      height: '1.2em',
                      background: '#fbbf24',
                      marginLeft: 2,
                      verticalAlign: 'text-bottom',
                      animation: 'blink 1s step-end infinite',
                    }} />
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
            }}>
              <button
                onClick={reset}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 24px',
                  borderRadius: 12,
                  border: '1px solid rgba(139,92,246,0.3)',
                  background: 'rgba(139,92,246,0.1)',
                  color: '#c4b5fd',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(139,92,246,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(139,92,246,0.1)'
                }}
              >
                <RefreshCw size={16} />
                再占一卦
              </button>
            </div>
          </div>
        )}

        {/* Error fallback for non-idle states */}
        {error && step !== 'idle' && step !== 'waiting_answer' && (
          <div style={{
            marginTop: 20,
            padding: '16px',
            borderRadius: 12,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5',
            fontSize: 14,
            textAlign: 'center',
          }}>
            {error}
            <button
              onClick={reset}
              style={{
                display: 'block',
                margin: '10px auto 0',
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                background: 'rgba(239,68,68,0.2)',
                color: '#fca5a5',
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              重新开始
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
