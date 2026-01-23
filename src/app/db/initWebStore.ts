import type { SQLiteConnection } from '@capacitor-community/sqlite'

export async function initWebStore(connection: SQLiteConnection) {
  const { defineCustomElements } = await import('jeep-sqlite/loader')
  defineCustomElements(window)

  await customElements.whenDefined('jeep-sqlite')
  const jeepEl = document.createElement('jeep-sqlite')

  jeepEl.setAttribute('wasmPath', '/count-log/assets')

  document.body.appendChild(jeepEl)

  await connection.initWebStore()
}
