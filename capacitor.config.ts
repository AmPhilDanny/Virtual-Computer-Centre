import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fhinovax.virtualcentre',
  appName: 'Fhinovax Virtual Centre',
  webDir: 'public',
  server: {
    // Points to the live production site
    url: 'https://virtual-computer-centre.vercel.app', 
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
