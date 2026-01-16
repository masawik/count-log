import { useNavigation } from 'react-router'

import { cn } from '@/shared/lib'

export const NavigationLoader = (
  { className, ...props }: React.HTMLAttributes<HTMLDivElement>,
) => {
  const navigation = useNavigation()
  const isNavigating = Boolean(navigation.location)

  if (!isNavigating) return null

  return (
    <div
      className={cn('loader-line', className)}
      role="progressbar"
      aria-valuetext="Loading"
      {...props}
    />
  )
}
