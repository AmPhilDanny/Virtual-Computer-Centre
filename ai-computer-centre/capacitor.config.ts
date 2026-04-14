import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aicomputercentre.app',
  appName: 'AI Computer Centre',
  webDir: 'public',
  server: {
    // Allows wrapping a remote Next.js server instance
    url: 'https://ai-computer-centre.vercel.app', 
    cleartext: true,
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: '',
      keystorePassword: '',
      keystoreAliasPassword: '',
      releaseType: 'APK',
    }
  }
};

export default config;
