import HeroCard from "../components/HeroCard";
import Carousel from "../components/Carousel";
import BrandName from "../components/BrandName";
import { HOME_FEATURES, APP_NAME, APP_TAGLINE } from "../constants";
import { sectionLabel } from "../styles";

export default function Home() {
  return (
    <div className="pt-15">
      <HeroCard
        eyebrow="Personalized news"
        title={<BrandName />}
        tagline={APP_TAGLINE}
        description="Stay ahead with a news feed that learns what matters to you — personalized, fresh, and entirely yours."
        buttons={[
          { label: "Get started", to: "/signup", variant: "primary" },
          { label: "Log in", to: "/login", variant: "secondary" },
        ]}
      />

      <section className="py-20">
        <p className={`${sectionLabel} text-center mb-10 px-6`}>
          Why {APP_NAME}
        </p>
        <Carousel items={HOME_FEATURES} />
      </section>
    </div>
  );
}
