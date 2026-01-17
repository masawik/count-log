import { IconButton } from '@radix-ui/themes'
import { ChevronLeft } from 'lucide-react'
import { Link, type LinkProps } from 'react-router'

import type { Counter } from '@/entities/counter'

import { CounterBadge } from './CounterBadge'

import type React from 'react'

export interface CounterHeaderProps {
  counter: Counter,
  backLink?: LinkProps,
  rightSide?: React.ReactNode,
}

export const CounterHeader = ({
  backLink,
  counter,
  rightSide,
}: React.PropsWithChildren<CounterHeaderProps>) => {
  return (
    <header className="grid grid-cols-[2fr_5fr_2fr] items-start gap-2 p-3 px-2">
      {!!backLink && (
        <Link {...backLink}>
          <IconButton variant="ghost" color="gray" size="3" className="m-0!">
            <ChevronLeft />
          </IconButton>
        </Link>
      )}

      <div className="flex grow justify-center py-1">
        <CounterBadge counter={counter} className="line-clamp-3 break-all whitespace-pre-line" />
      </div>

      <div className="justify-self-end">{rightSide}</div>
    </header>
  )
}
