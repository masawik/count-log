export const NoCountersPlaceholder = () => {
  return (
    <div className="flex grow flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-2 p-2">
        <img src="/assets/img/guys.webp" alt="No content placeholder" />

        <span className="text-7 font-medium text-gray-12">
          No counters yet!
        </span>

        <span className="text-4 text-grayA-11">Create your first one!</span>
      </div>
    </div>
  )
}
