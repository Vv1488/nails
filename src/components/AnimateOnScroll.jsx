import { useEffect, useRef } from 'react'

function useOnScroll() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.classList.add('animate-hidden')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('animate-visible')
          el.classList.remove('animate-hidden')
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}

export function AnimateOnScroll({ children }) {
  const ref = useOnScroll()
  return <div ref={ref}>{children}</div>
}
