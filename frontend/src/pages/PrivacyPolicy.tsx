import HeroCard from "../components/HeroCard";
import PageLayout from "../components/PageLayout";
import { bodyText, pageTitle } from "../styles";
import { APP_NAME } from "../constants";

export default function PrivacyPolicy() {
  return (
    <div className="pt-15">
      <HeroCard eyebrow="Legal" title="Privacy Policy" compact />

      <PageLayout>
        <p className={`${bodyText} mb-10`}>Last updated: April 6, 2026</p>

        <section className="mb-10">
          <h2 className={`${pageTitle} mb-4`}>1. Introduction</h2>
          <p className={bodyText}>
            Welcome to {APP_NAME}. We respect your privacy and are committed to
            protecting the personal data you share with us. This Privacy Policy
            explains what information we collect, how we use it, and your rights
            regarding your data.
          </p>
        </section>

        <section className="mb-10">
          <h2 className={`${pageTitle} mb-4`}>2. Information We Collect</h2>
          <p className={`${bodyText} mb-4`}>
            We collect the following types of information when you use{" "}
            {APP_NAME}:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li className={bodyText}>
              <strong>Account information</strong> — your username and password
              (stored securely and never in plain text).
            </li>
            <li className={bodyText}>
              <strong>Usage data</strong> — articles you read, save, or react
              to, and the topics and preferences you select.
            </li>
            <li className={bodyText}>
              <strong>Device &amp; log data</strong> — IP address, browser type,
              operating system, and timestamps of requests to our servers.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className={`${pageTitle} mb-4`}>
            3. How We Use Your Information
          </h2>
          <p className={`${bodyText} mb-4`}>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li className={bodyText}>
              Provide and personalise your news feed.
            </li>
            <li className={bodyText}>
              Authenticate your account and keep it secure.
            </li>
            <li className={bodyText}>Improve and debug our services.</li>
            <li className={bodyText}>
              Communicate important updates about {APP_NAME}.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className={`${pageTitle} mb-4`}>4. Data Sharing</h2>
          <p className={bodyText}>
            We do not sell, trade, or rent your personal information to third
            parties. We may share anonymised, aggregated data (which cannot
            identify you) for analytics and research purposes. We may disclose
            data when required by law or to protect the rights and safety of our
            users.
          </p>
        </section>

        <section className="mb-10">
          <h2 className={`${pageTitle} mb-4`}>5. Cookies</h2>
          <p className={bodyText}>
            {APP_NAME} uses strictly necessary cookies to maintain your session
            and authentication state. We do not use advertising or tracking
            cookies.
          </p>
        </section>

        <section className="mb-10">
          <h2 className={`${pageTitle} mb-4`}>6. Data Retention</h2>
          <p className={bodyText}>
            We retain your account data for as long as your account is active.
            You may request deletion of your account and associated data at any
            time by contacting us. Log data is retained for up to 90 days for
            security purposes.
          </p>
        </section>

        <section className="mb-10">
          <h2 className={`${pageTitle} mb-4`}>7. Your Rights</h2>
          <p className={`${bodyText} mb-4`}>
            Depending on your jurisdiction, you may have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li className={bodyText}>
              Access the personal data we hold about you.
            </li>
            <li className={bodyText}>Request correction of inaccurate data.</li>
            <li className={bodyText}>Request deletion of your data.</li>
            <li className={bodyText}>
              Object to or restrict certain processing activities.
            </li>
          </ul>
          <p className={`${bodyText} mt-4`}>
            To exercise any of these rights, please contact us at the address
            below.
          </p>
        </section>

        <section className="mb-10">
          <h2 className={`${pageTitle} mb-4`}>8. Security</h2>
          <p className={bodyText}>
            We use industry-standard security measures including encrypted
            connections (HTTPS) and hashed password storage. No system is
            completely secure; if you believe your account has been compromised,
            please contact us immediately.
          </p>
        </section>

        <section className="mb-10">
          <h2 className={`${pageTitle} mb-4`}>9. Changes to This Policy</h2>
          <p className={bodyText}>
            We may update this Privacy Policy from time to time. Significant
            changes will be communicated via an in-app notice. Continued use of{" "}
            {APP_NAME} after changes take effect constitutes acceptance of the
            revised policy.
          </p>
        </section>

        <section className="mb-10">
          <h2 className={`${pageTitle} mb-4`}>10. Contact</h2>
          <p className={bodyText}>
            If you have questions or concerns about this Privacy Policy, please
            reach out via the developer's website.
          </p>
        </section>
      </PageLayout>
    </div>
  );
}
