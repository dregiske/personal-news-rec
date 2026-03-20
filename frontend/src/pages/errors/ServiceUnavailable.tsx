import ErrorPage from '../../components/ErrorPage';

export default function ServiceUnavailable() {
  return (
    <ErrorPage
      code="503"
      title="Service Unavailable"
      message="We're temporarily down for maintenance or experiencing high load. Please check back shortly."
    />
  );
}
