import { Spinner } from '@radix-ui/themes'

export const FullPageLoader = () => {
  return (
    <div className="flex items-center justify-center h-fill">
      <Spinner />
    </div>
  )
}
