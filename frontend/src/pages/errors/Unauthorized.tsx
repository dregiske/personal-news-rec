import ErrorPage from '../../components/ErrorPage';

export default function Unauthorized() {
  return (
    <ErrorPage
      code="401"
      title="Unauthorized"
      message="You need to be signed in to view this page."
      action={{ label: 'Sign In', href: '/login' }}
    />
  );
}
