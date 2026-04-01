import { TOPICS } from "../constants";
import TopicButton from "./TopicButton";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function TopicToggler({ value, onChange }: Props) {
  function toggle(topic: string) {
    const current = value ? value.split(",").filter(Boolean) : [];
    const lower = topic.toLowerCase();
    const next = current.includes(lower)
      ? current.filter((t) => t !== lower)
      : [...current, lower];
    onChange(next.join(","));
  }

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {TOPICS.map((topic) => (
        <TopicButton
          key={topic}
          active={value.split(",").includes(topic.toLowerCase())}
          onClick={() => toggle(topic)}
        >
          {topic}
        </TopicButton>
      ))}
    </div>
  );
}
