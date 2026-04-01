import { TOPICS } from '../../../constants';
import TopicButton from '../../../components/TopicButton';

interface Props {
  active: string | null;
  onChange: (topic: string | null) => void;
}

export default function TopicFilter({ active, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
      <TopicButton
        active={active === null}
        onClick={() => onChange(null)}
        className="shrink-0 px-4 py-1.5"
      >
        All
      </TopicButton>

      {TOPICS.map((topic) => {
        const isActive = active === topic.toLowerCase();
        return (
          <TopicButton
            key={topic}
            active={isActive}
            onClick={() => onChange(isActive ? null : topic.toLowerCase())}
            className="shrink-0 px-4 py-1.5"
          >
            {topic}
          </TopicButton>
        );
      })}
    </div>
  );
}
