import { css, Global, keyframes } from "@emotion/react";
// import styled from "@emotion/styled";

export const globalStyles = (
  <Global
    styles={css`
      :root {
        --color-black: #073c53;
        --color-white: #ebf0f2;
        --color-primary: #1d3669;
        --color-secondary: #39a9db;
        --color-tertiary: #ff8552;
        --color-highlight: #ffdf64;

        --color-black-muted: #20323b;
        --color-white-muted: #ced8db;

        --base-border-radius: 10px;

        --base-border-width: 2px;

        --font-sans-serif: "Bellota Text", -apple-system, BlinkMacSystemFont,
          Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
          Helvetica Neue, sans-serif;

        --font-weight-light: 300;
        --font-weight-medium: 700;
        --font-weight-bold: 700;

        --base-transition-in-duration: 0.1s;
        --base-transition-out-duration: 0.175s;

        --loader-size: 1.25rem;
      }

      html {
        text-size-adjust: 100%;
        box-sizing: border-box;
        overflow-y: auto;
      }

      body {
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
        background-color: var(--color-white);
        color: var(--color-black);
        font-family: var(--font-sans-serif);
        font-weight: var(--font-weight-bold);
        overflow-wrap: break-word;
        font-kerning: normal;
        font-feature-settings: "kern", "liga", "clig", "calt";
      }

      * {
        box-sizing: inherit;
        margin: 0;
        padding: 0;
        outline: none;
      }

      img,
      svg {
        user-drag: none;
        user-select: none;
      }

      a {
        text-decoration: none;
      }

      button {
        all: initial;
        cursor: pointer;
        font-size: inherit;
        font-family: var(--font-sans-serif);
        font-weight: var(--font-weight-bold);
      }

      input {
        font-family: var(--font-sans-serif);
        font-size: 100%;
        line-height: 1.2;
      }

      :disabled {
        cursor: not-allowed;
      }

      p {
        padding-top: 2px;
        line-height: 1.3;
      }
    `}
  />
);

export const linkStyles = css`
  cursor: pointer;
`;

export const fadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeInDownAnimation = keyframes`
  from {
    transform: translateY(-.25rem);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;
