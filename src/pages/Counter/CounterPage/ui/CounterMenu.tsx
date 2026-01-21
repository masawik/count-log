import { DropdownMenu, IconButton } from '@radix-ui/themes'
import { Menu, SquarePen, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { CounterBadge, type Counter } from '@/entities/counter'

import { AppAlertDialog } from '@/shared/ui/AppAlertDialog'

export interface CounterMenuProps {
  counter: Counter,
  onDelete: () => void,
  onEdit: () => void,
}

const CounterMenu = ({ counter, onDelete, onEdit }: CounterMenuProps) => {
  const [ showDeleteDialog, setShowDeleteDialog ] = useState(false)

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="ghost" color="gray" size="3" className="m-0!">
            <Menu />
          </IconButton>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content size="2">
          <DropdownMenu.Item
            color="gray"
            className="text-4!"
            onClick={onEdit}
          >
            <SquarePen className="size-4" />
            Edit
          </DropdownMenu.Item>

          <DropdownMenu.Item
            color="red"
            className="text-4!"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {showDeleteDialog && (
        <AppAlertDialog
          title="Are you sure?"
          type="confirm"
          onClickNo={() => setShowDeleteDialog(false)}
          onClickYes={onDelete}
        >
          <AppAlertDialog.DescriptionSlot>
            <div className="flex flex-col items-center gap-2">
              <div>Do you really want to delete this counter?</div>

              <CounterBadge counter={counter} />
            </div>
          </AppAlertDialog.DescriptionSlot>
        </AppAlertDialog>
      )}
    </>
  )
}

export default CounterMenu
