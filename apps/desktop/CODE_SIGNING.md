# Desktop Uygulama Code Signing Rehberi

Bu belge, Electron uygulaması için kod imzalama sürecini açıklar.

## Windows Code Signing

### 1. Sertifika Edinme

Windows için bir EV (Extended Validation) veya OV (Organization Validation) sertifikası gereklidir.

**Sertifika Sağlayıcıları:**
- DigiCert
- Sectigo (Comodo)
- GlobalSign
- SSL.com

### 2. electron-builder.yml Yapılandırması

```yaml
win:
  target:
    - nsis
    - portable
  signingHashAlgorithms:
    - sha256
  # Otomatik imzalama için environment variables kullanın:
  # CSC_LINK: Sertifika dosya yolu veya base64
  # CSC_KEY_PASSWORD: Sertifika şifresi

# Azure SignTool için (EV sertifikaları):
# CSC_LINK: azure://your-vault.vault.azure.net/certificates/your-cert
```

### 3. Environment Variables

```bash
# .env dosyasına ekleyin (CI/CD'de secrets olarak):
CSC_LINK=path/to/certificate.pfx
CSC_KEY_PASSWORD=your_certificate_password

# Veya Azure Key Vault için:
AZURE_SIGN_TOOL_KEY_VAULT_URL=https://your-vault.vault.azure.net
AZURE_SIGN_TOOL_CLIENT_ID=your-app-id
AZURE_SIGN_TOOL_CLIENT_SECRET=your-secret
AZURE_SIGN_TOOL_CERTIFICATE_NAME=your-cert-name
```

### 4. Build Komutu

```bash
# Normal build (sertifika varsa imzalar)
npm run build

# İmzalama olmadan
CSC_IDENTITY_AUTO_DISCOVERY=false npm run build
```

---

## macOS Code Signing & Notarization

### 1. Apple Developer Program

Apple Developer Program üyeliği gereklidir ($99/yıl).

### 2. Gerekli Sertifikalar

- Developer ID Application
- Developer ID Installer (opsiyonel)

### 3. electron-builder.yml Yapılandırması

```yaml
mac:
  target:
    - dmg
    - zip
  hardenedRuntime: true
  gatekeeperAssess: false
  entitlements: build/entitlements.mac.plist
  entitlementsInherit: build/entitlements.mac.plist

afterSign: scripts/notarize.js
```

### 4. Notarization Script

```javascript
// scripts/notarize.js
const { notarize } = require('@electron/notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') return;

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: 'com.yourcompany.lms-desktop',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID
  });
};
```

### 5. Environment Variables (macOS)

```bash
APPLE_ID=your@email.com
APPLE_ID_PASSWORD=app-specific-password
APPLE_TEAM_ID=XXXXXXXXXX
```

---

## Linux

Linux için genellikle kod imzalama gerekmez, ancak GPG imzası eklenebilir.

---

## CI/CD Entegrasyonu (GitHub Actions Örneği)

```yaml
name: Build & Sign

on:
  push:
    tags:
      - 'v*'

jobs:
  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
        env:
          CSC_LINK: ${{ secrets.WINDOWS_CERTIFICATE }}
          CSC_KEY_PASSWORD: ${{ secrets.WINDOWS_CERT_PASSWORD }}

  build-mac:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
        env:
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_ID_PASSWORD: ${{ secrets.APPLE_ID_PASSWORD }}
          APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
```

---

## Checklist

- [ ] Sertifika satın alındı
- [ ] Environment variables ayarlandı
- [ ] electron-builder.yml güncellendi
- [ ] Test build yapıldı
- [ ] SmartScreen/Gatekeeper testi başarılı
- [ ] CI/CD secrets eklendi
