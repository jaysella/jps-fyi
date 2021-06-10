import { useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Head from "next/head";
import { Formik, FormikConsumer } from "formik";
import * as Yup from "yup";
// import Link from "next/link";
import {
  FormWrapper,
  InputGroup,
  InputLabel,
  Input,
  InputError,
  ActionGroup,
} from "../components/Form";
import Button, { ButtonIcon } from "../components/Button";
import ArrowRightCircleIcon from "../components/svg/ArrowRightCircle";
// import XCircleIcon from "../svg/XCircle";
import AlertTriangleIcon from "../components/svg/AlertTriangle";
// import CheckmarkCircle from "../CheckmarkCircle";
// import Loader from "../Loader";
// import { css } from "@emotion/react";
import styled from "@emotion/styled";

const miniSchema = Yup.object().shape({
  destination: Yup.string()
    .url("Please enter a valid URL")
    .required("Required"),
  mini: Yup.string()
    .min(2, "Too short! Please enter at least 2 characters")
    .max(7, "Too long! Please keep to 7 characters"),
});

const domain = "jps.fyi";

function Mini() {
  const [faunaError, setFaunaError] = useState(false);
  const [miniCreated, setMiniCreated] = useState(false);
  const [createdMini, setCreatedMini] = useState();

  function generateString(length) {
    const string = [...Array(length)]
      .map((i) => (~~(Math.random() * 36)).toString(36))
      .join("");
    return string;
  }

  async function handleSubmit(values) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    };

    await fetch("/api/mini/new", requestOptions)
      .then((response) => response.json())
      .then((r) => {
        if (r.error) {
          console.log("Error:", r.error);
          setFaunaError(
            r.message || r.description || r.error?.message || r.error
          );
        } else {
          console.log(r);
          setMiniCreated(true);
          setCreatedMini(r.success.miniRequest.data);
          navigator.clipboard.writeText(
            `https://${domain}/${r.success.miniRequest.data.mini}`
          );
        }
      })
      .catch((error) => {
        console.error(error);
        setFaunaError(error.message);
      });
  }

  function resetForm() {
    setFaunaError(false);
    setMiniCreated(false);
  }

  return (
    <>
      <Head>
        <title>New Mini | JPS</title>
      </Head>

      <PageWrapper>
        <Main>
          <Inner>
            <h2>👋</h2>
            <h1>New Mini</h1>

            <Widget>
              <Formik
                initialValues={{
                  destination: "",
                  mini: generateString(5) || "abc",
                }}
                validationSchema={miniSchema}
                onSubmit={(values) => handleSubmit(values)}
              >
                {({ errors, touched, isSubmitting }) => (
                  <FormWrapper>
                    {!miniCreated ? (
                      <>
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

                        <InputGroup>
                          <InputLabel htmlFor="destination">
                            Destination
                          </InputLabel>
                          <Input
                            type="url"
                            id="destination"
                            name="destination"
                            placeholder="https://google.com"
                            disabled={isSubmitting}
                            invalid={
                              errors.destination && touched.destination
                                ? "invalid"
                                : null
                            }
                          />
                          {errors.destination && touched.destination && (
                            <InputError animated={true}>
                              {errors.destination}
                            </InputError>
                          )}
                        </InputGroup>

                        <InputGroup>
                          <InputLabel htmlFor="mini">Mini</InputLabel>
                          <Input
                            type="text"
                            id="mini"
                            name="mini"
                            placeholder="abc89"
                            disabled={isSubmitting}
                            invalid={
                              errors.mini && touched.mini ? "invalid" : null
                            }
                          />
                          {errors.mini && touched.mini && (
                            <InputError animated={true}>
                              {errors.mini}
                            </InputError>
                          )}
                        </InputGroup>

                        <ActionGroup>
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            fullWidth
                          >
                            Create Mini
                            <ButtonIcon>
                              {isSubmitting ? (
                                <>&lt;&gt;</>
                              ) : (
                                <ArrowRightCircleIcon />
                              )}
                            </ButtonIcon>
                          </Button>
                        </ActionGroup>
                      </>
                    ) : (
                      <>
                        <hr />
                        <h2>Rockin'!</h2>
                        <p>Your newest mini is all set.</p>

                        <FormikConsumer>
                          {(formikState) => (
                            <>
                              <InputLabel
                                htmlFor="mini"
                                style={{
                                  position: `absolute`,
                                  left: `-10000px`,
                                  top: `auto`,
                                  width: `1px`,
                                  height: `1px`,
                                  overflow: `hidden`,
                                }}
                              >
                                Mini
                              </InputLabel>
                              <Input
                                type="text"
                                id="createdMini"
                                name="createdMini"
                                value={`${domain}/${createdMini?.mini}`}
                                readOnly
                                style={{ textAlign: `center` }}
                              />
                            </>
                          )}
                        </FormikConsumer>

                        <ActionGroup>
                          <Button
                            type="reset"
                            onClick={() => resetForm()}
                            fullWidth
                          >
                            Create Another
                            <ButtonIcon>
                              <ArrowRightCircleIcon />
                            </ButtonIcon>
                          </Button>
                        </ActionGroup>
                      </>
                    )}
                  </FormWrapper>
                )}
              </Formik>
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
  width: max-content;
  margin: 0 auto;

  h2 {
    font-size: clamp(32px, 5vw, 64px);
  }

  h1 {
    font-size: clamp(46px, 7.5vw, 92px);
  }
`;

const Widget = styled.div`
  margin-top: 1.5rem;
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
