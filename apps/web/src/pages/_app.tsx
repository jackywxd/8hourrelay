import type { AppProps } from "next/app";
import { AuthContextProvider } from "@/context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "../styles/global.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <SafeAreaProvider>
        <Component {...pageProps} />
      </SafeAreaProvider>
    </AuthContextProvider>
  );
}
