import { useFetchClient, useNotification } from "@strapi/strapi/admin";
import React, { useRef, useState } from "react";

export function Spinner() {
  return (
    <div className="spinner" role="status">
      <span className="visually-hidden">Loading...</span>
      <style>{`
        .spinner {
          display: inline-block;
          width: 2rem;       /* same as h-8 w-8 */
          height: 2rem;
          margin-top: 0.3rem;
          border: 4px solid currentColor;
          border-right-color: transparent; /* same as border-e-transparent */
          border-radius: 50%;
          animation: spin 1.5s linear infinite;
          color: var(--spinner-color, #000); /* fallback */
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Optional: dark mode support */
        @media (prefers-color-scheme: dark) {
          .spinner {
            color: #fff;
          }
        }
      `}</style>
    </div>
  );
}

export default function BuildButton() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const { toggleNotification } = useNotification();
  const consoleRef = useRef<HTMLDivElement|null>(null);

  const { get } = useFetchClient();

  const handleClick = async () => {
    setLoading(true);
    setResponse('');

    toggleNotification({ type: 'info', message: 'Starting site build... this may take a few minutes' });

    try {
      const { data } = await get('/users-permissions/sitebuild', {});
      console.log('resposne', data)
      setResponse(data.data);

      toggleNotification({ type: 'success', message: 'Build finished' });
    } catch (error: any) {
      setResponse(`[error] ${error.message}`);
      toggleNotification({ type: 'danger', message: `Build failed: ${error.message}` });
    } finally {
      setLoading(false);
      if (consoleRef.current) {
        consoleRef.current.scrollTo({
          top: consoleRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <button
        style={{
          width: "100%",
          height: "3.2rem",
          border: "1px solid #4945ff",
          background: "#4945ff",
          color: "#ffffff",
          borderRadius: "0.4rem",
          cursor: "pointer",
          fontWeight: 'bolder',
          fontSize: '1.3rem'
        }}
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? <Spinner /> : 'Build Site'}
      </button>

      {response.length > 0 && (
        <div
        ref={consoleRef}
          style={{
            fontFamily: 'monospace',
            backgroundColor: '#111',
            color: '#0f0',
            padding: '0.8rem',
            fontSize: '0.75rem',
            borderRadius: '6px',
            marginTop: '1rem',
            overflowY: 'auto',
            maxHeight: '32rem',
            whiteSpace: 'pre-wrap',
          }}
        >
          {response.split('\n').map((line, i) => {
            const isError = line.startsWith('[error]');
            return (
              <div key={i} style={{ color: isError ? '#f33' : '#0f0' }}>
                {line}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
