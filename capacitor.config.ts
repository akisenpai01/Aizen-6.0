
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aizen.app',
  appName: 'Aizen',
  webDir: 'out', // Next.js static export directory
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#000000', // Corresponds to your dark theme background
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      // You might want to create actual splash screen images later
      // and configure them here.
    },
  },
  // It's good practice to explicitly set bundledWebRuntime,
  // though it defaults to true which is what we want.
  bundledWebRuntime: true,
};

export default config;
