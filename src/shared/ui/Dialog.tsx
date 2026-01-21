// eslint-disable-next-line no-restricted-imports
import { Button, Dialog as DialogOrig, IconButton } from '@radix-ui/themes'
import { X } from 'lucide-react'
import { useCallback, useRef } from 'react'
import {
  FormProvider,
  type FieldValues,
  type UseFormReturn,
} from 'react-hook-form'

import { cn } from '@/shared/lib'

import { useAndroidBackButtonCb } from '../nativePlatform'

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
  closeBtnDisabled?: boolean,

  autofocus?: boolean,
  headerRightSide?: React.ReactNode,
}

const DialogContent = ({
  noHeader,
  noCloseBtn,
  closeBtnDisabled,
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
            <DialogOrig.Close
              className="w-fit justify-self-start!"
              disabled={closeBtnDisabled}
            >
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

interface DialogFormContentProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues | undefined = undefined,
> extends Omit<DialogContentProps, 'onSubmit'> {
  formData: UseFormReturn<TFieldValues, TContext, TTransformedValues>,
  onSubmit: React.DOMAttributes<HTMLFormElement>['onSubmit'],
  isSubmitting?: boolean,
}

const DialogFormContent = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues | undefined = undefined,
>({
  formData,
  children,
  onSubmit,
  isSubmitting,
  ...props
}: DialogFormContentProps<TFieldValues, TContext, TTransformedValues>) => {
  return (
    <DialogContent closeBtnDisabled={isSubmitting} {...props}>
      <FormProvider {...formData}>
        <form onSubmit={onSubmit} className="flex min-h-0 flex-col">
          {children}

          <div className="flex flex-col gap-4">
            <div className="grid w-full grid-cols-2 items-center gap-2 px-4">
              <Dialog.Close>
                <Button
                  size="4"
                  variant="ghost"
                  color="gray"
                  className="m-0!"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </Dialog.Close>

              <Button
                variant="soft"
                size="4"
                color="grass"
                type="submit"
                loading={isSubmitting}
              >
                Done
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </DialogContent>
  )
}

export const Dialog = {
  ...DialogOrig,
  Root: DialogRoot,
  Content: DialogContent,
  FormContent: DialogFormContent,
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Dialog {
  export type RootProps = DialogOrig.RootProps
  export type TriggerProps = DialogOrig.TriggerProps
  export type ContentProps = DialogContentProps
  export type FormContentProps<
    TFieldValues extends FieldValues = FieldValues,
    TContext = unknown,
    TTransformedValues extends FieldValues | undefined = undefined,
  > = DialogFormContentProps<TFieldValues, TContext, TTransformedValues>
  export type TitleProps = DialogOrig.TitleProps
  export type DescriptionProps = DialogOrig.DescriptionProps
  export type CloseProps = DialogOrig.CloseProps
}
