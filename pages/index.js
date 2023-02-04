import Head from "next/head";
import Button, { ButtonIcon } from "../components/Button";
import ArrowRightCircleIcon from "../components/svg/ArrowRightCircle";
import styled from "@emotion/styled";

export default function Home() {
  return (
    <>
      <Head>
        <title>👋 | JPS</title>
      </Head>

      <PageWrapper>
        <Main>
          <Inner>
            <h1>👋</h1>

            <Actions>
              <Actions>
                <Button href="https://jaysella.com">
                  Portfolio
                  <ButtonIcon>
                    <ArrowRightCircleIcon />
                  </ButtonIcon>
                </Button>
                <Button href="https://jps.fyi/resume">
                  Résumé
                  <ButtonIcon>
                    <ArrowRightCircleIcon />
                  </ButtonIcon>
                </Button>
              </Actions>
            </Actions>
          </Inner>

          <Footer>&copy; {new Date().getFullYear()} Jay Sella</Footer>
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

const Actions = styled.div`
  margin: 1rem auto 0;
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
`;

const Footer = styled.footer`
  margin: 2rem 0 auto;
  padding: 1.5rem;
`;

// const PageWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-content: center;
//   border: 2px solid var(--color-black);
//   border-radius: 20px;
//   margin: 2.5rem;
//   height: calc(100vh - (2.5rem * 2));
//   overflow: hidden;
// `;

// const Main = styled.main`
//   padding: 2.5rem;
//   margin: 0 auto;
//   overflow: auto;

//   h1 {
//     font-size: 5em;
//   }
// `;

// const Actions = styled.div`
//   margin-top: 2.5rem;
//   display: flex;
//   flex-direction: row;
//   gap: 0.75rem;
// `;

// const Footer = styled.footer`
//   padding: 1.5rem;
//   margin: 0 auto;
// `;
