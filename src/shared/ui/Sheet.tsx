import { Slot } from '@radix-ui/themes'

import { cn } from '../lib/utils'

export interface SheetProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean,
}

export default function Sheet({ asChild, children, className, ...props }: SheetProps) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp className={cn('shadow-3 bg-white p-2 rounded-xl', className)} {...props}>
      {children}
    </Comp>
  )
}
