import { Dialog as DialogOrig } from '@radix-ui/themes'
import { useCallback, useRef } from 'react'

import { useAndroidBackButtonCb } from '../../../nativePlatform'

const DialogRoot = ({ onOpenChange, ...props }: DialogOrig.RootProps) => {
  const isOpenRef = useRef<boolean>(props.open || props.defaultOpen)

  const onOpenChangeInner = useCallback(
    (value: boolean) => {
      isOpenRef.current = value
      onOpenChange?.(value)
    },
    [ onOpenChange ],
  )

  useAndroidBackButtonCb(() => {
    if (!isOpenRef.current) return false

    onOpenChange?.(false)
  })

  return <DialogOrig.Root onOpenChange={onOpenChangeInner} {...props} />
}

export const Dialog = {
  ...DialogOrig,
  Root: DialogRoot,
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Dialog {
  export type RootProps = DialogOrig.RootProps
  export type TriggerProps = DialogOrig.TriggerProps
  export type ContentProps = DialogOrig.ContentProps
  export type TitleProps = DialogOrig.TitleProps
  export type DescriptionProps = DialogOrig.DescriptionProps
  export type CloseProps = DialogOrig.CloseProps
}
