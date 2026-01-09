'use client';

import React, { useState } from 'react';

interface SEBSettingsProps {
    examId: string;
    examTitle: string;
    sebBrowserKey?: string;
    apiBaseUrl: string;
    token: string;
}

/**
 * SEB (Safe Exam Browser) Settings Component
 * SEB is MANDATORY for all exams - this component only shows status and download
 */
export default function SEBSettings({
    examId,
    examTitle,
    sebBrowserKey,
    apiBaseUrl,
    token
}: SEBSettingsProps) {
    const [browserKey] = useState(sebBrowserKey);

    const handleDownloadConfig = () => {
        const url = `${apiBaseUrl}/api/exams/${examId}/seb-config`;
        window.open(url, '_blank');
    };

    return (
        <div className="seb-settings" style={{
            border: '2px solid #22c55e',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '16px',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '32px' }}>🔒</span>
                <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#166534' }}>
                        Safe Exam Browser (SEB) Zorunlu
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#15803d' }}>
                        Bu sınava sadece SEB tarayıcısı ile girilebilir
                    </p>
                </div>
            </div>

            <div style={{
                padding: '16px',
                background: 'rgba(255,255,255,0.8)',
                borderRadius: '8px',
                marginBottom: '16px'
            }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 600, color: '#166534' }}>
                    🛡️ Aktif Güvenlik Özellikleri:
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                    <div>✅ Kiosk Modu (Tam ekran)</div>
                    <div>✅ Ekran görüntüsü engeli</div>
                    <div>✅ Kopyala/Yapıştır engeli</div>
                    <div>✅ DevTools engeli</div>
                    <div>✅ URL filtreleme</div>
                    <div>✅ Uygulama değişiklik algılama</div>
                    <div>✅ Browser Key doğrulama</div>
                    <div>✅ Oturum şifreleme</div>
                </div>
            </div>

            {browserKey && (
                <div style={{
                    padding: '12px',
                    background: '#fff',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#166534'
                }}>
                    <strong>Browser Key:</strong> {browserKey.substring(0, 20)}...
                </div>
            )}

            <button
                onClick={handleDownloadConfig}
                style={{
                    width: '100%',
                    padding: '16px 24px',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
                    transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.5)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(34, 197, 94, 0.4)';
                }}
            >
                📥 SEB Yapılandırma Dosyasını İndir (.seb)
            </button>

            <div style={{
                marginTop: '16px',
                padding: '12px',
                background: '#fef3c7',
                border: '1px solid #fcd34d',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#92400e'
            }}>
                <strong>⚠️ Öğrencilere Not:</strong><br />
                1. <a href="https://safeexambrowser.org/download_en.html" target="_blank" style={{ color: '#b45309' }}>
                    SEB'i indirin ve kurun
                </a><br />
                2. Yukarıdaki .seb dosyasını indirin<br />
                3. .seb dosyasını SEB ile açın<br />
                4. Sınav otomatik başlayacaktır
            </div>
        </div>
    );
}
