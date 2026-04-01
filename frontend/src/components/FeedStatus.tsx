interface Props {
  loading: boolean;
  error: string;
  empty: boolean;
  emptyMessage: string;
}

export default function FeedStatus({ loading, error, empty, emptyMessage }: Props) {
  if (loading) return <p className="pt-15 text-center text-fray-text-light mt-16">Loading...</p>;
  if (error) return <p className="pt-15 text-center text-fray-danger mt-16">{error}</p>;
  if (empty) return <p className="text-sm text-fray-text-faint mt-8">{emptyMessage}</p>;
  return null;
}
