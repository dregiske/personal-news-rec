import { useState, type ReactNode } from "react";
import { DEFAULT_DURATION } from "../constants";

export interface CarouselItem {
  headline: string;
  body: string;
  icon: ReactNode;
}

interface Props {
  items: CarouselItem[];
  durationSeconds?: number;
}

/**
 * Continuous horizontal ticker carousel.
 * Cards scroll right-to-left in an infinite loop.
 * Hovering pauses the scroll and triggers fray-lift on each card.
 */
export default function Carousel({
  items,
  durationSeconds = DEFAULT_DURATION,
}: Props) {
  const [paused, setPaused] = useState(false);

  const track = [...items, ...items];

  return (
    <div
      className="overflow-hidden py-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex gap-6 w-max"
        style={{
          animation: `fray-ticker ${durationSeconds}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {track.map((item, i) => (
          <div
            key={i}
            className="fray-lift rounded-2xl w-72 shrink-0 cursor-default"
          >
            <div className="bg-fray-surface rounded-2xl shadow-fray-sm p-6 h-full">
              <div className="w-10 h-10 rounded-xl bg-fray-primary/10 text-fray-primary flex items-center justify-center mb-4">
                <div className="w-5 h-5">{item.icon}</div>
              </div>
              <h3 className="text-base font-bold text-fray-text mb-2">
                {item.headline}
              </h3>
              <p className="text-sm text-fray-text-light leading-relaxed">
                {item.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
