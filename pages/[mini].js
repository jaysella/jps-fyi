import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
// import { withSimpleLayout } from "../../components/layout/SimpleLayout";
// import Loader from "../../components/Loader";
import AlertTriangleIcon from "../components/svg/AlertTriangle";
import styled from "@emotion/styled";
// import { LoadingWrapper } from "../../shared/styles";
import Redirect from "../components/Redirect";

function ViewMini() {
  const router = useRouter();
  const { mini } = router.query;

  const [faunaFetchingError, setFaunaFetchingError] = useState(false);
  const [miniFetched, setMiniFetched] = useState(false);
  const [miniData, setMiniData] = useState();

  async function fetchMini() {
    if (mini) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      };

      await fetch(`/api/mini/${mini}`, requestOptions)
        .then((response) => response.json())
        .then((r) => {
          if (r.success && r.success.mini) {
            const data = r.success.mini.data;
            setMiniData(data);
            setMiniFetched(true);
          } else if (r.error) {
            console.log("Error:", r.error);
            const errorMessage =
              r.error.name === "database_error"
                ? "An error was encountered — please try again later"
                : r.error.message;
            setFaunaFetchingError(errorMessage);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  useEffect(() => {
    fetchMini();
  }, [mini]);

  let title;
  if (miniFetched) {
    title = "Redirecting...";
  } else if (faunaFetchingError || (miniData && miniData.destination)) {
    title = "Error";
  } else {
    title = "Loading...";
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <PageWrapper>
        {miniFetched ? (
          <Redirect to={miniData.destination}>
            <h1>{title}</h1>
          </Redirect>
        ) : faunaFetchingError || (miniData && miniData.destination) ? (
          <ErrorBlock>
            <WarningIconWrapper>
              <AlertTriangleIcon />
            </WarningIconWrapper>

            <h2>Error Encountered</h2>
            <p>
              {faunaFetchingError ||
                "An error was encountered — please try again later"}
            </p>
          </ErrorBlock>
        ) : (
          // <LoadingWrapper>
          //   <Loader />
          // </LoadingWrapper>
          <>
            <h1>Loading...</h1>
          </>
        )}
      </PageWrapper>
    </>
  );
}

export default ViewMini;

const PageWrapper = styled.main`
  margin: 5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
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
