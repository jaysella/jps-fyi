import redirect from "nextjs-redirect";

export default function Redirect({ children, to }) {
  const Redirect = redirect(to);

  return <Redirect>{children}</Redirect>;
}
