import { IconButton } from '@radix-ui/themes'
import { Plus } from 'lucide-react'
import { Link } from 'react-router'

import styles from './PlusBtn.module.css'

export interface PlusBtnProps {
  showArrow: boolean,
}

export const PlusBtn = ({ showArrow }: PlusBtnProps) => {
  return (
    <div className="fixed right-6 bottom-6">
      {showArrow && (
        <img
          src="assets/img/arrow.webp"
          alt="A hand-drawn arrow points to the plus button"
          className={styles['ArrowImage']}
        />
      )}

      <IconButton size="4" variant="solid" radius="full" asChild>
        <Link to="/create-counter">
          <Plus />
        </Link>
      </IconButton>
    </div>
  )
}
