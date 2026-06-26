# Internship Information System (IIS) Simulation

Bu proje, bir üniversitenin Bilgisayar Mühendisliği Bölümü için geliştirilmiş modern, güvenli ve adımsal (stepper-driven) bir **Staj Bilgi Sistemi Frontend Simülasyonudur**. Eski ve hantal otomasyon arayüzleri yerine; sıkı form doğrulamaları, dinamik belge üretim havuzları ve esnek durum yönetimleri barındıran modern bir SaaS (yazılım) çizgisi hedeflenerek inşa edilmiştir.

## 🚀 Öne Çıkan Özellikler

- **Gelişmiş Kayıt & Güvenlik Kapısı:**
    - **Algoritmik E-Posta Eşleşmesi:** Öğrenci numarası girildiği an (`20XXXXXXX`), üniversite kurumsal mail formatı (`cXXXXXXX@student.cankaya.edu.tr`) arka planda dinamik (derived state) olarak hesaplanır ve eşlenik olmayan kayıtlar engellenir.
    - **Canlı Şifre Denetleyicisi:** 8-24 karakter arası uzunluk, en az 1 sayı ve en az 1 sembol yasal zorunlulukları, kullanıcı şifreyi yazdığı an dinamik tik (`✓`) ve çarpı (`✗`) işaretleriyle görsel olarak doğrulanır.
    - **6 Haneli Güvenli OTP Simülasyonu:** Kayıt ve şifre sıfırlama adımlarında tarayıcı katmanında simüle edilen 6 haneli doğrulama kodları ile gatekeeper lojiği işletilir.
- **Doğrusal İş Akışı (Multi-Step Stepper / Wizard Flow):**
    - Giriş yapan kullanıcı doğrudan karmaşık bağlantılarla baş başa bırakılmaz. Soldan sağa akan 4 adımlı akıllı bir kılavuz barı ile yönlendirilir.
    - Önceki adımlar eksiksiz tamamlanıp kaydedilmeden sonraki adımların kilitleri açılmaz (`maxUnlockedStep` durum makinesi kontrolü).
- **Baskıya Hazır Resmi Belge Jeneratörü (Adım 2):**
    - İlk adımda girilen yasal staj verileri (Firma adı, T.C. numarası, tarih aralıkları), Adım 2'deki resmi **Zorunlu Stajyer Öğrenci Sigorta Giriş Formu** şablonuna canlı enjekte edilir.
    - A4 baskı standartlarına (`@media print`) tam uyumlu arayüz sayesinde tek tıkla resmi PDF çıktısı alınabilir.
- **Başvuru Sonrası Yönetim Merkezi (Management Console):**
    - Tüm adımlar tamamlanıp başvuru kilitlendiğinde (`isFinalized`), adımsal arayüz yerini tüm verilerin tek ekrandan izlenebildiği gelişmiş bir yönetim paneline bırakır.
    - Öğrenci staj amiri bilgilerini, akademik parametrelerini veya işsizlik fonu devlet katkısı yasal beyanlarını bu panel üzerinden anlık revize edebilir.
- **Tam Dil Senkronizasyonu (TR/EN Localization):**
    - Dış vitrindeki mevzuatlardan, dashboard kılavuz butonlarına ve form hata mesajlarına kadar tüm sistem TR ve EN dillerine anlık olarak senkronize şekilde tercüme edilir.

## 🛠️ Kullanılan Teknolojiler

- **Framework:** [React 18](https://react.dev/) (Functional Components, Hooks)
- **Build Tool:** [Vite](https://vitejs.dev/) (Fast Light-weight Bundler)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Utility-first framework)
- **Code Quality:** [ESLint](https://eslint.org/) (Strict react-hooks rules)

## 📁 Proje Yapısı

```text
src/
├── assets/
│   └── bilgisayar.png        # Kurumsal logo ve amblemler
├── components/
│   ├── LoginPortal.jsx      # Giriş, Kayıt, Canlı Şifre Kriterleri & OTP Katmanı
│   └── Dashboard.jsx        # Stepper, Form Girişleri, Yazdırılabilir PDF & Kontrol Paneli
├── App.jsx                  # Ana Trafik Denetleyicisi, Dil Sözlükleri & Dış Vitrin
├── App.css                  # Kurumsal renk paletleri ve genel stil override kuralları
└── main.jsx                 # Uygulama kök render noktası
```

````

## 💻 Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda ayağa kaldırmak için aşağıdaki adımları takip edebilirsiniz:

1. **Depoyu Klonlayın:**

```bash
git clone https://github.com/yagizylldrm/cengstaj-prototip.git
cd cengstaj-prototip

```

2. **Bağımlılıkları Yükleyin:**

```bash
npm install

```

3. **Geliştirici Sunucusunu Başlatın:**

```bash
npm run dev

```

Tarayıcınızda `http://localhost:5173` adresine giderek projeyi canlı olarak test edebilirsiniz. 4. **Üretim (Production) Derlemesi Almak İçin:**

```bash
npm run build

```

## ⚙️ Lisans ve Kullanım Kuralları

Bu proje eğitim, frontend durum mimarisi simülasyonu ve UI/UX prototipleme amacıyla geliştirilmiştir. Herhangi bir ticari ya da resmi veri tabanı bağlantısı (backend) barındırmaz, veriler yerel React state'leri üzerinde simüle edilir.

```

```
````
