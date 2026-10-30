import { useRouteError, isRouteErrorResponse, Link } from "react-router";

function RootErrorBoundary() {
  let error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>
          Error Boundary:
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
        <Link to="/">Back</Link>
      </>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error Boundary</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
        <Link to="/">Back</Link>
      </div>
    );
  } else {
    return (
      <>
        <h1>Unknown Error</h1>
        <Link to="/">Back</Link>
      </>
    );
  }
}

export default RootErrorBoundary;
