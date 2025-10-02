"use client";

export default function TermsAndConditionsPage() {
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
              Terms & Conditions
            </h1>
            <p className="mt-3 text-sm text-foreground/70">
              Welcome to the services provided by Flash Service Agency Limited (“we,” “our,” “us”), the technology partner supporting the Gesa Flash Program (“Program”). By accessing or using our website, mobile application, or related services (“Services”), you agree to comply with these Terms and Conditions.
            </p>
            <p className="mt-2 text-sm text-foreground/70">
              If you do not agree, please do not use our Services.
            </p>
          </header>

          <section className="prose prose-invert max-w-none">
            <h2 className="text-xl font-semibold tracking-tight">1. About Our Services</h2>
            <p>
              Flash Service Agency Limited provides technology support to the Gesa Flash Program, a project of Gesa, a non-governmental organization (NGO) working in education, health, skill development, and social awareness.
            </p>
            <p>
              Our Services may include access to online platforms, applications, tools, and resources to facilitate program activities.
            </p>

            <h2 className="text-xl font-semibold mt-10 tracking-tight">2. User Eligibility</h2>
            <ul className="list-disc pl-6 space-y-2 marker:text-[var(--brand)]">
              <li>You must be at least 18 years old or have legal consent from a parent/guardian to use our Services.</li>
              <li>Users under 18 may use earning websites or apps only with parental or guardian consent.</li>
              <li>Parents/guardians are responsible for supervising the activities of minors.</li>
              <li>You agree to provide accurate, complete, and current information when using the Services.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-10 tracking-tight">3. Account Registration</h2>
            <ul className="list-disc pl-6 space-y-2 marker:text-[var(--brand)]">
              <li>Some Services may require creating an account.</li>
              <li>You are responsible for maintaining the confidentiality of your account information and password.</li>
              <li>You agree to notify us immediately of any unauthorized use of your account.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-10 tracking-tight">4. User Conduct</h2>
            <p>When using our Services, you agree that you will not:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-[var(--brand)]">
              <li>Violate any applicable law or regulation.</li>
              <li>Use the Services for any fraudulent or harmful purpose.</li>
              <li>Access, store, or share another person’s information without consent.</li>
              <li>Introduce viruses, malware, or harmful code into our systems.</li>
            </ul>
            <p className="mt-2">We reserve the right to suspend or terminate accounts that violate these rules.</p>

            <h2 className="text-xl font-semibold mt-10 tracking-tight">5. Intellectual Property</h2>
            <ul className="list-disc pl-6 space-y-2 marker:text-[var(--brand)]">
              <li>All content, software, logos, and materials in our Services are the property of Flash Service Agency Limited or its licensors.</li>
              <li>You may not copy, distribute, or create derivative works without explicit permission.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-10 tracking-tight">6. Third-Party Services</h2>
            <ul className="list-disc pl-6 space-y-2 marker:text-[var(--brand)]">
              <li>Our Services may include links or integration with third-party websites, applications, or tools.</li>
              <li>We are not responsible for the content, functionality, or privacy practices of third-party services.</li>
              <li>You agree to follow the terms and privacy policies of any third-party services you use.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-10 tracking-tight">7. Disclaimer of Warranties</h2>
            <ul className="list-disc pl-6 space-y-2 marker:text-[var(--brand)]">
              <li>Our Services are provided “as is” and “as available.”</li>
              <li>We do not guarantee that the Services will always be error-free, uninterrupted, or completely secure.</li>
              <li>Use of the Services is at your own risk.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-10 tracking-tight">8. Limitation of Liability</h2>
            <p>
              To the maximum extent allowed by law, Flash Service Agency Limited will not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the Services.
            </p>

            <h2 className="text-xl font-semibold mt-10 tracking-tight">9. Privacy</h2>
            <p>
              Your use of our Services is subject to our Privacy Policy, which explains how we collect, use, and protect your personal information.
            </p>

            <h2 className="text-xl font-semibold mt-10 tracking-tight">10. Changes to Terms</h2>
            <ul className="list-disc pl-6 space-y-2 marker:text-[var(--brand)]">
              <li>We may update or modify these Terms at any time.</li>
              <li>The updated Terms will be posted on our website or app, and your continued use of the Services constitutes acceptance of the changes.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-10 tracking-tight">11. Governing Law</h2>
            <ul className="list-disc pl-6 space-y-2 marker:text-[var(--brand)]">
              <li>These Terms are governed by the laws of Bangladesh.</li>
              <li>Any dispute arising from these Terms will be resolved under the jurisdiction of the courts of Bangladesh.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-10 tracking-tight">12. Levels of Partnership and Individual Terms</h2>
            <p>
              The Gesa Flash Program operates through multiple levels of participants, including Partners, Agents, Sub-Agents, Vendors/Sellers, and Customers. Each participant level will have its own specific terms and conditions, outlined in separate documents.
            </p>
            <ul className="list-disc pl-6 space-y-2 marker:text-[var(--brand)]">
              <li>All participants must comply with the laws of Bangladesh.</li>
              <li>Any actions that violate local laws, regulations, or ethical standards are strictly prohibited.</li>
              <li>Breach of these rules may result in account suspension, termination, or legal action.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-10 tracking-tight">13. Use of Earning Websites/Apps and Minor Users</h2>
            <p>
              The Services may include access to various earning websites or applications under the Gesa Flash Program.
            </p>
            <ul className="list-disc pl-6 space-y-2 marker:text-[var(--brand)]">
              <li>Users under the age of 18 may use these Services only with parental or guardian consent.</li>
              <li>Parents/guardians are responsible for supervising the activities of minors and ensuring compliance with these Terms.</li>
              <li>Users under 18 cannot enter into legally binding agreements; any earnings or transactions may require additional verification and consent.</li>
              <li>All users, including minors, must follow the laws of Bangladesh and these Terms. Any violation may result in account suspension, termination, or legal action.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-10 tracking-tight">14. Contact Information</h2>
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
