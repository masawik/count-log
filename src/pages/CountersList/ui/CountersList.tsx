import { Container, Flex, IconButton, Text } from '@radix-ui/themes'
import { Plus } from 'lucide-react'
import styles from './styles.module.css'

export default function CountersListPage() {
  return (
    <Container asChild>
      <main>
        <Flex justify="center" align="center" direction="column" height="100vh">
          <Flex direction="column" align="center" gap="2" p="2">
            <img src="/assets/img/guys.webp" alt="No content placeholder" />

            <Text size="7" weight="bold" highContrast>
              No counters yet!
            </Text>

            <Text size="4" weight="regular" color="gray">
              Create your first one!
            </Text>
          </Flex>

          <div className={styles['AddButtonContainer']}>
            <img
              src="/assets/img/arrow.webp"
              alt="A hand-drawn arrow points to the plus button"
              className={styles['ArrowImage']}
            />

            <IconButton
              size="4"
              variant="solid"
              radius="full"
            >
              <Plus />
            </IconButton>
          </div>
        </Flex>
      </main>
    </Container>
  )
}
