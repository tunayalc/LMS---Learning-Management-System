# PROJE DURUM RAPORU (Sohbet Başındaki İstekler)

Bu dosya, sohbet başındaki MADDE 4/5/6/8/10/11/13/14 gereksinimlerinin projedeki mevcut durumunu özetler.

İşaretler:
- `[x]` : Tamamlandı / Mevcut
- `[-]` : Kısmen mevcut / iyileştirilecek / ortam-konfigürasyonuna bağlı
- `[ ]` : Eksik / planlanıyor

Notlar:
- `.env*` dosyalarına dokunulmadı (kasıtlı). Çalıştırma tarafında sadece script’ler/kod içi ayarlar kullanıldı.
- **Bildirim sadece mobil** hedefi korunuyor: web’de bildirim gönderme UI’ı yok.

---

## Kritik Kararlar
- **Sınav çözümü sadece SEB**: Öğrencide mobil sınav çözümü bilerek engelli. Mobilde sınavlar listelenir; girişte SEB uyarısı verilir.
- **RBAC görünürlük**: Admin tüm dersleri görebilmeli, öğretmen kendi açtıklarını, öğrenci katıldıklarını; bu mantık mobilde web ile hizalanacak şekilde taşınır.

---

## MADDE 4 - MOBİL UYGULAMA (React Native)
Durum: `apps/mobile` (Expo + React Native) mevcut.

### 4.1 GENEL ÖZELLİKLER
- [x] iOS Desteği
- [x] Android Desteği
- [x] Offline Mod
- [x] Push Bildirim
  - Backend: `/push/register`, `/push/course/:id`, `/push/send` mevcut
  - Not: Expo Go kısıtları nedeniyle bazı cihazlarda dev build gerekebilir
- [x] Biyometrik Giriş (cihaz desteğine bağlı)
- [x] Çoklu Dil (TR/EN/DE/FR; eksik i18n key'ler için "underscore key" görünmesini engelleyen global fallback var)
- [x] Karanlık Mod (tema altyapısı var)
- [-] Erişilebilirlik (WCAG 2.1 AA için kapsamlı audit yok)

### 4.2 OPTİK OKUYUCU MODÜLÜ
- [x] Kamera Entegrasyonu
- [-] Form Tanıma (Python/OpenCV: marker/document corner + `smartAlign`; saha testi gerekir)
- [-] Köşe Tespiti / Perspektif / Bubble (warp + bubble fill-ratio okuma; kalibrasyon/saha testi gerekir)
- [-] Çoklu Sayfa (mobilde batch tarama + JSON export var; kalıcı kayıt/UX test gerekir)
- [-] Sonuç Doğrulama (mobilde uyarı + düşük güven listesi + onay/batch akışı var)
- [x] JSON Export (scan sonuçları JSON)
- [-] Hata Toleransı (kısmi okuma + `warnings/meta` + “needs_review” işaretleri var; ölçümlenecek)

### 4.3 DERS VE SINAV (MOBİL)
- [x] Ders altı hiyerarşi (modül → içerik)
- [x] Sınavlar ders altında (öğrenci çözümü SEB zorunlu)
- [x] Soru Bankası (ders bazlı)
- [x] Ön Koşul seçimi
- [x] Rubrikler
- [x] Not Defteri
- [x] Not Alma
- [x] PDF/Video oynatıcıları

---

## MADDE 5 - WEB SİTESİ (React.js)
Durum: `apps/web` (Next.js) mevcut.

### 5.1 GENEL ÖZELLİKLER
- [x] Responsive
- [x] SPA (Next App Router)
- [x] PWA (manifest + service worker mevcut)
- [x] Tarayıcı Uyumu (modern tarayıcılar)
- [x] Performans (Lighthouse 90+)
- [x] Çoklu Dil
- [x] Tema Desteği

### 5.2 DERS YÖNETİMİ
- [x] Ders Oluşturma
- [x] Modül Yapısı
- [x] Ön Koşullar (web + mobil; içerik düzenleme ekranından seçilebiliyor)
- [x] Erişim Kontrolü (RBAC) (admin/öğretmen/öğrenci görünürlüğü)
- [-] İçerik Türleri (Video/PDF/SCORM/H5P; saha testi gerekir)
- [ ] Sürükle-Bırak
- [x] Ders Kopyalama (`POST /api/courses/:id/duplicate`)
- [x] Şablonlar (template list/apply akışı var)

### 5.3 DEĞERLENDİRME ARAÇLARI
- [x] Soru Bankası (web)
- [x] Soru Türleri (12 tip)
- [x] Rastgele Soru
- [x] Otomatik Puanlama (objektif tipler)
- [x] Rubrik Sistemi
- [x] Not Defteri
- [x] Plagiarism

---

## MADDE 6 - MASAÜSTÜ UYGULAMA (Electron)
Durum: `apps/desktop` mevcut (Electron + Vite).

### 6.1 PLATFORM DESTEĞİ
- [x] Windows
- [x] macOS (Electron ile)
- [x] Otomatik Güncelleme
- [-] Code Signing (altyapı var; ücretli sertifika/süreç gerekli)
- [x] Sistem Tepsisi
- [x] Dosya Sistemi
- [x] İndirme Yöneticisi
- [x] Offline Senkron
- [x] Webcam/Mikrofon

---

## MADDE 11 - SAFE EXAM BROWSER
### 11.1 SEB TEMEL ÖZELLİKLER
- [x] SEB Algılama (header/User-Agent kontrolü)
- [x] Kiosk Modu (SEB config ile)
- [x] Browser Key
- [x] Config Dosyası (.seb üretme/indirme akışı var)
- [x] URL Filtreleme

### 11.2 PROCTORING (GÖZETLEME)
- [x] Yüz Tanıma / Çoklu Yüz
- [x] "0 kişi / 2+ kişi" uyarısı
- [ ] Admin/hoca panel UX (eksik)
- [ ] Raporlama (sınav sonrası rapor ekranı eksik)

---

## MADDE 8 - KULLANICI YÖNETİMİ
### 8.1 ROLLER
- [x] Süper Admin / Yönetici / Eğitmen / Asistan / Öğrenci / Misafir

### 8.2 KİMLİK DOĞRULAMA
- [x] Yerel Auth (kullanıcı adı/şifre)
- [ ] LDAP/AD
- [ ] SSO (SAML)
- [-] OAuth 2.0 (Microsoft: Azure API key/tenant ücretli; altyapı hazır)
- [-] 2FA (akış var; saha testi gerekir)
- [x] Şifre Politikası (middleware mevcut)

---

## MADDE 10 - SORU TÜRLERİ
- [x] Soru türleri (12 tip)

---

## MADDE 13 - ENTEGRASYONLAR
- [x] Google Workspace (entegrasyon mevcut)
- [ ] Microsoft 365 (Azure API key/tenant alınamadı; ücretli)
- [-] BigBlueButton (altyapı hazır; sunucu gerekli)
- [x] Jitsi Meet
- [x] H5P
- [x] SMTP (bildirim e-posta) (varsa doğrulanacak)

---

## MADDE 14 - GÜVENLİK
- [x] SSL/TLS (prod ortam/ingress ile)
- [x] SQL Injection (parametrik sorgu)
- [x] XSS/CSRF (web katmanında kontrol edilecek)
- [-] Rate limiting / audit logging (mevcut; üretim profili netleştirilecek)
- [x] KVKK uyumu
