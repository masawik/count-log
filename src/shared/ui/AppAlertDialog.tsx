import { Button, type ButtonProps } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'

import { createSlots } from '../component-helpers'
import { AlertDialog } from './AlertDialog'


import type { PropsWithChildren } from 'react'

export type AppDialogProps = {
  title: React.ReactNode,
  description?: React.ReactNode,
} & {
  type?: 'confirm',
  noText?: string,
  onClickNo?: () => void,
  noProps?: ButtonProps,

  yesText?: string,
  onClickYes?: () => void,
  yesProps?: ButtonProps,
}

const { DescriptionSlot, pick } = createSlots([ 'DescriptionSlot' ])

const AppAlertDialogImpl = ({
  children,
  ...props
}: AppDialogProps & PropsWithChildren) => {
  const { t } = useTranslation()
  const { DescriptionSlot } = pick(children)

  return (
    <AlertDialog.Root open>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>{props.title}</AlertDialog.Title>
        {DescriptionSlot ? (
          DescriptionSlot
        ) : props.description ? (
          <AlertDialog.Description size="4" className="whitespace-pre-line">
            {props.description}
          </AlertDialog.Description>
        ) : null}

        {props.type === 'confirm' && (
          <div className="mt-4 flex justify-end gap-3">
            <Button
              variant="soft"
              color="gray"
              size="4"
              onClick={props.onClickNo}
              {...props.noProps}
            >
              {props.noText || t('no')}
            </Button>

            <Button
              variant="solid"
              color="red"
              size="4"
              onClick={props.onClickYes}
              {...props.yesProps}
            >
              {props.yesText || t('yes')}
            </Button>
          </div>
        )}
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}

export const AppAlertDialog = Object.assign(AppAlertDialogImpl, {
  DescriptionSlot,
})
