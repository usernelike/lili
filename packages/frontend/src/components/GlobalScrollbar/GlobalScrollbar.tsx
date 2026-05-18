import { useEffect, useRef } from 'react'
import { OverlayScrollbars } from 'overlayscrollbars'

const viewportOptions = {
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
    x: 'hidden' as const,
    y: 'scroll' as const,
  },
}

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

export default function GlobalScrollbar() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // 初始化 viewport 滚动条（html 元素）
    const osInstance = OverlayScrollbars(document.documentElement, viewportOptions)

    // 为已存在的可滚动容器添加滚动条
    const initScrollableElements = () => {
      const scrollables = document.querySelectorAll(
        '[data-scrollbar], .ant-table-body, .os-scrollable'
      )
      scrollables.forEach((el) => {
        if (el instanceof HTMLElement && !el.hasAttribute('data-os-initialized')) {
          OverlayScrollbars(el, defaultOptions)
          el.setAttribute('data-os-initialized', 'true')
        }
      })
    }

    initScrollableElements()

    // 监听 DOM 变化，为新添加的可滚动容器初始化滚动条
    const observer = new MutationObserver(() => {
      initScrollableElements()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      osInstance.destroy()
    }
  }, [])

  return null
}
