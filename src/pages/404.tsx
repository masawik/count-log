import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

export function meta() {return [ { title: '404' } ]}

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
  <div>
    <div>{t('nothingToSeeHere')}</div>

    <Link to="/" replace className="p-2 border-2 border-black rounded-md inline-block hover:bg-black hover:text-white">
      {t('goHome')}
    </Link>
  </div>
  )
}
