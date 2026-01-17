import { IconButton } from '@radix-ui/themes'
import { Pause, Play, RotateCcw } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { cn } from '@/shared/lib'

export interface StopWatchRef {
  getMs: () => number | null,
}

export interface StopWatchProps {
  className?: string,
  ref?: React.Ref<StopWatchRef>,
}

function formatMs(ms: number) {
  const total = Math.max(0, Math.floor(ms))
  const m = Math.floor(total / 60000)
  const s = Math.floor((total % 60000) / 1000)
  const cs = Math.floor((total % 1000) / 10) // сотые
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
}

export const StopWatch = ({ className, ref }: StopWatchProps) => {
  const [ status, setStatus ] = useState<'initial' | 'play' | 'pause'>('initial')

  const timeRef = useRef<number | null>(null)
  const rafRef = useRef<null | number>(null)
  const timePreviewRef = useRef<HTMLDivElement | null>(null)

  const updatePreview = useCallback((ms: number) => {
    if (!timePreviewRef.current) return

    timePreviewRef.current.textContent = formatMs(ms)
  }, [])

  const stopRaf = useCallback(() => {
    if (rafRef.current === null) return
    cancelAnimationFrame(rafRef.current)

    rafRef.current = null
  }, [])

  useEffect(() => {
    if (status === 'play') {
      const start = performance.now()
      const acc = timeRef.current || 0

      const tick = () => {
        const delta = performance.now() - start

        timeRef.current = delta + acc
        updatePreview(timeRef.current)

        rafRef.current = requestAnimationFrame(tick)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    if (status === 'initial') {
      timeRef.current = null
      updatePreview(0)
    }

    return stopRaf
  }, [ status, updatePreview, stopRaf ])

  useImperativeHandle(ref, () => ({
    getMs: () => timeRef.current,
  }), [])

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 rounded-2xl border border-gray-7 px-16 py-4',
        className,
      )}
    >
      <div
        className="flex items-center justify-center text-6 font-medium"
        ref={timePreviewRef}
      >
        {formatMs(0)}
      </div>

      <div className="relative flex items-center justify-center">
        {(status === 'initial' || status === 'pause') && (
          <IconButton
            variant="soft"
            radius="full"
            size="4"
            onClick={() => setStatus('play')}
          >
            <Play />
          </IconButton>
        )}

        {status === 'play' && (
          <IconButton
            variant="soft"
            radius="full"
            size="4"
            color="gray"
            onClick={() => setStatus('pause')}
          >
            <Pause />
          </IconButton>
        )}

        {status === 'pause' && (
          <IconButton
            variant="soft"
            radius="full"
            size="3"
            color="orange"
            className="absolute! translate-x-[calc(100%+(var(--spacing)*4))]!"
            onClick={() => setStatus('initial')}
          >
            <RotateCcw />
          </IconButton>
        )}
      </div>
    </div>
  )
}
