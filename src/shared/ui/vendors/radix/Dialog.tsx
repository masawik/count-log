import { Dialog as DialogOrig, IconButton } from '@radix-ui/themes'
import { X } from 'lucide-react'
import { useCallback, useRef } from 'react'

import { cn } from '@/shared/lib'

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

interface DialogContentProps extends DialogOrig.ContentProps {
  noHeader?: boolean,

  title?: string,
  srTitle?: string,

  description?: string,
  srDescription?: string,

  noCloseBtn?: boolean,

  autofocus?: boolean,
  headerRightSide?: React.ReactNode,
}

const DialogContent = ({
  noHeader,
  noCloseBtn,
  title,
  autofocus,
  children,
  headerRightSide,
  className,
  srTitle,
  srDescription,
  ...props
}: DialogContentProps) => {
  const handleOpenAutofocus = useCallback(
    (e: Event) => {
      if (autofocus) return
      e.preventDefault()
    },
    [ autofocus ],
  )

  return (
    <DialogOrig.Content
      onOpenAutoFocus={handleOpenAutofocus}
      className={cn('px-0!', className)}
      {...props}
    >
      {!noHeader && (
        <div className="mb-4 grid grid-cols-[1fr_3fr_1fr] items-center justify-items-center px-4">
          {!noCloseBtn && (
            <DialogOrig.Close className="w-fit justify-self-start!">
              <IconButton size="3" variant="ghost" color="gray">
                <X />
              </IconButton>
            </DialogOrig.Close>
          )}

          {title && (
            <DialogOrig.Title className="m-0!">{title}</DialogOrig.Title>
          )}
          {srTitle && (
            <DialogOrig.Title className="sr-only">{srTitle}</DialogOrig.Title>
          )}

          {srDescription && (
            <DialogOrig.Description className="sr-only">
              {srDescription}
            </DialogOrig.Description>
          )}

          {/* Filler to place "headerRightSide" correctly*/}
          {!title && !!headerRightSide && <div role="presentation" />}

          {headerRightSide}
        </div>
      )}

      {children}
    </DialogOrig.Content>
  )
}

export const Dialog = {
  ...DialogOrig,
  Root: DialogRoot,
  Content: DialogContent,
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Dialog {
  export type RootProps = DialogOrig.RootProps
  export type TriggerProps = DialogOrig.TriggerProps
  export type ContentProps = DialogContentProps
  export type TitleProps = DialogOrig.TitleProps
  export type DescriptionProps = DialogOrig.DescriptionProps
  export type CloseProps = DialogOrig.CloseProps
}
