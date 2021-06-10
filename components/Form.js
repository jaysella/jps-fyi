import styled from "@emotion/styled";
import { Form, Field } from "formik";
import AlertCircleIcon from "./svg/AlertCircle";
import AlertTriangleIcon from "./svg/AlertTriangle";
import { css } from "@emotion/react";

export function FormWrapper({ children, hidden }) {
  return <FormElement hidden={hidden || false}>{children}</FormElement>;
}

export function InputGroup({ children }) {
  return <InputGroupWrapper>{children}</InputGroupWrapper>;
}

export function InputLabel({ children, ...props }) {
  return <InputLabelWrapper {...props}>{children}</InputLabelWrapper>;
}

export function Input({ children, ...props }) {
  return <InputWrapper {...props}>{children}</InputWrapper>;
}

export function InputError({ children, ...props }) {
  return (
    <ErrorWrapper {...props}>
      <AlertTriangleIcon />
      <span>{children}</span>
    </ErrorWrapper>
  );
}

export function InputInfo({ children, ...props }) {
  return (
    <InfoWrapper {...props}>
      <AlertCircleIcon />
      <span>{children}</span>
    </InfoWrapper>
  );
}

export function ActionGroup({ children }) {
  return <ActionGroupWrapper>{children}</ActionGroupWrapper>;
}

const FormElement = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  display: ${(props) => (props.hidden ? "none" : "flex")};
`;

const InputGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InputLabelWrapper = styled.label`
  font-size: 0.8em;
  text-transform: uppercase;
  color: var(--color-black-muted);
`;

const InputWrapper = styled(Field)`
  border: var(--base-border-width) solid transparent;
  background-color: var(--color-white-muted);
  border-radius: calc(var(--base-border-radius) / 1.25);
  font-family: var(--font-sans-serif);
  font-size: 18px;
  font-weight: var(--font-weight-bold);
  padding: calc(0.85rem + 2px) 1rem 0.85rem;
  color: var(--color-black);
  transition: box-shadow var(--base-transition-out-duration) ease-out,
    background-color var(--base-transition-out-duration) ease-out;

  box-shadow: ${(props) =>
    props.invalid && "0 0 0 var(--base-border-width) var(--color-tertiary)"};

  i {
    color: currentColor;
  }

  ::placeholder {
    color: var(--color-white-muted);
  }

  &:focus {
    border-color: var(--color-primary);

    transition: box-shadow var(--base-transition-in-duration) ease-in,
      background-color var(--base-transition-in-duration) ease-in;
  }

  :disabled {
    position: relative;
    padding-right: 40px;
    background-image: url("data:image/svg+xml,%0A%3Csvg width='20' height='22' viewBox='0 0 20 22' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M17 10H3C1.89543 10 1 10.8954 1 12V19C1 20.1046 1.89543 21 3 21H17C18.1046 21 19 20.1046 19 19V12C19 10.8954 18.1046 10 17 10Z' stroke='%2390a2ab' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M5 10V6C5 4.67392 5.52678 3.40215 6.46447 2.46447C7.40215 1.52678 8.67392 1 10 1C11.3261 1 12.5979 1.52678 13.5355 2.46447C14.4732 3.40215 15 4.67392 15 6V10' stroke='%2390a2ab' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
    background-size: 14px;
    background-repeat: no-repeat;
    background-position: right 18px top 48%;
  }

  &[type="date"] {
    padding: 0.75rem 1rem;

    ::-webkit-calendar-picker-indicator {
      cursor: pointer;
      border-radius: var(--base-border-radius);
      opacity: 0.5;
      filter: invert(1);
      transition: opacity var(--base-transition-out-duration) ease-out;

      &:hover {
        opacity: 1;
        transition: opacity var(--base-transition-in-duration) ease-in;
      }
    }
  }
`;

const feedbackStyles = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.65rem;
  margin: 0.25rem 0 0.5rem;
  font-size: 0.85em;
  font-weight: var(--font-weight-medium);

  span {
    margin-top: 2px;
  }
`;

const feedbackAnimation = css``;

const ErrorWrapper = styled.div`
  ${feedbackStyles};
  color: var(--color-tertiary);
  ${(props) => props.animated && feedbackAnimation};
`;

const InfoWrapper = styled.div`
  ${feedbackStyles};
  color: var(--color-secondary);
  ${(props) => props.animated && feedbackAnimation};
`;

const ActionGroupWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
`;
