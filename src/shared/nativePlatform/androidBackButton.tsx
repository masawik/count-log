import { App } from '@capacitor/app'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useRef,
  type PropsWithChildren,
} from 'react'
import { useNavigate, type NavigateOptions, type To } from 'react-router'

import { PLATFORM } from '../config'

import type { PluginListenerHandle } from '@capacitor/core'

interface NavigateOpts {
  to: To,
  opts?: NavigateOptions,
}

type BackButtonCb = () => void | false
type BackButtonAction =
  | { cb: BackButtonCb }
  | { navigate: NavigateOpts | (() => NavigateOpts) }

interface AndroidBackButtonContext {
  push: (action: BackButtonAction) => () => void,
}

const getMissingCtxError = () =>
  new Error('AndroidBackButtonProvider is missing')
const AndroidBackButtonContext = createContext<AndroidBackButtonContext | null>(
  null,
)

export const AndroidBackButtonProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate()

  const stackRef = useRef<BackButtonAction[]>([])

  const push = useCallback((action: BackButtonAction) => {
    stackRef.current.push(action)

    return () => {
      stackRef.current = stackRef.current.filter((a) => a !== action)
    }
  }, [])

  useEffect(() => {
    if (PLATFORM !== 'android') return

    let remove: PluginListenerHandle['remove'] | undefined

    const handleAction = (action: BackButtonAction) => {
      if ('cb' in action) {
        return action.cb()
      }

      if ('navigate' in action) {
        const opts =
          typeof action.navigate === 'function'
            ? action.navigate()
            : action.navigate
        void navigate(opts.to, opts.opts)
      }
    }

    void App.addListener('backButton', ({ canGoBack }) => {
      for (let i = stackRef.current.length - 1; i >= 0; i--) {
        const action = stackRef.current[i]
        const result = handleAction(action)
        if (result !== false) return
      }

      if (canGoBack && window.history.length > 1) {
        void navigate(-1)
        return
      } else {
        void App.exitApp()
        return
      }
    }).then((r) => {
      remove = r.remove
    })

    return () => {
      void remove?.()
    }
  }, [ navigate ])

  return (
    <AndroidBackButtonContext.Provider value={{ push }}>
      {children}
    </AndroidBackButtonContext.Provider>
  )
}

export const useAndroidBackButtonNavigate = (
  to: To,
  opts?: NavigateOptions,
) => {
  const ctx = useContext(AndroidBackButtonContext)
  if (!ctx) throw getMissingCtxError()
  const { push } = ctx

  const getNavigate = useEffectEvent(() => ({ to, opts }))

  useEffect(
    () =>
      push({
        navigate: getNavigate,
      }),
    [ push ],
  )
}

export const useAndroidBackButtonCb = (cb: BackButtonCb) => {
  const ctx = useContext(AndroidBackButtonContext)
  if (!ctx) throw getMissingCtxError()
  const { push } = ctx

  const stabCb = useEffectEvent(cb)

  useEffect(() => push({ cb: stabCb }), [ push ])
}

export const useAndroidBackButtonExitApp = () => {
  const ctx = useContext(AndroidBackButtonContext)
  if (!ctx) throw getMissingCtxError()
  const { push } = ctx

  useEffect(() => push({ cb: () => void App.exitApp() }), [ push ])
}
