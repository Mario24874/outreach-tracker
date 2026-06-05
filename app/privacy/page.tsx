export const metadata = {
  title: 'Privacy Policy — MarioOS',
  description: 'Privacy Policy for MarioOS by Mario Moreno',
};

export default function PrivacyPage() {
  return (
    <div style={{ background: '#020617', minHeight: '100vh', color: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <a href="https://mariomoreno.work" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#94a3b8', textDecoration: 'none', fontSize: 13, marginBottom: 32 }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            mariomoreno.work
          </a>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Privacy Policy</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Last updated: June 5, 2026</p>
          <div style={{ height: 1, background: '#1e293b', marginTop: 32 }}/>
        </div>

        {/* Intro */}
        <p style={{ color: '#94a3b8', lineHeight: 1.7, marginBottom: 32 }}>
          <strong style={{ color: '#f8fafc' }}>Mario Moreno</strong> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the <strong style={{ color: '#f8fafc' }}>MarioOS</strong> platform,
          accessible at <a href="https://app.mariomoreno.work" style={{ color: '#a5b4fc' }}>app.mariomoreno.work</a>, and the portfolio website at{' '}
          <a href="https://mariomoreno.work" style={{ color: '#a5b4fc' }}>mariomoreno.work</a> (collectively, the &quot;Service&quot;).
        </p>
        <p style={{ color: '#94a3b8', lineHeight: 1.7, marginBottom: 40 }}>
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service,
          including our integration with the <strong style={{ color: '#f8fafc' }}>WhatsApp Business Platform</strong> via the Meta Cloud API.
          By using our Service, you consent to the data practices described in this policy.
        </p>

        <Section title="1. Information We Collect">
          <SubTitle>1.1 Information You Provide Directly</SubTitle>
          <ul>
            <li>Account registration data (name, email address, company name)</li>
            <li>Business information (industry, country, website URL)</li>
            <li>Communication content (messages sent and received through WhatsApp Business API)</li>
            <li>WhatsApp Business Account (WABA) details when you connect your account via Embedded Signup</li>
          </ul>
          <SubTitle>1.2 Information Collected Automatically</SubTitle>
          <ul>
            <li>Device and browser information (IP address, browser type, operating system)</li>
            <li>Usage data (pages visited, features used, timestamps)</li>
            <li>WhatsApp message delivery status and analytics (sent, delivered, read timestamps)</li>
          </ul>
          <SubTitle>1.3 Information from Meta Platform</SubTitle>
          <p>When you authenticate with Meta or connect your WhatsApp Business Account, we may receive:</p>
          <ul>
            <li>Meta User ID</li>
            <li>Public profile information (name, profile picture)</li>
            <li>WhatsApp Business Account ID and associated phone numbers</li>
            <li>Message template information</li>
            <li>Message delivery and read receipts</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve the MarioOS platform</li>
            <li>Send and receive WhatsApp messages on your behalf via the WhatsApp Business API</li>
            <li>Manage your WhatsApp Business assets (phone numbers, message templates, webhook subscriptions)</li>
            <li>Display messaging analytics and account insights in your dashboard</li>
            <li>Authenticate your identity and manage your account</li>
            <li>Communicate with you about service updates and support</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p><strong style={{ color: '#f8fafc' }}>We do NOT use your data to:</strong></p>
          <ul>
            <li>Sell or rent personal information to third parties</li>
            <li>Send unsolicited messages or spam</li>
            <li>Target advertising to end users of your WhatsApp messages</li>
            <li>De-anonymize aggregated or anonymized data</li>
          </ul>
        </Section>

        <Section title="3. Meta Platform Data">
          <p>
            We comply with the <a href="https://developers.facebook.com/terms/dfc_platform_terms/" style={{ color: '#a5b4fc' }}>Meta Platform Terms</a> and{' '}
            <a href="https://developers.facebook.com/devpolicy/" style={{ color: '#a5b4fc' }}>Developer Policies</a>. Specifically:
          </p>
          <ul>
            <li>We only access Meta Platform Data necessary to provide the Service</li>
            <li>We do not transfer Platform Data to data brokers, information resellers, or advertising networks</li>
            <li>We delete Platform Data when it is no longer necessary for the purpose for which it was collected, or upon your request</li>
            <li>We implement reasonable security measures to protect Platform Data</li>
            <li>We do not use Platform Data to discriminate against or cause harm to any individual or group</li>
          </ul>
        </Section>

        <Section title="4. Data Sharing and Disclosure">
          <p>We do <strong style={{ color: '#f8fafc' }}>not</strong> share your personal information with third parties except in the following circumstances:</p>
          <ul>
            <li><strong style={{ color: '#f8fafc' }}>With your consent:</strong> When you explicitly authorize us to share information</li>
            <li><strong style={{ color: '#f8fafc' }}>Service providers:</strong> We may use third-party services (hosting, analytics) that process data on our behalf under strict confidentiality agreements</li>
            <li><strong style={{ color: '#f8fafc' }}>Legal requirements:</strong> When required by law, regulation, or legal process</li>
            <li><strong style={{ color: '#f8fafc' }}>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>
          <p><strong style={{ color: '#f8fafc' }}>Current third-party service providers:</strong></p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e293b' }}>
                <th style={{ textAlign: 'left', padding: '8px 0', color: '#94a3b8', fontWeight: 600 }}>Provider</th>
                <th style={{ textAlign: 'left', padding: '8px 0', color: '#94a3b8', fontWeight: 600 }}>Purpose</th>
                <th style={{ textAlign: 'left', padding: '8px 0', color: '#94a3b8', fontWeight: 600 }}>Data Processed</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Vercel', 'Application hosting', 'Usage data, IP addresses'],
                ['Supabase', 'Database and authentication', 'Account data, messages'],
                ['Meta (WhatsApp Cloud API)', 'Messaging platform', 'Message content, delivery status'],
              ].map(([p, pu, d]) => (
                <tr key={p} style={{ borderBottom: '1px solid #0f172a' }}>
                  <td style={{ padding: '10px 0', color: '#f8fafc' }}>{p}</td>
                  <td style={{ padding: '10px 0', color: '#94a3b8' }}>{pu}</td>
                  <td style={{ padding: '10px 0', color: '#94a3b8' }}>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="5. Data Retention">
          <ul>
            <li><strong style={{ color: '#f8fafc' }}>Account data:</strong> Retained while your account is active. Deleted within 30 days of account deletion request.</li>
            <li><strong style={{ color: '#f8fafc' }}>Message data:</strong> Retained for up to 12 months for analytics purposes, unless you request earlier deletion.</li>
            <li><strong style={{ color: '#f8fafc' }}>Meta Platform Data:</strong> Deleted when no longer needed for the stated purpose or upon Meta&apos;s request.</li>
          </ul>
        </Section>

        <Section title="6. Data Security">
          <p>We implement industry-standard security measures including:</p>
          <ul>
            <li>Encryption in transit (TLS/HTTPS)</li>
            <li>Encryption at rest for sensitive data</li>
            <li>Access controls and authentication</li>
            <li>Regular security reviews</li>
          </ul>
          <p>However, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security.</p>
        </Section>

        <Section title="7. Your Rights">
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li><strong style={{ color: '#f8fafc' }}>Access</strong> the personal data we hold about you</li>
            <li><strong style={{ color: '#f8fafc' }}>Correct</strong> inaccurate or incomplete data</li>
            <li><strong style={{ color: '#f8fafc' }}>Delete</strong> your personal data</li>
            <li><strong style={{ color: '#f8fafc' }}>Export</strong> your data in a portable format</li>
            <li><strong style={{ color: '#f8fafc' }}>Withdraw consent</strong> at any time</li>
            <li><strong style={{ color: '#f8fafc' }}>Object</strong> to processing of your data</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:privacy@mariomoreno.work" style={{ color: '#a5b4fc' }}>privacy@mariomoreno.work</a> or{' '}
            <a href="mailto:info@mariomoreno.work" style={{ color: '#a5b4fc' }}>info@mariomoreno.work</a>.
          </p>
        </Section>

        <Section title="8. International Data Transfers">
          <p>
            Our Service is operated from Venezuela. If you access the Service from outside Venezuela, your information may be
            transferred to and processed in countries with different data protection laws. By using our Service, you consent to such transfers.
          </p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>
            Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children.
          </p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy
            on this page and updating the &quot;Last updated&quot; date.
          </p>
        </Section>

        <Section title="11. Contact Us">
          <p>If you have questions about this Privacy Policy, please contact us:</p>
          <ul>
            <li><strong style={{ color: '#f8fafc' }}>Email:</strong> <a href="mailto:info@mariomoreno.work" style={{ color: '#a5b4fc' }}>info@mariomoreno.work</a></li>
            <li><strong style={{ color: '#f8fafc' }}>Website:</strong> <a href="https://mariomoreno.work" style={{ color: '#a5b4fc' }}>mariomoreno.work</a></li>
            <li><strong style={{ color: '#f8fafc' }}>Responsible entity:</strong> Mario Moreno</li>
            <li><strong style={{ color: '#f8fafc' }}>Location:</strong> Venezuela</li>
          </ul>
        </Section>

        <p style={{ color: '#475569', fontSize: 13, marginTop: 48, fontStyle: 'italic' }}>
          This privacy policy is provided in English as required by Meta&apos;s App Review process. A Spanish translation is available upon request.
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#f8fafc' }}>{title}</h2>
      <div style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: 15 }}>
        {children}
      </div>
      <div style={{ height: 1, background: '#0f172a', marginTop: 32 }}/>
    </section>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: '#f8fafc', fontWeight: 600, marginTop: 20, marginBottom: 8, fontSize: 14 }}>{children}</p>
  );
}
