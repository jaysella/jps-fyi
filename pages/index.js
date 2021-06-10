import Head from "next/head";
import styled from "@emotion/styled";

export default function Home() {
  return (
    <PageWrapper>
      {/* <Head>
        <title></title>
      </Head> */}

      <Main>
        <h1>👋</h1>
      </Main>

      <Footer>&copy; {new Date().getFullYear()} Jay Sella</Footer>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  /* min-height: 100vh; */
  border: 2px solid var(--color-black);
  border-radius: 20px;
  margin: 2.5rem;
  height: calc(100vh - (2.5rem * 2));
  overflow: hidden;
`;

const Main = styled.main`
  padding: 2.5rem;
  margin: 0 auto;
  overflow: auto;

  h1 {
    font-size: 5em;
  }
`;

const Footer = styled.footer`
  padding: 1.5rem;
  margin: 0 auto;
`;
