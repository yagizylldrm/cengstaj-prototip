# CENG Staj Bilgi Sistemi (IIS Prototipi)

Bu proje, Çankaya Üniversitesi Bilgisayar Mühendisliği Bölümü için geliştirilmiş modern, güvenli ve adımsal (stepper-driven) bir **Staj Bilgi Sistemi (IIS) Prototipidir**. 

Proje, frontend durum yönetimi, tam doğrulamalı form akışları, otomatik yasal belge üretimi ve PostgreSQL veritabanı bağlantılı gerçekçi bir .NET backend katmanı barındıran tam donanımlı (Full-Stack) bir uygulamadır.

---

## Öne Çıkan Özellikler

- **Adımsal Başvuru Sihirbazı (4-Step Stepper Wizard):** Öğrenciler CENG 200/300 başvurularını doğrusal bir akışla (Firma Bilgileri, Belge Onayı, Amir Bilgileri, Beyanlar) tamamlar. Adımlar tamamlandıkça bir sonraki aşama kilit açma mekanizmasıyla aktif hale gelir.
- **Baskıya Hazır Resmi Belge Jeneratörü (Adım 2):** Girilen yasal staj verileri, resmi **Zorunlu Stajyer Öğrenci Sigorta Giriş Formu** şablonuna canlı enjekte edilir. A4 formatına tam uyumlu `@media print` tasarımı ile tek tıkla yazdırma veya PDF kaydetme imkanı sunar.
- **Yönetim ve Takip Konsolu:** Başvuru kilitlendikten sonra (Finalized), adımsal sihirbaz yerini verilerin tek ekrandan izlenebildiği ve güncellenebildiği gelişmiş bir yönetim paneline bırakır.
- **Kurumsal Güvenlik & Doğrulamalar:**
  - **Canlı Şifre Denetleyicisi:** En az 8-24 karakter, 1 sayı, 1 büyük harf ve 1 sembol kuralları canlı doğrulanır.
  - **Algoritmik E-Posta Eşleşmesi:** Öğrenci numarası girildiğinde Çankaya Üniversitesi kurumsal e-posta formatı otomatik hesaplanır.
  - **BCrypt Şifreleme:** Backend tarafında kullanıcı şifreleri BCrypt algoritması ile güvenli şekilde hash'lenerek veritabanına mühürlenir.
- **Scalar API Playground:** Backend API uçları, modern ve karanlık temalı Scalar arayüzü ile dökümante edilmiştir.

---

## Kullanılan Teknolojiler

### Backend
- **Framework:** .NET 10.0 Web API
- **ORM:** Entity Framework Core
- **Database:** PostgreSQL (Npgsql)
- **API Documentation:** Scalar.AspNetCore (OpenAPI v1.json)
- **Security:** BCrypt.Net-Next

### Frontend
- **Framework:** React 19 (Functional Components, Hooks)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS & Vanilla CSS (Kurumsal renk paletleri)
- **Localization:** TR/EN tam dil senkronizasyonu

---

## Proje Yapısı

```text
cengstaj-prototip/
├── CengStaj.Backend/          # .NET 10 Web API Backend Uygulaması
│   ├── Controllers/           # Auth ve Internship Controller Sınıfları
│   ├── Data/                  # DbContext ve Veritabanı Yapılandırması
│   ├── Models/                # Entity Modelleri (Student, Internship, Supervisor)
│   ├── Program.cs             # API Başlangıç Noktası ve Servis Tanımları
│   └── appsettings.json       # Veritabanı Bağlantı Dizesi ve Konfigürasyonlar
│
├── CengStaj.Frontend/         # React + Vite Frontend Uygulaması
│   └── src/
│       ├── components/        # LoginPortal ve Dashboard Bileşenleri
│       ├── App.jsx            # Ana Yönlendirici, Dış Vitrin ve Dil Tercihleri
│       └── App.css            # Kurumsal Stil Kuralları
│
├── cengstaj.bat               # Windows Yönetim ve Kolay Çalıştırma Betiği
├── cengstaj.sh                # macOS/Linux Yönetim ve Kolay Çalıştırma Betiği
└── docker-compose.yml         # PostgreSQL ve pgAdmin Servis Konfigürasyonu
```

---

## Kurulum ve Çalıştırma

Projeyi yerel ortamınızda ayağa kaldırmak için işletim sisteminize uygun betiği kullanabilirsiniz (macOS/Linux için `cengstaj.sh`, Windows için `cengstaj.bat`).

### 1. Bağımlılıkları Yükleyin ve Veritabanını Başlatın
Kök dizinde şu komutla veritabanını başlatabilir, .NET bağımlılıklarını restore edebilir ve frontend bağımlılıklarını kurabilirsiniz:

- **macOS/Linux:**
  ```bash
  chmod +x cengstaj.sh
  ./cengstaj.sh install
  ```
- **Windows:**
  ```cmd
  cengstaj.bat install
  ```

### 2. Veritabanı Migrasyonlarını Çalıştırın
Veritabanı tablolarını oluşturmak için:
```bash
cd CengStaj.Backend
dotnet ef database update
cd ..
```

### 3. Tüm Sistemi Başlatın
Docker veritabanını, arka planda .NET Web API backend'i ve ön planda React frontend'i tek komutla başlatabilirsiniz:

- **macOS/Linux:**
  ```bash
  ./cengstaj.sh start
  ```
- **Windows:**
  ```cmd
  cengstaj.bat start
  ```

*Bu komutla:*
- *Docker veritabanı denetlenir ve başlatılır.*
- *Backend API arka planda ayağa kalkar (macOS/Linux'ta loglar `backend.log` dosyasına yazılır, Windows'ta simge durumunda küçültülmüş ayrı bir komut penceresinde çalışır) ve **`http://localhost:5202/scalar/v1`** adresinde API dökümantasyonunu sunar.*
- *React frontend geliştirme sunucusu ön planda çalışarak tarayıcınızda otomatik olarak açılır.*
- *macOS/Linux'ta terminalde `Ctrl+C` yaptığınızda, betik otomatik olarak arka plandaki .NET sürecini güvenle sonlandırır.*

---

## Yönetim Betiği Komutları

Kök dizinde yer alan `cengstaj.sh` ve `cengstaj.bat` şu komutları destekler:
- `install` -> Docker veritabanını başlatır, .NET bağımlılıklarını restore eder ve frontend bağımlılıklarını (`npm install`) yükler.
- `start` -> Veritabanını, backend API'yi ve React frontend'i aynı anda başlatır.
- `dev` -> Sadece React geliştirici sunucusunu ayağa kaldırır.
- `build` -> React uygulamasını üretim (production) ortamı için derler.
- `clean` -> Derleme çıktılarını ve logları siler, Docker veritabanı konteynerlerini durdurur (`docker compose down`).
- `reset` -> Tüm önbellek, bağımlılık ve konteynerleri temizleyip sıfırdan temiz kurulum yapar.
