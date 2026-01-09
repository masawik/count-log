import styles from './NoCountersPlaceholder.module.css'


export const NoCountersPlaceholder = () => {

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-2 p-2">
        <img src="/assets/img/guys.webp" alt="No content placeholder" />

        <span className="text-7 font-medium text-gray-12">
          No counters yet!
        </span>

        <span className="text-4 text-grayA-11">Create your first one!</span>
      </div>

        <img
          src="/assets/img/arrow.webp"
          alt="A hand-drawn arrow points to the plus button"
          className={styles['ArrowImage']}
        />
    </div>
  )
}
