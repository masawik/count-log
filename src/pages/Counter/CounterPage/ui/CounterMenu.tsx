import { DropdownMenu, IconButton } from '@radix-ui/themes'
import { Menu, SquarePen, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { CounterBadge, type Counter } from '@/entities/counter'

import { AppDialog } from '@/shared/ui/AppDialog'


export interface CounterMenuProps {
  counter: Counter,
  onDelete: () => void,
}

const CounterMenu = ({ counter, onDelete }: CounterMenuProps) => {
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
          <DropdownMenu.Item asChild className="text-4!">
            <Link to={`/edit-counter/${counter.id}`}>
              <SquarePen className="size-4" />
              Edit
            </Link>
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
        <AppDialog
          title="Are you sure?"
          type="confirm"
          onClickNo={() => setShowDeleteDialog(false)}
          onClickYes={onDelete}
        >
          <AppDialog.DescriptionSlot>
            <div className="flex flex-col items-center gap-2">
              <div>Do you really want to delete this counter?</div>

              <CounterBadge counter={counter} />
            </div>
          </AppDialog.DescriptionSlot>
        </AppDialog>
      )}
    </>
  )
}

export default CounterMenu
