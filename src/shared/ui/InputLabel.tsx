import { Flex, type FlexProps } from '@radix-ui/themes'

import { createSlots } from '../component-helpers'

import type React from 'react'

export type InputLabelProps = FlexProps & {
  text?: React.ReactNode,
}


const { TextSlot, pick } = createSlots([ 'TextSlot' ])

function InputLabel({ text, children, ...props }: React.PropsWithChildren<InputLabelProps>) {
  const { TextSlot, DefaultSlot } = pick(children)

  const label = TextSlot || text

  return (
    <Flex asChild gap="1" direction="column" {...props}>
      <label>
        {label}

        {DefaultSlot}
      </label>
    </Flex>
  )
}

export default Object.assign(InputLabel, {
  Text: TextSlot,
})
