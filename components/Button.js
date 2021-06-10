import React from "react";
import Link from "next/link";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { linkStyles } from "../shared/styles";

export default function Button({
  children,
  href,
  fullWidth,
  borderless,
  ...props
}) {
  return (
    <>
      {href && href.length > 0 ? (
        <Link href={href} passHref>
          <LinkWrapper
            fullWidth={fullWidth || false}
            borderless={borderless || false}
            {...props}
          >
            {children}
          </LinkWrapper>
        </Link>
      ) : (
        <ButtonWrapper
          fullWidth={fullWidth || false}
          borderless={borderless || false}
          {...props}
        >
          {children}
        </ButtonWrapper>
      )}
    </>
  );
}

export function ButtonIcon({ children }) {
  return <IconWrapper>{children}</IconWrapper>;
}

export const IconWrapper = styled.div`
  color: var(--color-white-muted);
  transition: color var(--base-transition-in-duration) ease-out;

  svg {
    display: block;
    height: 20px;
    width: 20px;
  }
`;

export const buttonStyles = css`
  ${linkStyles};

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1rem calc(0.6rem - 1px);
  background: transparent;
  border: var(--base-border-width) solid transparent;
  border-radius: calc(var(--base-border-radius) / 1.5);
  color: var(--color-white);
  font-family: var(--font-sans-serif);
  font-size: 16px;
  text-align: center;
  transition: all 0.2s ease;

  &:disabled {
    background: var(--color-white-muted);
    color: var(--color-black);

    svg {
      color: var(--color-black);
    }
  }

  &:hover,
  &:focus {
    &:not(:disabled) {
      background: var(--color-white-muted);
      color: var(--color-black);

      svg {
        color: var(--color-black);
      }

      > div {
        transition: color var(--base-transition-out-duration) ease-in;
        color: var(--color-white);
      }
    }
  }

  :disabled {
    cursor: not-allowed;
  }
`;

export const ButtonWrapper = styled.button`
  ${buttonStyles};
  border-color: ${(props) => (props.borderless ? "" : "var(--color-primary)")};
  width: ${(props) => (props.fullWidth ? "100%" : "max-content")};
  background: var(--color-primary);
`;

export const LinkWrapper = styled.a`
  ${buttonStyles};
  border-color: ${(props) => (props.borderless ? "" : "var(--color-primary)")};
  width: ${(props) => (props.fullWidth ? "100%" : "max-content")};
  background: var(--color-primary);
`;
