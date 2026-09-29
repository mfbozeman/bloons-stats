import { useRouteError, isRouteErrorResponse } from "react-router";

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
      </>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error Boundary</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export default RootErrorBoundary;
