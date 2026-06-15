export const metadata = {
  title: 'Data Deletion Request — MarioOS',
  description: 'How to request deletion of your data from MarioOS',
};

export default function DataDeletionPage() {
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
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Data Deletion Request</h1>
          <div style={{ height: 1, background: '#1e293b', marginTop: 32 }}/>
        </div>

        <p style={{ color: '#94a3b8', lineHeight: 1.7, marginBottom: 32 }}>
          To request deletion of your data from <strong style={{ color: '#f8fafc' }}>MarioOS</strong>, please send an email to{' '}
          <a href="mailto:privacy@mariomoreno.work" style={{ color: '#a5b4fc' }}>privacy@mariomoreno.work</a> or{' '}
          <a href="mailto:info@mariomoreno.work" style={{ color: '#a5b4fc' }}>info@mariomoreno.work</a> with the subject{' '}
          <strong style={{ color: '#f8fafc' }}>&quot;Data Deletion Request&quot;</strong>. Include your registered email address and we
          will process your request within 30 days.
        </p>

        <p style={{ color: '#94a3b8', lineHeight: 1.7 }}>
          For more information, see our{' '}
          <a href="https://app.mariomoreno.work/privacy" style={{ color: '#a5b4fc' }}>Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
