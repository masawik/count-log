import { IconButton } from '@radix-ui/themes'
import { Plus } from 'lucide-react'
import { Link } from 'react-router'

import styles from './styles.module.css'

export default function CountersListPage() {
  return (
      <main className="container">
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-2 p-2">
            <img src="/assets/img/guys.webp" alt="No content placeholder" />

            <span className="text-7 font-medium text-gray-12">
              No counters yet!
            </span>

            <span className="text-4 text-grayA-11">
              Create your first one!
            </span>
          </div>

          <div className={styles['AddButtonContainer']}>
            <img
              src="/assets/img/arrow.webp"
              alt="A hand-drawn arrow points to the plus button"
              className={styles['ArrowImage']}
            />

            <IconButton asChild size="4" variant="solid" radius="full">
              <Link to="/edit-counter">
                <Plus />
              </Link>
            </IconButton>
          </div>
        </div>
      </main>
  )
}
