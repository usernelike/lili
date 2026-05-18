import { useEffect, useRef } from 'react'
import { OverlayScrollbars } from 'overlayscrollbars'

const defaultOptions = {
  scrollbars: {
    theme: 'os-theme-custom',
    visibility: 'auto' as const,
    autoHide: 'scroll' as const,
    autoHideDelay: 500,
    autoHideSuspend: false,
    dragScroll: true,
    clickScroll: true as const,
    pointers: null,
  },
  overflow: {
    x: 'scroll' as const,
    y: 'scroll' as const,
  },
}

/**
 * 为指定 ref 的 DOM 元素初始化 OverlayScrollbars 自定义滚动条
 * 适用于 Modal、Drawer、侧边栏等独立滚动容器
 *
 * 用法：
 * const ref = useScrollbar<HTMLDivElement>()
 * return <div ref={ref} style={{ overflow: 'auto', maxHeight: 400 }}>...</div>
 */
export function useScrollbar<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const instance = OverlayScrollbars(el, defaultOptions)

    return () => {
      instance.destroy()
    }
  }, [])

  return ref
}

/**
 * 手动为某个 DOM 元素初始化滚动条
 * 适用于动态创建或条件渲染的容器
 */
export function initScrollbar(element: HTMLElement) {
  return OverlayScrollbars(element, defaultOptions)
}
