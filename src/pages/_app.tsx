import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from 'react-hot-toast';

import { trpc } from "../utils/trpc";
import GlobalContextProvider from "../components/contexts/GlobalContextProvider";

import "../styles/globals.css";


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      {/* react-hot-toast全局 */}
      <Toaster />
      {/* 全局Context注入 */}
      <GlobalContextProvider>
        <Component {...pageProps} />
      </GlobalContextProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
