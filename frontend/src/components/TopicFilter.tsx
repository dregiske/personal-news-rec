import { TOPICS } from '../constants';

interface Props {
  active: string | null;
  onChange: (topic: string | null) => void;
}

export default function TopicFilter({ active, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
      <button
        onClick={() => onChange(null)}
        className={`shrink-0 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 border transition-colors duration-200 ${
          active === null
            ? 'border-fray-primary text-fray-primary'
            : 'border-fray-border text-fray-text-faint hover:border-fray-primary hover:text-fray-primary'
        }`}
      >
        All
      </button>

      {TOPICS.map((topic) => {
        const isActive = active === topic.toLowerCase();
        return (
          <button
            key={topic}
            onClick={() => onChange(isActive ? null : topic.toLowerCase())}
            className={`shrink-0 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 border transition-colors duration-200 ${
              isActive
                ? 'border-fray-primary text-fray-primary'
                : 'border-fray-border text-fray-text-faint hover:border-fray-primary hover:text-fray-primary'
            }`}
          >
            {topic}
          </button>
        );
      })}
    </div>
  );
}
