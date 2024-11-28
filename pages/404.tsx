import Head from "next/head";
import styled from "@emotion/styled";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Error 404</title>
      </Head>

      <PageWrapper>
        <Main>
          <Inner>
            <h2>😢</h2>
            <h1>Error 404</h1>
            <p>Page Not Found</p>
          </Inner>
        </Main>
      </PageWrapper>
    </>
  );
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  border: 2px solid var(--color-black);
  border-radius: var(--base-border-radius);
  margin: 2.5rem;
  height: calc(100vh - (2.5rem * 2));
  overflow: hidden;
`;

const Main = styled.main`
  padding: 2.5rem;
  overflow: auto;
  text-align: center;
`;

const Inner = styled.div`
  width: 100%;
  margin: 0 auto;

  h2 {
    font-size: clamp(32px, 5vw, 64px);
  }

  h1 {
    font-size: clamp(46px, 7.5vw, 92px);
  }
`;
