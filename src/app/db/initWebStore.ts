import type { SQLiteConnection } from '@capacitor-community/sqlite'

export async function initWebStore(connection: SQLiteConnection) {
  const { defineCustomElements } = await import('jeep-sqlite/loader')
  defineCustomElements(window)

  await customElements.whenDefined('jeep-sqlite')
  document.body.appendChild(document.createElement('jeep-sqlite'))

  await connection.initWebStore()
}
