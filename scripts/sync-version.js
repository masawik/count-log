/**
 * Syncs app version from package.json to Android (variables.gradle).
 * versionName = semver string (e.g. "1.0.0")
 * versionCode = integer for Play Store: major*10000 + minor*100 + patch
 *
 * Run before Android build. Bump version with: pnpm version patch|minor|major
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const pkgPath = path.join(root, 'package.json')
const variablesPath = path.join(root, 'android', 'variables.gradle')

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
const version = pkg.version || '1.0.0'

const [major = 0, minor = 0, patch = 0] = version.split('.').map(Number)
const versionCode = major * 10000 + minor * 100 + patch

let content = fs.readFileSync(variablesPath, 'utf8')

if (content.includes('versionCode')) {
  content = content.replace(/versionCode\s*=\s*\d+/, `versionCode = ${versionCode}`)
  content = content.replace(/versionName\s*=\s*'[^']*'/, `versionName = '${version}'`)
} else {
  content = content.replace(
    /ext\s*\{\s*\n/,
    `ext {\n    versionCode = ${versionCode}\n    versionName = '${version}'\n`
  )
}

fs.writeFileSync(variablesPath, content)
console.log(`Synced version ${version} (versionCode ${versionCode}) to android/variables.gradle`)
