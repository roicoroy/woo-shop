import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'woo.shop.standalone',
  appName: 'Woo Shop',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
