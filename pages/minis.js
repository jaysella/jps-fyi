import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import styled from "@emotion/styled";
import Head from "next/head";
import { useEffect, useState } from "react";
import Button, { ButtonIcon } from "../components/Button";
import AlertTriangleIcon from "../components/svg/AlertTriangle";
import ArrowRightCircleIcon from "../components/svg/ArrowRightCircle";
import EditIcon from "../components/svg/Edit";
import EyeIcon from "../components/svg/Eye";
import TrashCanIcon from "../components/svg/TrashCan";
import { timeSinceFromTimestamp } from "../helpers/timeSince";

function Mini() {
  const [faunaError, setFaunaError] = useState(false);
  const [minis, setMinis] = useState();

  async function fetchMinis() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    await fetch("/api/minis", requestOptions)
      .then((response) => response.json())
      .then((response) => JSON.parse(response))
      .then((r) => {
        if (r.error) {
          console.log("Error:", r.error);
          setFaunaError(
            r.message || r.description || r.error?.message || r.error
          );
        } else {
          setMinis(r.success.minis.data);
        }
      })
      .catch((error) => {
        console.error(error);
        setFaunaError(error.message);
      });
  }

  useEffect(() => {
    fetchMinis();
  }, []);

  async function deleteMini(miniRef) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    await fetch(`/api/mini/${miniRef}/delete`, requestOptions)
      .then((response) => response.json())
      .then((response) => JSON.parse(response))
      .then((r) => {
        if (r.error) {
          console.log("Error:", r.error);
          setFaunaError(
            r.message || r.description || r.error?.message || r.error
          );
        } else {
          // Refresh list
          fetchMinis();
        }
      })
      .catch((error) => {
        console.error(error);
        setFaunaError(error.message);
      });
  }

  return (
    <>
      <Head>
        <title>Minis | JPS</title>
      </Head>

      <PageWrapper>
        <Main>
          <Inner>
            <h2>👋</h2>
            <h1>All Minis</h1>

            <Widget>
              {faunaError && (
                <ErrorBlock>
                  <WarningIconWrapper>
                    <AlertTriangleIcon />
                  </WarningIconWrapper>

                  <h2>Error Encountered</h2>
                  <p>
                    {faunaError ||
                      "An error was encountered — please try again later"}
                  </p>
                </ErrorBlock>
              )}

              {minis && minis.length > 1 ? (
                <>
                  {minis.reverse().map((mini) => (
                    <MiniBlock key={mini.ref["@ref"].id}>
                      <Details>
                        <Time>
                          {`${timeSinceFromTimestamp(
                            mini.data.createdAt["@ts"]
                          )} ago`.toUpperCase()}
                        </Time>
                        <h3>{mini.data.mini}</h3>
                        <p>{mini.data.destination}</p>
                      </Details>

                      <Actions>
                        <Button
                          aria-label="Delete"
                          onClick={() => deleteMini(mini.ref["@ref"].id)}
                          iconOnly
                        >
                          <ButtonIcon>
                            <TrashCanIcon />
                          </ButtonIcon>
                        </Button>
                        <Button
                          aria-label="Edit"
                          href={`/mini/${mini.data.mini}/edit`}
                          iconOnly
                        >
                          <ButtonIcon>
                            <EditIcon />
                          </ButtonIcon>
                        </Button>
                        <Button
                          aria-label="Open"
                          href={mini.data.destination}
                          target="_blank"
                          iconOnly
                        >
                          <ButtonIcon>
                            <EyeIcon />
                          </ButtonIcon>
                        </Button>
                      </Actions>
                    </MiniBlock>
                  ))}

                  <Button href="/mini" fullWidth>
                    Create New
                    <ButtonIcon>
                      <ArrowRightCircleIcon />
                    </ButtonIcon>
                  </Button>
                </>
              ) : (
                <h2>Loading...</h2>
              )}
            </Widget>
          </Inner>

          <Footer>&copy; {new Date().getFullYear()} Jay Sella</Footer>
        </Main>
      </PageWrapper>
    </>
  );
}

export default withPageAuthRequired(Mini);

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

const Widget = styled.div`
  margin: 1.5rem auto 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  max-width: 500px;
  overflow: hidden;
`;

const MiniBlock = styled.div`
  border: var(--base-border-width) solid var(--color-white-muted);
  border-radius: var(--base-border-radius);
  padding: 1rem;
  text-align: left;

  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.25rem;
  width: 100%;
  word-break: break-all;
`;

const Details = styled.div`
  h3 {
    font-size: clamp(28px, 3.25vw, 38px);
  }
`;

const Time = styled.p`
  font-size: 0.75em;
`;

const Actions = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.25rem;

  button,
  a {
    height: min-content;

    svg {
      height: 16px;
      width: 16px;
    }
  }
`;

const Footer = styled.footer`
  margin: 2rem 0 auto;
  padding: 1.5rem;
`;

const ErrorBlock = styled.div`
  padding: 1.5rem;
  border-radius: var(--base-border-radius);
  border: var(--base-border-width) solid var(--color-black-muted);
  border-color: var(--color-tertiary);
  transition: border calc(var(--base-transition-out-duration) * 2) 0.5s ease-out;

  &:hover {
    transition: border calc(var(--base-transition-in-duration) * 2) ease-in;
  }

  h2 {
    font-size: 0.8em;
    text-transform: uppercase;
    margin-bottom: 0.75rem;
    color: var(--color-tertiary);
  }

  p:not(:first-of-type) {
    margin-top: 0.75rem;
  }
`;

const WarningIconWrapper = styled.div`
  margin-bottom: 1.25rem;
  color: var(--color-tertiary);

  svg {
    width: 2.5rem;
    height: auto;
  }
`;
