import { useEffect, useEffectEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isRouteErrorResponse, useNavigate, useRouteError, type ErrorResponse } from 'react-router'

import { type ApiClientError, isApiClientError } from '@/shared/api'
import { IS_DEV } from '@/shared/config'
interface ErrorInfo {
  message: string,
  details?: string,
  stack?: string,
}

export function ErrorBoundary() {
  const { t } = useTranslation()
  const error = useRouteError()
  const navigate = useNavigate()
  const [ errorInfo, setErrorInfo ] = useState<ErrorInfo>({
    message: t('oops'),
    details: t('unexpectedError'),
  })

  useEffect(() => { document.title = t('error') }, [ t ])

  const handleRouteErrorResponse = useEffectEvent((e: ErrorResponse) => {
    setErrorInfo(i => ({
      message: e.status === 404 ? '404' : t('error'),
      details: e.status === 404
        ? t('pageNotFound')
        : e.statusText || i.details,
    }))
  })

  const handleApiClientError = useEffectEvent((e: ApiClientError) => {
    if (e.response.status === 404) {
      void navigate('/404', { replace: true })
      return
    }

    setErrorInfo({
      message: String(e.response.status),
      details: `at ${e.response.url}`,
    })


    if (IS_DEV) {
      // @ts-expect-error We put the error in window to be able to inspect it in the browser
      window.LAST_ERROR = e
    }
  })

  const handleOtherError = useEffectEvent((e: Error) => {
    setErrorInfo({
      message: e.message,
      stack: e.stack,
    })
  })

  useEffect(() => {
    if (isRouteErrorResponse(error)) {
      handleRouteErrorResponse(error)
    } else if (isApiClientError(error)) {
      handleApiClientError(error)
    } else if (IS_DEV && error && error instanceof Error) {
      handleOtherError(error)
    }
  }, [ error ])



  return (
    <main className="pt-16 p-4 container mx-auto" data-test-id="error-boundary">
      <h1>{errorInfo.message}</h1>
      <p>{errorInfo.details}</p>
      {errorInfo.stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{errorInfo.stack}</code>
        </pre>
      )}
    </main>
  )
}
