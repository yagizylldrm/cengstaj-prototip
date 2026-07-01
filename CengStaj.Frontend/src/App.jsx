import { useState } from "react";
import "./App.css";
import okulLogosu from "./assets/bilgisayar.png";
import LoginPortal from "./components/LoginPortal";
import Dashboard from "./components/Dashboard";

const menuKeys = ["Home", "Announcement", "Guidelines", "FAQ", "Login"];

const translations = {
    tr: {
        title: "T.C. ÇANKAYA ÜNİVERSİTESİ",
        subtitle: "Bilgisayar Mühendisliği Bölümü • CENG 200 & 300 Yaz Stajı",
        menuLabels: [
            "Ana Sayfa",
            "Duyurular",
            "Mevzuat & Formlar",
            "SSS",
            "Sisteme Giriş",
        ],
        activeBadge: "2026 Dönemi Aktif",
        footer: "ÇANKAYA ÜNİVERSİTESİ • BİLGİSAYAR MÜHENDİSLİĞİ BÖLÜMÜ BİLGİ İŞLEM ALTYAPISI • © 2026",

        home: {
            title: "2026 Yaz Stajı Başvuruları",
            rules: [
                "<a href='/belgeler/cengstaj_presentation_2026.pdf' target='_blank' rel='noopener noreferrer' class='text-cu-lacivert font-bold underline hover:text-cu-kirmizi transition-colors'>2026 staj bilgilendirme sunumumuzu</a> inceleyiniz.",
                "cengstaj.cankaya.edu.tr sayfasına bilgilerinizi kontrol ederek kayıt olunuz. Kayıt sırasında lütfen Çankaya Üniversitesi Öğrenci e-posta adresinizi kullanınız.",
                "Firma Staj Zorunluluk Belgesi isterse <a href='/belgeler/cengstajzorunlulukbelgesi.pdf' target='_blank' rel='noopener noreferrer' class='text-cu-lacivert font-bold underline hover:text-cu-kirmizi transition-colors'>this link'teki</a> belgenin çıktısını alıp doldurarak firmaya teslim ediniz.",
                "Staj tarih aralığınız 29 Mayıs 2026 tarihinden önce 'Stajyer Bilgi Formu' ile en az 20 iş günü olarak sisteme girilmelidir. Yaz okuluna katılacak öğrenciler için staj tarih aralığı 19 Ağustos - 28 Eylül 2026 (20 iş günü) olarak belirtilmelidir.",
                "Sistemdeki tarihler ve kişisel bilgileriniz kullanılarak 'Stajyer Öğrenci Sigorta Giriş Formu' otomatik olarak sistemden üretilecektir. Belgenin çıktısını alıp imzalayarak 29 Mayıs 2026 tarihinden önce bölüm staj koordinatörlüğüne elden teslim ediniz.",
                "Firmadan alınan 'Kabul Belgesi'ni (örnek kabul belgesi için <a href='/belgeler/stajKabulOrnek.docx' download class='text-cu-lacivert font-bold underline hover:text-cu-kirmizi transition-colors'>tıklayın</a>) 29 Mayıs 2026 tarihinden önce bölüm staj koordinatörlüğüne elden teslim ediniz.",
                "e-Devlet Kapısı üzerinden üretebileceğiniz 'Sosyal Güvenlik Kurumu SPAS Müstehaklık Belgesi'ni 29 Mayıs 2026 tarihinden önce bölüm staj koordinatörlüğüne elden teslim ediniz.",
                "Stajyer öğrencilerimize 2018 Yaz Döneminden itibaren Özel Firmalar tarafından yaz stajı sonunda ücret ödemesi yapılarak, Devlet (İşsizlik Fonu) Katkısı talep edilebilir.",
                "Bu nedenle stajını tamamlayan her öğrenci staj sonunda sistemden otomatik üretilecek 'Staj Ücretlerine İşsizlik Fonu Katkısı Bilgi Formu' çıktısını alarak, Firma ile birlikte belgeyi imzalamalıdır.",
                "Staj 20 işgünü bitiminde, 'Staj Ücretlerine İşsizlik Fonu Katkısı Bilgi Formu' ve ücret ödendi ise banka dekontu aslı elden staj koordinatörlüğüne teslim edilir.",
            ],
        },
        announcement: {
            title: "Bölüm Staj Duyuruları",
            rules: [
                "Staj resmi kuralları gereği, en az ardışık 20 iş günü tamamlanması zorunludur. Cumartesi, pazar ve resmi tatiller iş günü sayılmaz.",
                "Lütfen Yaz Stajı Mühendislik Fakültesi Staj Yönergesini dikkatlice okuyunuz <a href='/belgeler/MF_StajYonergesi.pdf' target='_blank' class='text-cu-kirmizi font-bold underline hover:text-cu-lacivert'>(Yönerge Linki)</a>",
            ],
            subTitle: "Staj Öncesi Ön Koşul ve Kurallar:",
            processes: [
                "CENG 200 önkoşul dersi: CENG 114. CENG 300 önkoşul dersi: CENG 200'dür.",
                "Aynı yaz döneminde iki zorunlu staj birden kesinlikle yapılamaz (Mezun durumundakiler hariç).",
                "Staj amirinizin (sorumlunuzun) Bilgisayar Mühendisliği alanında deneyimli bir mühendis olması zorunludur.",
            ],
        },
        guidelines: {
            title: "Mevzuat & Resmi Formlar",
            subTitle: "Tesliminden ve takibinden sorumlu olduğunuz belgeler",
            links: [
                {
                    name: "1. Mühendislik Fakültesi Staj Yönergesi (.pdf)",
                    file: "MF_StajYonergesi.pdf",
                },
                {
                    name: "2. Bilgisayar Mühendisliği Bölümü Staj Kılavuzu (.pdf)",
                    file: "internshipGuide.pdf",
                },
                {
                    name: "3. Staj Değerlendirme Formu ve Staj Günlüğü (.docx)",
                    file: "InternEvalJournal.docx",
                },
                {
                    name: "4. Stajyer Öğrenci Öz Değerlendirme Formu (.docx)",
                    file: "InternSelfEval.docx",
                },
                {
                    name: "5. Notlandırma Kriterleri ve Akademik Değerlendirme Formu (.doc)",
                    file: "GradeForm.doc",
                },
                {
                    name: "6. Örnek Resmi 'Staj Kabul Belgesi' Şablonu (.docx)",
                    file: "stajKabulOrnek.docx",
                },
                {
                    name: "7. CENG Teknik Staj Raporu Yazım Word Şablonu (.docx)",
                    file: "Internship Report.docx",
                },
                {
                    name: "8. Gönüllü Staj Başvuru ve Sigorta Beyan Formu (.xlsx)",
                    file: "Sigorta_giris_gonullu_staj.xlsx",
                },
            ],
        },
        faq: {
            title: "Sıkça Sorulan Sorular",
            items: [
                {
                    name: "❓ SIKÇA SORULAN SORULAR VE SİSTEM REHBERİ (FAQ)",
                    file: "faq_2026.pdf",
                },
                {
                    name: "📘 CENG TEKNİK STAJ RAPORU YAZIM ŞABLONU (.docx)",
                    file: "Internship Report.docx",
                },
            ],
        },
        contact: {
            title: "✉️ Staj Koordinatörlüğü İletişim",
            emailLabel: "E-posta:",
            addressLabel: "Yazışma Adresi:",
            commissionLabel: "Staj Komisyonu Üyeleri:",
            email: "ceng@cankaya.edu.tr",
            address:
                "Bilgisayar Mühendisliği Staj Koordinatörlüğü, Çankaya Üniversitesi Merkez Kampüs Yukarıyurtçu Mah. Mimar Sinan Cad. No:4, 06790 Etimesgut / Ankara",
            staff: [
                {
                    role: "Staj Koordinatörü",
                    name: "Dr. Öğr. Üyesi Serdar Arslan",
                },
                {
                    role: "Staj Koordinatör Asistanı",
                    name: "Ar. Gör. Simay Eke",
                },
            ],
        },
    },
    en: {
        title: "ÇANKAYA UNIVERSITY",
        subtitle:
            "Department of Computer Engineering • CENG 200 & 300 Summer Internship",
        menuLabels: [
            "Home",
            "Announcements",
            "Guidelines & Forms",
            "FAQ",
            "Portal Login",
        ],
        activeBadge: "2026 Term Active",
        footer: "ÇANKAYA UNIVERSITY • DEPARTMENT OF COMPUTER ENGINEERING IT INFRASTRUCTURE • © 2026",

        home: {
            title: "2026 Summer Internship Applications",
            rules: [
                "Review our <a href='/belgeler/cengstaj_presentation_2026.pdf' target='_blank' rel='noopener noreferrer' class='text-cu-lacivert font-bold underline hover:text-cu-kirmizi transition-colors'>2026 internship information presentation</a>.",
                "Register by checking your information on the cengstaj.cankaya.edu.tr page. Please use your student email.",
                "If the company requests a Compulsory Internship Document, print and fill out the document at <a href='/belgeler/cengstajzorunlulukbelgesi.pdf' target='_blank' rel='noopener noreferrer' class='text-cu-lacivert font-bold underline hover:text-cu-kirmizi transition-colors'>this link</a>.",
                "Your internship date range must be entered into the system with the 'Intern Candidate Info Form' at least 20 working days before May 29, 2026.",
                "The 'Internship Student Insurance Entry Form' will be generated automatically. Print, sign, and hand it to the coordinator before May 29, 2026.",
                "Submit the 'Acceptance Letter' received from the company to the department internship coordinator by hand (click <a href='/belgeler/stajKabulOrnek.docx' download class='text-cu-lacivert font-bold underline hover:text-cu-kirmizi transition-colors'>here</a> for a sample template) before May 29, 2026.",
            ],
        },
        announcement: {
            title: "Announcements",
            rules: [
                "Nationwide Vacation days and health reports in the period of the internship are not taken into account in the fulfillment of the 20 consecutive work days.",
                "Please read the Summer Internship Engineering Faculty Regulations <a href='/belgeler/MF_StajYonergesi.pdf' target='_blank' class='text-cu-kirmizi font-bold underline hover:text-cu-lacivert'>(Link)</a>",
            ],
            subTitle: "Pre-Internship Processes:",
            processes: [
                "CENG 200 prerequisite: CENG 114. CENG 300 prerequisite: CENG 200.",
                "Two compulsory internships cannot be performed in the same summer term.",
                "The supervisor of the summer intern must be a registered engineer.",
            ],
        },
        guidelines: {
            title: "Regulations & Forms",
            subTitle: "That you are responsible from",
            links: [
                {
                    name: "1. Engineering Faculty Regulations",
                    file: "MF_StajYonergesi.pdf",
                },
                {
                    name: "2. Computer Engineering Guideline",
                    file: "internshipGuide.pdf",
                },
                {
                    name: "3. Internship Evaluation Form and Journal",
                    file: "InternEvalJournal.docx",
                },
                {
                    name: "4. Internee Self Evaluation Form",
                    file: "InternSelfEval.docx",
                },
                { name: "5. Grading Criteria and Form", file: "GradeForm.doc" },
                {
                    name: "6. Example 'Internship Acceptance Letter'",
                    file: "stajKabulOrnek.docx",
                },
                {
                    name: "7. A Word Template for the Internship Report",
                    file: "Internship Report.docx",
                },
                {
                    name: "8. Voluntary Internship Application Form",
                    file: "Sigorta_giris_gonullu_staj.xlsx",
                },
            ],
        },
        faq: {
            title: "Frequently Asked Questions",
            items: [
                {
                    name: "❓ FREQUENTLY ASKED QUESTIONS (FAQ)",
                    file: "faq_2026.pdf",
                },
                {
                    name: "📘 CENG TECHNICAL INTERNSHIP REPORT TEMPLATE (.docx)",
                    file: "Internship Report.docx",
                },
            ],
        },
        contact: {
            title: "✉️ Internship Coordinator Contact",
            emailLabel: "Email:",
            addressLabel: "Posting Address:",
            commissionLabel: "Committee Members:",
            email: "ceng@cankaya.edu.tr",
            address:
                "Computer Engineering Internship Coordinator, Çankaya University Yukarıyurtçu District Mimar Sinan Ave. No:4, 06790 Etimesgut / Ankara",
            staff: [
                {
                    role: "Internship Coordinator",
                    name: "Dr. Lecturer Serdar Arslan",
                },
                {
                    role: "Internship Coordinator Assistant",
                    name: "Res. Asst. Simay Eke",
                },
            ],
        },
    },
};

export default function CengInternshipPortal() {
    const [lang, setLang] = useState("tr");
    const [activeTab, setActiveTab] = useState("Home");

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [studentNo, setStudentNo] = useState("");

    const t = translations[lang];

    // KONTROL ADIMI 1: Giriş Yapıldıysa, tüm vitrini kapatıp YENİ BAĞIMSIZ DASHBOARD'a yönlendir
    if (isLoggedIn) {
        return (
            <Dashboard
                lang={lang}
                setLang={setLang}
                studentNo={studentNo}
                onLogout={() => {
                    // 🔒 GÜVENLİK FIX'I: Oturum kapatıldığında kriptografik anahtar yerel hafızadan imha ediliyor
                    localStorage.removeItem("token");

                    setIsLoggedIn(false);
                    setActiveTab("Home");
                }}
                logo={okulLogosu}
            />
        );
    }

    // KONTROL ADIMI 2: Giriş sekmesi seçildi ama oturum yoksa izole aspx sayfasına yönlendir
    if (activeTab === "Login" && !isLoggedIn) {
        return (
            <LoginPortal
                lang={lang}
                setLang={setLang}
                logo={okulLogosu}
                onCancel={() => setActiveTab("Home")}
                onLoginSuccess={(no) => {
                    setStudentNo(no);
                    setIsLoggedIn(true);
                }}
            />
        );
    }

    return (
        <div className="w-full min-h-screen bg-cu-bg text-slate-800 font-sans antialiased flex flex-col">
            {/* ÜST LOGO VE KURUMSAL ŞERİT */}
            <header className="w-full bg-white border-b-2 border-cu-lacivert px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-center md:text-left">
                    <div className="w-16 h-16 flex items-center justify-center shrink-0">
                        <img
                            src={okulLogosu}
                            alt="Çankaya Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-cu-lacivert tracking-tight">
                            {t.title}
                        </h1>
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                            {t.subtitle}
                        </p>
                    </div>
                </div>

                <div className="inline-flex rounded border border-slate-300 bg-slate-100 p-0.5 shadow-sm font-mono text-xs">
                    <button
                        type="button"
                        onClick={() => setLang("tr")}
                        className={`px-3 py-1 font-bold rounded cursor-pointer ${lang === "tr" ? "bg-cu-lacivert text-white" : "text-slate-700 hover:bg-slate-200"}`}
                    >
                        TR
                    </button>
                    <button
                        type="button"
                        onClick={() => setLang("en")}
                        className={`px-3 py-1 font-bold rounded cursor-pointer ${lang === "en" ? "bg-cu-lacivert text-white" : "text-slate-700 hover:bg-slate-200"}`}
                    >
                        EN
                    </button>
                </div>
            </header>

            {/* AKADEMİK NAVBAR */}
            <nav className="w-full bg-cu-lacivert flex flex-wrap shadow-md">
                {menuKeys.map((key, index) => {
                    const label = t.menuLabels[index];
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setActiveTab(key)}
                            className={`py-3 px-6 font-bold uppercase text-xs tracking-wider transition-all duration-150 border-r border-slate-800 cursor-pointer
                            ${activeTab === key ? "bg-cu-altin text-cu-lacivert" : "text-slate-200 hover:bg-slate-800 hover:text-white"}`}
                        >
                            {label}
                        </button>
                    );
                })}
            </nav>

            {/* ANA PANEL */}
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* SOL VE ORTA PANEL */}
                <section className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-300 rounded shadow-sm p-6">
                        {activeTab === "Home" && (
                            <div>
                                <div className="border-b border-slate-200 pb-3 mb-4">
                                    <h2 className="text-xl font-bold text-cu-lacivert">
                                        {t.home.title}
                                    </h2>
                                </div>
                                <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                                    {t.home.rules.map((rule, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start gap-2.5 p-2 rounded hover:bg-slate-50"
                                        >
                                            <span className="font-mono font-bold text-cu-lacivert shrink-0">
                                                {idx + 1}.
                                            </span>
                                            <p
                                                dangerouslySetInnerHTML={{
                                                    __html: rule
                                                        .replace(
                                                            /29 Mayıs 2026/g,
                                                            '<span class="bg-cu-altin font-bold px-1 rounded border border-slate-300/60 text-cu-lacivert">29 Mayıs 2026</span>',
                                                        )
                                                        .replace(
                                                            /19 Ağustos - 28 Eylül 2026/g,
                                                            '<span class="text-cu-kirmizi font-bold bg-red-50 px-1 rounded">19 Ağustos - 28 Eylül 2026</span>',
                                                        ),
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "Announcement" && (
                            <div className="space-y-6">
                                <div>
                                    <div className="border-b border-slate-200 pb-3 mb-4">
                                        <h2 className="text-xl font-bold text-cu-lacivert">
                                            {t.announcement.title}
                                        </h2>
                                    </div>
                                    <ul className="space-y-3 text-sm text-slate-700 list-decimal pl-5 leading-relaxed">
                                        {t.announcement.rules.map((r, i) => (
                                            <li
                                                key={i}
                                                className="font-medium"
                                                dangerouslySetInnerHTML={{
                                                    __html: r,
                                                }}
                                            />
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeTab === "Guidelines" && (
                            <div>
                                <div className="border-b border-slate-200 pb-3 mb-4">
                                    <h2 className="text-xl font-bold text-cu-lacivert">
                                        {t.guidelines.title}{" "}
                                        <span className="text-sm font-normal text-slate-500 font-sans italic">
                                            {t.guidelines.subTitle}
                                        </span>
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                    {t.guidelines.links.map((link, i) => (
                                        <a
                                            key={i}
                                            href={`/belgeler/${link.file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block p-3 border border-slate-200 rounded hover:border-cu-lacivert hover:bg-slate-50/50 text-sm font-medium text-slate-700 transition-all shadow-sm"
                                        >
                                            {link.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "FAQ" && (
                            <div>
                                <div className="border-b border-slate-200 pb-3 mb-4">
                                    <h2 className="text-xl font-bold text-cu-lacivert">
                                        {t.faq.title}
                                    </h2>
                                </div>
                                <div className="space-y-3 mt-4">
                                    {t.faq.items.map((item, i) => (
                                        <a
                                            key={i}
                                            href={`/belgeler/${item.file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block p-4 border-l-4 border-cu-altin bg-slate-50 rounded text-sm font-bold text-cu-lacivert hover:bg-slate-100 transition-colors shadow-sm"
                                        >
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* SAĞ PANEL: KALICI RESMİ İLETİŞİM BLOKU */}
                <section className="space-y-6">
                    <div className="bg-white border border-slate-300 border-t-4 border-t-cu-lacivert rounded shadow-sm p-6">
                        <h3 className="font-bold text-sm text-cu-lacivert uppercase tracking-wider border-b border-slate-100 pb-3 mb-4">
                            {t.contact.title}
                        </h3>
                        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                            <p>
                                <strong className="text-slate-900 block mb-0.5">
                                    {t.contact.emailLabel}
                                </strong>{" "}
                                <a
                                    href={`mailto:${t.contact.email}`}
                                    className="text-cu-lacivert underline font-semibold text-sm"
                                >
                                    {t.contact.email}
                                </a>
                            </p>
                            <p>
                                <strong className="text-slate-900 block mb-0.5">
                                    {t.contact.addressLabel}
                                </strong>{" "}
                                <span className="text-slate-600 font-medium">
                                    {t.contact.address}
                                </span>
                            </p>

                            <div className="pt-4 border-t border-slate-100 space-y-3">
                                <strong className="text-slate-900 block text-[11px] uppercase tracking-wide">
                                    {t.contact.commissionLabel}
                                </strong>
                                {t.contact.staff.map((staff, i) => (
                                    <div
                                        key={i}
                                        className="p-3 bg-slate-50 border border-slate-200 rounded shadow-xs"
                                    >
                                        <p className="text-[10px] font-bold text-cu-kirmizi uppercase tracking-wider">
                                            {staff.role}
                                        </p>
                                        <p className="text-xs font-bold text-slate-900 mt-0.5">
                                            {staff.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* RESMİ FOOTER */}
            <footer className="w-full bg-cu-lacivert text-slate-400 p-4 text-center text-[11px] border-t border-slate-800 mt-auto font-medium tracking-wide">
                {t.footer}
            </footer>
        </div>
    );
}
