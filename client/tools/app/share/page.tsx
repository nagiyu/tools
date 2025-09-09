'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import LoadingPage from '@client-common/pages/LoadingPage';

interface SharedData {
  title?: string;
  text?: string;
  url?: string;
}

function ShareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sharedData, setSharedData] = useState<SharedData>({});

  useEffect(() => {
    // Get shared data from URL parameters
    const title = searchParams.get('title') || undefined;
    const text = searchParams.get('text') || undefined;
    const url = searchParams.get('url') || undefined;

    setSharedData({ title, text, url });
  }, [searchParams]);

  const handleProcessShare = () => {
    // Process the shared data with convert-transfer tool
    if (sharedData.url) {
      router.push(`/convert-transfer?url=${encodeURIComponent(sharedData.url)}`);
    } else if (sharedData.text) {
      // Navigate to convert-transfer with text in URL (for simplicity)
      router.push(`/convert-transfer?text=${encodeURIComponent(sharedData.text)}`);
    } else {
      // If no usable data, go to home page
      router.push('/');
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const hasData = sharedData.title || sharedData.text || sharedData.url;
  const hasProcessableData = sharedData.url || sharedData.text;

  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#fff',
      minHeight: '100vh'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>共有されたコンテンツ</h1>
        <p style={{ color: '#666', fontSize: '14px' }}>
          他のアプリから共有されたデータを処理できます
        </p>
      </div>
      
      {hasData ? (
        <div style={{ 
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#495057' }}>共有データ</h3>
          
          {sharedData.title && (
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#495057' }}>タイトル:</strong>
              <div style={{ marginTop: '5px', color: '#6c757d' }}>
                {sharedData.title}
              </div>
            </div>
          )}
          
          {sharedData.text && (
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#495057' }}>テキスト:</strong>
              <div style={{ 
                marginTop: '5px', 
                color: '#6c757d',
                maxHeight: '100px',
                overflow: 'auto',
                padding: '8px',
                backgroundColor: '#fff',
                borderRadius: '4px',
                border: '1px solid #dee2e6'
              }}>
                {sharedData.text}
              </div>
            </div>
          )}
          
          {sharedData.url && (
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#495057' }}>URL:</strong>
              <div style={{ marginTop: '5px' }}>
                <a 
                  href={sharedData.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    color: '#007bff',
                    textDecoration: 'none',
                    wordBreak: 'break-all'
                  }}
                >
                  {sharedData.url}
                </a>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ 
          backgroundColor: '#f8f9fa',
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '30px',
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>📋</div>
          <h3 style={{ color: '#6c757d', margin: '0 0 10px 0' }}>
            共有データがありません
          </h3>
          <p style={{ color: '#adb5bd', margin: 0, fontSize: '14px' }}>
            他のアプリからデータを共有してください
          </p>
        </div>
      )}

      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        flexDirection: 'column',
        maxWidth: '300px',
        margin: '0 auto'
      }}>
        {hasProcessableData && (
          <button
            onClick={handleProcessShare}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
          >
            📄 ツールで変換処理
          </button>
        )}
        
        <button
          onClick={handleGoHome}
          style={{
            backgroundColor: hasProcessableData ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = hasProcessableData ? '#545b62' : '#0056b3';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = hasProcessableData ? '#6c757d' : '#007bff';
          }}
        >
          🏠 ホームに戻る
        </button>
      </div>

      <div style={{ 
        marginTop: '40px', 
        textAlign: 'center',
        color: '#adb5bd',
        fontSize: '12px'
      }}>
        <p>このページは共有機能により開かれました</p>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <ShareContent />
    </Suspense>
  );
}