import ErrorPage from '../../components/ErrorPage';

export default function Forbidden() {
  return (
    <ErrorPage
      code="403"
      title="Access Denied"
      message="You don't have permission to access this page."
      action={{ label: 'Go Home', href: '/' }}
    />
  );
}
