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

export default function GlobalScrollbar() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // 注：不在 document.documentElement 上初始化 OverlayScrollbars。
    // H5/移动端 OS 的 host 容器会与 viewport 滚动冲突，导致右侧空白、
    // 内容挤压、无法滚动。viewport 滚动依靠全局 CSS 隐藏原生滚动条即可。
    // OS 只用于内部可滚动容器（表格、弹窗、侧边栏等）。

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

    const observer = new MutationObserver(() => {
      initScrollableElements()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
    }
  }, [])

  return null
}
