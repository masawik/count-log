import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.countlog.app',
  appName: 'CountLog',
  webDir: 'build/client',

  server: {
    androidScheme: 'https',
  },

  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsEncryption: true,
      iosKeychainPrefix: 'countlog-sqlite',
      iosBiometric: {
        biometricAuth: false,
        biometricTitle : 'Biometric login for capacitor sqlite',
      },
      androidIsEncryption: true,
      androidBiometric: {
        biometricAuth : false,
        biometricTitle : 'Biometric login for capacitor sqlite',
        biometricSubTitle : 'Log in using your biometric',
      },
    },
    SystemBars: {
      insetsHandling: 'disable',
    },
  },
}

export default config
