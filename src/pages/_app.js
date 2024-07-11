// pages/_app.js
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../styles/global.css";

import { AuthProvider } from "../../AuthContext";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <AuthProvider>
        <Head>
          <title>Formify AI - Generate Forms with AI</title>
          <meta
            name="description"
            content="Formify AI helps you generate forms using AI. Create user-friendly and meaningful forms in just a few steps."
          />
          <meta
            property="og:title"
            content="Formify AI - Generate Forms with AI"
          />
          <meta
            property="og:description"
            content="Formify AI helps you generate forms using AI. Create user-friendly and meaningful forms in just a few steps."
          />
          <meta property="og:url" content="formifyai.in" />
          <meta
            name="twitter:title"
            content="Formify AI - Generate Forms with AI"
          />
          <meta
            name="twitter:description"
            content="Formify AI helps you generate forms using AI. Create user-friendly and meaningful forms in just a few steps."
          />
        </Head>
        <Component {...pageProps} />
        <Analytics />
        <SpeedInsights />
      </AuthProvider>
    </>
  );
}

export default MyApp;
