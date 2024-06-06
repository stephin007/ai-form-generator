// pages/_app.js
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
import '../styles/global.css';

import { AuthProvider } from '../../AuthContext';


function MyApp({ Component, pageProps }) {
    return (
        <>
        <AuthProvider>
            <Head>
                <title>Formify AI - Generate Forms with AI</title>
                <meta name="description" content="Formify AI helps you generate forms using AI. Create user-friendly and meaningful forms in just a few steps." />
                <meta property="og:title" content="Formify AI - Generate Forms with AI" />
                <meta property="og:description" content="Formify AI helps you generate forms using AI. Create user-friendly and meaningful forms in just a few steps." />
                <meta property="og:url" content="formifyai.vercel.app" />
                <meta name="twitter:title" content="Formify AI - Generate Forms with AI" />
                <meta name="twitter:description" content="Formify AI helps you generate forms using AI. Create user-friendly and meaningful forms in just a few steps." />
            </Head>
            <Component {...pageProps} />
            <Analytics />
            </AuthProvider>
        </>
    );
}

export default MyApp;
