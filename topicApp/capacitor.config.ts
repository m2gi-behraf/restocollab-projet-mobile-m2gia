import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'topicApp',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      androidClientId: '322642081353-nq896as543vke18b7ifeqvuq3tj8p2m7.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
