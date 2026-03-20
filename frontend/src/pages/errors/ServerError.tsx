import ErrorPage from '../../components/ErrorPage';

export default function ServerError() {
  return (
    <ErrorPage
      code="500"
      title="Something Went Wrong"
      message="An unexpected error occurred on our end. Try refreshing the page or come back later."
      action={{ label: 'Refresh', onClick: () => window.location.reload() }}
    />
  );
}
