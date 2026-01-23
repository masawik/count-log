import { useTranslation } from 'react-i18next'

export const NoCountersPlaceholder = () => {
  const { t } = useTranslation()

  return (
    <div className="flex grow flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-2 p-2">
        <img src="assets/img/guys.webp" alt="No content placeholder" />

        <span className="text-7 font-medium text-gray-12">
          {t('noCountersYet')}
        </span>

        <span className="text-4 text-grayA-11">{t('createYourFirstOne')}</span>
      </div>
    </div>
  )
}
