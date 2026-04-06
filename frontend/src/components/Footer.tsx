import { Link } from "react-router-dom";
import FooterCard from "./FooterCard";
import BrandName from "./BrandName";
import { FOOTER_LINKS, APP_NAME, APP_TAGLINE } from "../constants";
import { sectionLabel } from "../styles";

export default function Footer() {
  return (
    <footer>
      <FooterCard>
        <div className="flex flex-col gap-10">
          {/* Main grid: brand col + link columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <p className="text-2xl font-bold tracking-tight text-fray-ink mb-3">
                <BrandName />
              </p>
              <p className="text-sm font-medium text-fray-bg mb-2">
                {APP_TAGLINE}
              </p>
              <p className="text-sm text-fray-muted leading-relaxed">
                Personalized news that learns from you. Stay informed, stay
                ahead.
              </p>
            </div>

            {/* Link columns */}
            {FOOTER_LINKS.map((group) => (
              <div key={group.heading}>
                <p className={`${sectionLabel} text-fray-muted mb-4`}>
                  {group.heading}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-sm text-fray-muted hover:text-fray-ink transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-fray-text-light/20 pt-6 flex items-center justify-between flex-wrap gap-4">
            <p className="text-xs text-fray-muted">
              © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
            <p className="text-xs text-fray-muted">
              Built by{" "}
              <a
                href="https://www.andregiske.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-fray-ink transition-colors duration-200"
              >
                Andre Giske
              </a>
            </p>
          </div>
        </div>
      </FooterCard>
    </footer>
  );
}
