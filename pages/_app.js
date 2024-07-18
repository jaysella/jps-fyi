"use client";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Fragment } from "react";
import { globalStyles } from "../shared/styles";

function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout ? Component.Layout : Fragment;

  return (
    <UserProvider>
      {globalStyles}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  );
}

export default MyApp;
