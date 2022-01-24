import * as React from "react";
import type { AppProps } from "next/app";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
// import { AuthCtxProvider } from "~/contexts/AuthCtx";
// import { UserCtxProvider } from "~/contexts/UserCtx";
// import { PostCtxProvider } from "~/contexts/PostCtx";
import { SnackbarProvider } from "notistack";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import createEmotionCache from "../utils/createEmotionCache";
import { themeOptions } from "../styles/theme/lightThemeOptions";

// import "../styles/globals.css";
import Layout from "~/layout/Layout";
import { TagCtxProvider } from "~/contexts/TagCtx";
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const lightTheme = createTheme(themeOptions);

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      {/* <AuthCtxProvider> */}
      {/* <UserCtxProvider> */}
      {/* <TagCtxProvider> */}
      {/* <PostCtxProvider> */}
      <SnackbarProvider>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </SnackbarProvider>
      {/* </PostCtxProvider> */}
      {/* </TagCtxProvider> */}
      {/* </UserCtxProvider> */}
      {/* </AuthCtxProvider> */}
    </CacheProvider>
  );
};

export default MyApp;
