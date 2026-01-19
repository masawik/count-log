import { AlertDialog as AlertDialogOrig } from '@radix-ui/themes'
import { useCallback, useRef } from 'react'

import { useAndroidBackButtonCb } from '../nativePlatform'

const AlertDialogRoot = ({
  onOpenChange,
  ...props
}: AlertDialogOrig.RootProps) => {
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

  return <AlertDialogOrig.Root onOpenChange={onOpenChangeInner} {...props} />
}

export const AlertDialog = {
  ...AlertDialogOrig,
  Root: AlertDialogRoot,
}
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Dialog {
  export type AlertDialogRootProps = AlertDialogOrig.RootProps
  export type AlertDialogTriggerProps = AlertDialogOrig.TriggerProps
  export type AlertDialogContentProps = AlertDialogOrig.ContentProps
  export type AlertDialogTitleProps = AlertDialogOrig.TitleProps
  export type AlertDialogDescriptionProps = AlertDialogOrig.DescriptionProps
  export type AlertDialogActionProps = AlertDialogOrig.ActionProps
  export type AlertDialogCancelProps = AlertDialogOrig.CancelProps
}
