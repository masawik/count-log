/**
 * Bumps version in package.json (patch|minor|major), runs build (syncs to Android),
 * then creates one git commit and tag. Usage: node scripts/bump-version.js patch|minor|major
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const pkgPath = path.join(root, 'package.json')

const level = process.argv[2]
if (!level || !['patch', 'minor', 'major'].includes(level)) {
  console.error('Usage: node scripts/bump-version.js patch|minor|major')
  process.exit(1)
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
const [major = 0, minor = 0, patch = 0] = (pkg.version || '1.0.0').split('.').map(Number)

let newMajor = major
let newMinor = minor
let newPatch = patch
if (level === 'major') {
  newMajor += 1
  newMinor = 0
  newPatch = 0
} else if (level === 'minor') {
  newMinor += 1
  newPatch = 0
} else {
  newPatch += 1
}

const newVersion = `${newMajor}.${newMinor}.${newPatch}`
pkg.version = newVersion
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
console.log(`Bumped package.json to ${newVersion}`)

execSync('pnpm build', { cwd: root, stdio: 'inherit' })

execSync('git add package.json android/variables.gradle', { cwd: root })
execSync(`git commit -m "Bump version to ${newVersion}"`, { cwd: root })
execSync(`git tag v${newVersion}`, { cwd: root })
console.log(`Committed and tagged v${newVersion}`)
