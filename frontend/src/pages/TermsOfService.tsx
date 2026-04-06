import HeroCard from "../components/HeroCard";
import PageLayout from "../components/PageLayout";
import { bodyText, pageTitle } from "../styles";
import { APP_NAME } from "../constants";

export default function TermsOfService() {
  return (
    <div className="pt-15">
      <HeroCard eyebrow="Legal" title="Terms of Service" compact />

      <PageLayout>
        <p className={`${bodyText} mb-10`}>Last updated: April 6, 2026</p>

        <section className="mb-10">
          <h2 className={`${pageTitle} mb-4`}>1. Acceptance of Terms</h2>
          <p className={bodyText}>
            By accessing or using {APP_NAME}, you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not
            use the service.
          </p>
        </section>

        <section className="mb-10">
          <h2 className={`${pageTitle} mb-4`}>2. Description of Service</h2>
          <p className={bodyText}>
            {APP_NAME} is a personalised news aggregation platform that curates
            articles from third-party sources based on your interests and
            engagement. We do not produce original news content; all articles
            are sourced from external publishers.
          </p>
        </section>

        <section className="mb-10">
          <h2 className={`${pageTitle} mb-4`}>3. Accounts</h2>
          <p className={`${bodyText} mb-4`}>
            You must create an account to access personalised features. You are
            responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li className={bodyText}>
              Maintaining the confidentiality of your login credentials.
            </li>
            <li className={bodyText}>
              All activity that occurs under your account.
            </li>
            <li className={bodyText}>
              Notifying us immediately of any unauthorised access.
            </li>
          </ul>
          <p className={`${bodyText} mt-4`}>
            You must be at least 13 years of age to create an account. Accounts
            may not be transferred to another person without our written
            consent.
          </p>
        </section>

        <section className="mb-10">
          <h2 className={`${pageTitle} mb-4`}>4. Acceptable Use</h2>
          <p className={`${bodyText} mb-4`}>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li className={bodyText}>
              Use {APP_NAME} for any unlawful purpose or in violation of any
              regulations.
            </li>
            <li className={bodyText}>
              Attempt to gain unauthorised access to any part of the service or
              its infrastructure.
            </li>
            <li className={bodyText}>
              Scrape, crawl, or use automated means to access content without
              our prior written permission.
            </li>
            <li className={bodyText}>
              Interfere with or disrupt the integrity or performance of the
              service.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className={`${pageTitle} mb-4`}>5. Intellectual Property</h2>
          <p className={bodyText}>
            All original content, design, and code that comprises {APP_NAME} —
            excluding third-party article content — is the property of{" "}
            {APP_NAME} and its creators. You may not reproduce, distribute, or
            create derivative works without explicit written permission.
            Third-party article content remains the property of the respective
            publishers.
          </p>
        </section>

        <section className="mb-10">
          <h2 className={`${pageTitle} mb-4`}>6. Third-Party Content</h2>
          <p className={bodyText}>
            {APP_NAME} aggregates articles from external sources. We do not
            endorse, verify, or take responsibility for the accuracy, legality,
            or completeness of third-party content. Links to external sites are
            provided for convenience; accessing them is at your own risk.
          </p>
        </section>

        <section className="mb-10">
          <h2 className={`${pageTitle} mb-4`}>7. Disclaimers</h2>
          <p className={bodyText}>
            {APP_NAME} is provided "as is" without warranties of any kind,
            express or implied. We do not warrant that the service will be
            uninterrupted, error-free, or free of harmful components. We make no
            representations regarding the accuracy or completeness of any
            content displayed.
          </p>
        </section>

        <section className="mb-10">
          <h2 className={`${pageTitle} mb-4`}>8. Limitation of Liability</h2>
          <p className={bodyText}>
            To the fullest extent permitted by law, {APP_NAME} and its operators
            shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising from your use of or
            inability to use the service.
          </p>
        </section>

        <section className="mb-10">
          <h2 className={`${pageTitle} mb-4`}>9. Termination</h2>
          <p className={bodyText}>
            We reserve the right to suspend or terminate your account at any
            time for violation of these Terms or for any other reason at our
            discretion. You may delete your account at any time via your profile
            settings.
          </p>
        </section>

        <section className="mb-10">
          <h2 className={`${pageTitle} mb-4`}>10. Changes to These Terms</h2>
          <p className={bodyText}>
            We may revise these Terms at any time. We will notify you of
            material changes via an in-app notice. Continued use of {APP_NAME}{" "}
            after changes are posted constitutes your acceptance of the revised
            Terms.
          </p>
        </section>

        <section className="mb-10">
          <h2 className={`${pageTitle} mb-4`}>11. Governing Law</h2>
          <p className={bodyText}>
            These Terms are governed by and construed in accordance with
            applicable law. Any disputes shall be resolved in the courts of
            competent jurisdiction.
          </p>
        </section>

        <section className="mb-10">
          <h2 className={`${pageTitle} mb-4`}>12. Contact</h2>
          <p className={bodyText}>
            For questions about these Terms, please reach out via the
            developer's website.
          </p>
        </section>
      </PageLayout>
    </div>
  );
}
