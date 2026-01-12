import {SplashScreen, Stack} from "expo-router";
import { useFonts } from 'expo-font';
import { useEffect} from "react";

import './globals.css';
import * as Sentry from '@sentry/react-native';
import useAuthStore from "@/store/auth.store";
import { StripeProvider } from '@stripe/stripe-react-native'; //

Sentry.init({
  dsn: 'https://94edd17ee98a307f2d85d750574c454a@o4506876178464768.ingest.us.sentry.io/4509588544094208',
  sendDefaultPii: true,
  replaysSessionSampleRate: 1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],
});

export default Sentry.wrap(function RootLayout() {
  const { isLoading, fetchAuthenticatedUser } = useAuthStore(); //

  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require('../assets/fonts/Quicksand-Bold.ttf'),
    "QuickSand-Medium": require('../assets/fonts/Quicksand-Medium.ttf'),
    "QuickSand-Regular": require('../assets/fonts/Quicksand-Regular.ttf'),
    "QuickSand-SemiBold": require('../assets/fonts/Quicksand-SemiBold.ttf'),
    "QuickSand-Light": require('../assets/fonts/Quicksand-Light.ttf'),
  }); //

  useEffect(() => {
    if(error) throw error;
    if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]); //

  useEffect(() => {
    fetchAuthenticatedUser()
  }, []); //

  if (!fontsLoaded) return null; //

  return (
      <StripeProvider
          publishableKey="pk_test_51SokE3ER1iGvWeLMhZnuTjK28kfkFPitLL6pgWInitmoiiFhqrM2ao1Fnac6XZuvxiGYogXGimsisYGnk8C7fxz800LiVCdZj9"
          merchantIdentifier="merchant.com.fastfood"
      >
        <Stack screenOptions={{ headerShown: false }} />
      </StripeProvider>
  );
});