"use client";

export default function PrivacyPolicyPage() {
  return (
    <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-foreground">
      {/* Ambient brand glow */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-72 w-[52rem] rounded-full bg-[var(--brand)]/20 blur-3xl" />
      </div>

      <div className="relative rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)]/40 backdrop-blur-md shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)]">
        <div className="p-6 sm:p-10">
          <header className="mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)]/10 px-3 py-1 text-xs font-medium text-[var(--brand)] ring-1 ring-[var(--brand)]/20">
              Legal
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-foreground/70">
          This Privacy Policy explains how Flash Service Agency Limited (“we,” “our,” “us”) collects, uses, shares, and protects your personal information when you use our website, mobile app, or other services provided in support of the Gesa Flash Program.
            </p>
            <p className="mt-2 text-sm text-foreground/70">
          By using our services, you agree to the practices described in this Policy.
            </p>
          </header>

          <section className="prose prose-invert max-w-none">
            <h2 className="text-xl font-semibold tracking-tight">About Us</h2>
            <p>
          Flash Service Agency Limited provides technology support to social impact programs, focusing on secure, reliable, and user-friendly digital platforms. We are the official technology partner for the Gesa Flash Program, a project of Gesa, an NGO working in education, healthcare, skill development, and social awareness.
            </p>
            <p>
          Our role is to make sure the program’s services reach beneficiaries effectively using modern digital tools. We value your trust and are committed to keeping your personal data safe. Protecting your privacy is both a legal obligation and a moral responsibility.
            </p>
            <p>
          Through our partnership with Gesa, we aim to create a positive impact in communities by improving access to education, promoting health, supporting skill development, and raising social awareness. Using our platform means you are part of this broader mission.
            </p>

            <h2 className="text-xl font-semibold mt-10 tracking-tight">1. Information We Collect</h2>
            <p>We may collect:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-[var(--brand)]">
          <li>
            <strong>Identity Information:</strong> Name, phone, national id, email, gender, age, etc.
          </li>
          <li>
            <strong>Location Data:</strong> Address or approximate location (with your consent)
          </li>
          <li>
            <strong>Usage Data:</strong> Pages visited, features used, frequency of use
          </li>
          <li>
            <strong>Device & Technical Data:</strong> Device type, operating system, browser, IP address
          </li>
          <li>
            <strong>Voluntary Information:</strong> Feedback, forms, surveys, or uploaded documents
          </li>
            </ul>
            <p className="mt-2">We collect only what is necessary to provide and improve our services.</p>

            <h2 className="text-xl font-semibold mt-10 tracking-tight">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-[var(--brand)]">
          <li>Deliver services under the Gesa Flash Program (education, health, skills, awareness)</li>
          <li>Operate and improve our website and app</li>
          <li>Send updates or alerts (with your consent)</li>
          <li>Provide customer support</li>
          <li>Monitor, report, and maintain transparency</li>
            </ul>
            <p className="mt-2">We do not sell, rent, or misuse your data.</p>

            <h2 className="text-xl font-semibold mt-10 tracking-tight">3. Data Protection & Security</h2>
            <ul className="list-disc pl-6 space-y-2 marker:text-[var(--brand)]">
          <li>Data is stored securely with encryption and passwords</li>
          <li>Access is limited to authorized staff only</li>
          <li>We comply with Bangladesh’s Digital Security Act and international standards</li>
          <li>Users will be informed if there is a data breach</li>
            </ul>

            <h2 className="text-xl font-semibold mt-10 tracking-tight">4. Sharing Your Information</h2>
            <p>We only share your information:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-[var(--brand)]">
          <li>With the Gesa Flash Program for service delivery</li>
          <li>With trusted third-party providers under confidentiality agreements</li>
          <li>If required by law or government authorities</li>
            </ul>
            <p className="mt-2">We do not share your information with advertisers or unrelated parties.</p>

            <h2 className="text-xl font-semibold mt-10 tracking-tight">5. Third-Party Services</h2>
            <p>
          Some services may include third-party tools or platforms. Each third party has its own privacy policy, which governs how your data is collected and used. Flash Service Agency Limited is not responsible for third-party privacy practices.
            </p>

            <h2 className="text-xl font-semibold mt-10 tracking-tight">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-[var(--brand)]">
          <li><strong>Access:</strong> See the personal information we hold about you</li>
          <li><strong>Correction:</strong> Fix inaccurate or outdated information</li>
          <li><strong>Withdraw Consent:</strong> Withdraw permission for data use</li>
          <li><strong>Erasure:</strong> Request deletion of your data or account, subject to law</li>
            </ul>
            <div className="mt-4 rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)]/40 p-4 sm:p-5">
              <p className="text-sm">
                Contact us at: <a className="text-[var(--brand)] hover:underline" href="mailto:flashservicesbd@gmail.com">flashservicesbd@gmail.com</a>
                <span className="mx-1">|</span>
                <a className="text-[var(--brand)] hover:underline" href="tel:+8801818584566">01818584566</a>
              </p>
            </div>

            <h2 className="text-xl font-semibold mt-10 tracking-tight">7. Cookies & Tracking</h2>
            <p>
          We use cookies to improve your experience and analyze usage. You can disable cookies, but some features may not work properly.
            </p>

            <h2 className="text-xl font-semibold mt-10 tracking-tight">8. Changes to This Policy</h2>
            <p>
          We may update this Policy at any time. The latest version will always be available on our website and app.
            </p>

            <h2 className="text-xl font-semibold mt-10 tracking-tight">9. Contact Information</h2>
            <address className="not-italic leading-relaxed">
              <div>Flash Service Agency Limited</div>
              <div>Suit 12, BGB Super Market, 31 Lalit Mohan Das Lane,</div>
              <div>Pilkhana Road, Lalbagh, Dhaka 1205</div>
              <div>
                <a className="text-[var(--brand)] hover:underline" href="mailto:flashservicesbd@gmail.com">flashservicesbd@gmail.com</a>
              </div>
              <div>
                <a className="text-[var(--brand)] hover:underline" href="tel:+8801818584566">01818584566</a>
              </div>
            </address>
          </section>
        </div>
      </div>
    </div>
  );
}
