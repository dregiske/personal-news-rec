import { Link } from 'react-router-dom';
import { btnPrimary, pageTitle, bodyText } from '../styles';

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
        <h1 className={`${pageTitle} text-2xl mb-3`}>{title}</h1>
        <p className={`${bodyText} mb-8`}>{message}</p>
        {action && (
          action.href ? (
            <Link to={action.href} className={`inline-block ${btnPrimary}`}>
              {action.label}
            </Link>
          ) : (
            <button onClick={action.onClick} className={btnPrimary}>
              {action.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}
