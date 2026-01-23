import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.zubocounter.app',
  appName: 'Zubo Counter',
  webDir: 'dist',

  server: {
    androidScheme: 'https',
  },

  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsEncryption: true,
      iosKeychainPrefix: 'zubocounter-sqlite',
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
