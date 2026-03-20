import { Link } from 'react-router-dom';

interface Action {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface Props {
  code: string;
  title: string;
  message: string;
  action?: Action;
}

export default function ErrorPage({ code, title, message, action }: Props) {
  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-7xl font-bold text-fray-primary mb-4">{code}</p>
        <h1 className="text-2xl font-bold text-fray-text mb-3">{title}</h1>
        <p className="text-sm text-fray-text-light mb-8">{message}</p>
        {action && (
          action.href ? (
            <Link
              to={action.href}
              className="inline-block px-6 py-2.5 bg-fray-primary text-fray-ink text-sm font-semibold hover:bg-fray-primary-hover transition-colors duration-200"
            >
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="px-6 py-2.5 bg-fray-primary text-fray-ink text-sm font-semibold hover:bg-fray-primary-hover transition-colors duration-200"
            >
              {action.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}
