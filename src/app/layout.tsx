'use client'

import { Inter } from 'next/font/google';

import { Auth0Provider } from '@auth0/auth0-react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const onRedirectCallback = (appState: any) => {
    location.href = (
      appState && appState.returnTo ? appState.returnTo : window.location.pathname
    );
  };

  return (
    <Auth0Provider
      domain="dev-z1noh6-s.auth0.com"
      clientId="dRyzctMsuzWmUP6IFzEmx7TuJVWi2nEi"
      onRedirectCallback={onRedirectCallback}
      authorizationParams={{
        redirect_uri: process.env.NEXT_PUBLIC_SERVER_URL,
      }}
    >
      <html lang="kr">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </Auth0Provider>
  );
}
