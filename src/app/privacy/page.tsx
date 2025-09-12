export const metadata = {
  title: 'Privacy Policy - Talentix',
  description: 'How Talentix collects, uses, and protects your personal data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

      <p className="mb-6">
        This Privacy Policy explains how Talentix ("we", "us", or "our") collects, uses, and
        protects your information when you use our website and services.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">1. Information We Collect</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Account details such as name, email, and authentication data.</li>
        <li>Content you upload (e.g., CVs) for analysis and feedback.</li>
        <li>Usage data such as pages viewed, actions taken, and device information.</li>
        <li>Cookies and similar technologies for authentication and preferences.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">2. How We Use Information</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Provide, improve, and personalize our services.</li>
        <li>Analyse CVs and generate feedback using AI providers where configured.</li>
        <li>Maintain security, prevent fraud, and ensure service reliability.</li>
        <li>Communicate updates, tips, and important service information.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">3. AI Services</h2>
      <p className="mb-4">
        Certain features use third-party AI providers (such as OpenAI or Groq). When you opt to use
        these features, relevant text you submit (e.g., CV content, interview answers) may be sent to
        the provider to generate results. We do not sell your data. Providers process data according to
        their own terms and policies.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">4. Cookies</h2>
      <p className="mb-4">
        We use cookies to keep you signed in, remember preferences, and manage access to gated pages
        (e.g., coming-soon access). You can control cookies via your browser settings.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">5. Data Sharing</h2>
      <p className="mb-4">
        We do not sell personal data. We may share data with service providers (hosting, analytics,
        AI processing, email) strictly to provide our services, under appropriate safeguards.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">6. Data Retention</h2>
      <p className="mb-4">
        We retain data only as long as necessary to provide the service and for legitimate business
        purposes. You may request deletion of your account and associated data.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">7. Your Rights</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Access the personal data we hold about you.</li>
        <li>Request correction or deletion of your data.</li>
        <li>Object to or restrict certain processing.</li>
        <li>Withdraw consent where processing is based on consent.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">8. Children’s Privacy</h2>
      <p className="mb-4">
        Our platform is designed for teenagers with parental awareness where applicable. If you
        believe we have collected data from a child without appropriate consent, please contact us and
        we will take steps to remove the information.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">9. Security</h2>
      <p className="mb-4">
        We employ reasonable technical and organizational measures to protect your data. However, no
        method of transmission or storage is 100% secure.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">10. Contact Us</h2>
      <p className="mb-4">
        Questions about this policy? Contact us at <a className="underline" href="mailto:support@talentix.co.uk">support@talentix.co.uk</a>.
      </p>
    </div>
  );
}



