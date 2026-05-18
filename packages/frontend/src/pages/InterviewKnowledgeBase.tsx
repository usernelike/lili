import { apiFetch } from '../utils/api'
import { useState, useMemo, useCallback, useEffect } from 'react'
import {
  BookOpen,
  Search,
  ChevronDown,
  ChevronRight,
  Tag,
  Bookmark,
  BookmarkCheck,
  Filter,
  Loader2,
} from 'lucide-react'
import interviewData from '../data/interviewData'
import { useMobile } from '../hooks/useMobile'

interface FavoriteItem {
  id: number
  itemId: string
  question: string
  category: string
  note: string | null
  createdAt: string
}

export default function InterviewKnowledgeBase() {
  const isMobile = useMobile()
  const [activeCategory, setActiveCategory] = useState<string>('html-css')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set())

  // Load favorites from backend
  const loadFavorites = useCallback(async () => {
    try {
      const res = await apiFetch('/api/interview/favorites')
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setFavorites(json.data)
      }
    } catch (err) {
      console.error('加载收藏失败:', err)
    }
  }, [])

  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  const isFavorited = useCallback(
    (itemId: string) => favorites.some((f) => f.itemId === itemId),
    [favorites]
  )

  const getFavoriteId = useCallback(
    (itemId: string) => favorites.find((f) => f.itemId === itemId)?.id,
    [favorites]
  )

  const toggleFavorite = useCallback(
    async (item: { id: string; question: string }, categoryName: string) => {
      if (loadingItems.has(item.id)) return
      setLoadingItems((prev) => new Set(prev).add(item.id))
      try {
        if (isFavorited(item.id)) {
          const favId = getFavoriteId(item.id)
          if (favId) {
            await apiFetch(`/api/interview/favorites/${favId}`, { method: 'DELETE' })
          }
        } else {
          await apiFetch('/api/interview/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              item_id: item.id,
              question: item.question,
              category: categoryName,
            }),
          })
        }
        await loadFavorites()
      } catch (err) {
        console.error('收藏操作失败:', err)
      } finally {
        setLoadingItems((prev) => {
          const next = new Set(prev)
          next.delete(item.id)
          return next
        })
      }
    },
    [loadingItems, isFavorited, getFavoriteId, loadFavorites]
  )

  const toggleItem = useCallback((id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const filteredData = useMemo(() => {
    let data = interviewData
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      data = interviewData
        .map((cat) => ({
          ...cat,
          items: cat.items.filter(
            (item) =>
              item.question.toLowerCase().includes(q) ||
              item.answer.toLowerCase().includes(q) ||
              item.tags?.some((tag) => tag.toLowerCase().includes(q))
          ),
        }))
        .filter((cat) => cat.items.length > 0)
    }
    if (showOnlyFavorites) {
      const favIds = new Set(favorites.map((f) => f.itemId))
      data = data
        .map((cat) => ({
          ...cat,
          items: cat.items.filter((item) => favIds.has(item.id)),
        }))
        .filter((cat) => cat.items.length > 0)
    }
    return data
  }, [searchQuery, showOnlyFavorites, favorites])

  const activeCategoryData = useMemo(() => {
    return filteredData.find((cat) => cat.id === activeCategory) || filteredData[0]
  }, [filteredData, activeCategory])

  // 搜索或切换只看收藏时，自动选中第一个有结果的分类
  useEffect(() => {
    if (activeCategoryData && activeCategoryData.id !== activeCategory) {
      setActiveCategory(activeCategoryData.id)
    }
  }, [activeCategoryData, activeCategory])

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: isMobile ? '80px 16px 40px' : '100px 40px 60px',
        maxWidth: 1400,
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: isMobile ? 24 : 40 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 20px',
            borderRadius: 20,
            background: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid var(--border-glow)',
            color: 'var(--accent-cyan)',
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 16,
          }}
        >
          <BookOpen size={14} />
          面试知识库
        </div>
        <h1 style={{ fontSize: isMobile ? 24 : 'clamp(28px, 3vw, 40px)', fontWeight: 700, marginBottom: 12 }}>
          全栈面试<span className="gradient-text">知识汇总</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: isMobile ? 14 : 16, maxWidth: 600 }}>
          覆盖前端核心知识点，从 HTML/CSS 到算法与数据结构，助你系统备战技术面试。
        </p>
      </div>

      {/* Search & Filter */}
      <div style={{ marginBottom: 32, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 20px',
            borderRadius: 12,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            maxWidth: 500,
            flex: 1,
          }}
        >
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="搜索面试题、知识点或标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: 15,
              fontFamily: 'inherit',
            }}
          />
        </div>

        <button
          onClick={() => setShowOnlyFavorites((v) => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 20px',
            borderRadius: 12,
            border: '1px solid var(--border-subtle)',
            background: showOnlyFavorites ? 'rgba(0, 212, 255, 0.1)' : 'var(--bg-card)',
            color: showOnlyFavorites ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
        >
          <Filter size={16} />
          {showOnlyFavorites ? '显示全部' : `只看收藏 (${favorites.length})`}
        </button>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row' }}>
        {/* Sidebar Categories */}
        <div
          style={{
            width: isMobile ? '100%' : 220,
            flexShrink: 0,
            position: isMobile ? 'relative' : 'sticky',
            top: isMobile ? 0 : 100,
          }}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: 16,
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
              display: isMobile ? 'flex' : 'block',
              overflowX: isMobile ? 'auto' : 'hidden',
            }}
          >
            {filteredData.map((cat) => {
              const isActive = activeCategory === cat.id
              const count = cat.items.length
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    width: isMobile ? 'auto' : '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: isMobile ? '10px 14px' : '14px 18px',
                    border: 'none',
                    borderBottom: isMobile ? 'none' : '1px solid var(--border-subtle)',
                    borderRight: isMobile ? '1px solid var(--border-subtle)' : 'none',
                    background: isActive ? 'rgba(0, 212, 255, 0.08)' : 'transparent',
                    color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                      e.currentTarget.style.color = 'var(--text-primary)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'var(--text-secondary)'
                    }
                  }}
                >
                  <span>{cat.name}</span>
                  <span
                    style={{
                      fontSize: 12,
                      color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      background: isActive ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.05)',
                      padding: '2px 8px',
                      borderRadius: 10,
                      marginLeft: 8,
                    }}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Knowledge Items */}
        <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
          {activeCategoryData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 16 }}>
              {activeCategoryData.items.map((item) => {
                const isExpanded = expandedItems.has(item.id)
                const favorited = isFavorited(item.id)
                const isLoading = loadingItems.has(item.id)
                return (
                  <div
                    key={item.id}
                    style={{
                      background: 'var(--bg-card)',
                      borderRadius: 16,
                      border: '1px solid var(--border-subtle)',
                      overflow: 'hidden',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: isMobile ? '14px 16px' : '18px 24px',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        fontSize: isMobile ? 14 : 16,
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: 'inherit',
                      }}
                    >
                      {isExpanded ? (
                        <ChevronDown size={isMobile ? 16 : 18} color="var(--accent-cyan)" />
                      ) : (
                        <ChevronRight size={isMobile ? 16 : 18} color="var(--text-muted)" />
                      )}
                      <span style={{ flex: 1 }}>{item.question}</span>
                      {item.tags?.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: 11,
                            color: 'var(--text-muted)',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '3px 10px',
                            borderRadius: 8,
                            fontWeight: 500,
                            display: isMobile ? 'none' : 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <Tag size={10} />
                          {tag}
                        </span>
                      ))}
                      <span
                        onClick={(e) => {
                          e.stopPropagation()
                          if (!isLoading) toggleFavorite(item, activeCategoryData.name)
                        }}
                        style={{
                          cursor: isLoading ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: 4,
                          borderRadius: 6,
                          transition: 'all 0.2s',
                          opacity: isLoading ? 0.6 : 1,
                        }}
                        title={favorited ? '取消收藏' : '加入收藏'}
                      >
                        {isLoading ? (
                          <Loader2 size={18} color="var(--accent-cyan)" className="spin" />
                        ) : favorited ? (
                          <BookmarkCheck size={18} color="var(--accent-cyan)" />
                        ) : (
                          <Bookmark size={18} color="var(--text-muted)" />
                        )}
                      </span>
                    </button>
                    {isExpanded && (
                      <div
                        style={{
                          padding: isMobile ? '0 16px 16px 44px' : '0 24px 24px 54px',
                          color: 'var(--text-secondary)',
                          fontSize: isMobile ? 13 : 14,
                          lineHeight: 1.8,
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {item.answer}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 20px',
                color: 'var(--text-muted)',
              }}
            >
              <Search size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
              <p style={{ fontSize: 16 }}>
                {showOnlyFavorites ? '暂无收藏的题目' : '未找到匹配的知识点'}
              </p>
              <p style={{ fontSize: 14, marginTop: 8 }}>
                {showOnlyFavorites ? '点击题目旁的收藏按钮添加' : '尝试更换搜索关键词'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
