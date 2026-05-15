'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <div style={{ padding: '4rem 1.5rem', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>치명적인 오류가 발생했어요</h1>
          <p style={{ marginTop: '0.75rem', color: '#666' }}>
            문제가 계속되면 페이지를 새로 고침해 주세요.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '1.5rem',
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              border: 0,
              background: '#111',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
