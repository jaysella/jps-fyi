import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="robots" content="noindex" />
          <link
            href="https://fonts.googleapis.com/css2?family=Bellota+Text:ital,wght@0,300;1,700&display=swap"
            rel="stylesheet"
          />
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="More to come..." />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://jps.fyi/" />
          <meta property="og:title" content="JPS.fyi" />
          <meta property="og:description" content="More to come..." />
          <meta
            property="og:image"
            content="https://media.jps.fyi/image/upload/v1621218962/Jay_s_Icon_-_Rounded_-_Color_ke5qiz.png"
          />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://jps.fyi/" />
          <meta property="twitter:title" content="JPS.fyi" />
          <meta property="twitter:description" content="More to come..." />
          <meta
            property="twitter:image"
            content="https://media.jps.fyi/image/upload/v1621218962/Jay_s_Icon_-_Rounded_-_Color_ke5qiz.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
