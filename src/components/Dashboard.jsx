import { useState } from "react";

export default function Dashboard({
    lang,
    setLang,
    studentNo,
    onLogout,
    logo,
}) {
    const [currentStep, setCurrentStep] = useState(1);
    const [maxUnlockedStep, setMaxUnlockedStep] = useState(1);

    // Başvuru finalizasyon durumu
    const [isFinalized, setIsFinalized] = useState(false);

    // Düzenleme modlarının takibi
    const [isEditingStaj, setIsEditingStaj] = useState(false);
    const [isEditingSupervisor, setIsEditingSupervisor] = useState(false);

    // Adım 1: Resmi Staj Bilgileri State'i
    const [stajData, setStajData] = useState({
        academicYear: "2026/2027",
        courseCode: "CENG 200",
        tcNo: "",
        firstName: "",
        lastName: "",
        phone: "",
        faculty: "Mühendislik Fakültesi",
        department: "Bilgisayar Mühendisliği",
        minor: "Yok",
        type: "Zorunlu",
        startDate: "",
        endDate: "",
        company: "",
    });

    // Adım 3: Yetkili Kişi Bilgileri State'i
    const [supervisor, setSupervisor] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
    });

    // Adım 4: Devlet Katkısı Checkbox State'i
    const [unemploymentFund, setUnemploymentFund] = useState(false);

    const t = {
        tr: {
            panelTitle: "STAJ BİLGİ SİSTEMİ",
            subTitle: "Öğrenci Kontrol Otomasyonu",
            welcome: "Hoş Geldiniz,",
            logoutBtn: "Güvenli Çıkış",
            steps: [
                "1. Staj Bilgilerini Gir",
                "2. Üretilen Formu İndir",
                "3. Yetkili Kişi Bilgisi",
                "4. İşsizlik Katkısı Beyanı",
            ],
            step1: {
                title: "Adım 1: Resmi Staj Başvuru Verilerinin Beyanı",
                btn: "Bilgileri Kaydet ve Form Üretimine Geç",
            },
            step2: {
                title: "Adım 2: Otomatik Hazırlanan Sigorta Giriş Formu",
                desc: "İlk adımda girdiğiniz verilre göre resmi dilekçeniz otomatik doldurulmuştur. Yazdırıp imzalayarak teslim ediniz.",
                printBtn: "Belgeyi Yazdır / PDF Kaydet",
                nextBtn: "Yetkili Kişi Adımına Geç →",
            },
            step3: {
                title: "Adım 3: Kurumsal Yetkili Kişi / Staj Amiri Bilgileri",
                fields: [
                    "Staj Amiri Adı",
                    "Staj Amiri Soyadı",
                    "Staj Amiri Telefon No",
                    "Kurumsal İş E-Postası",
                ],
                btn: "Yetkiliyi Kaydet ve Son Adıma Geç",
            },
            step4: {
                title: "Adım 4: İşsizlik Fonu Devlet Katkısı Yasal Beyanı",
                checkLabel:
                    "Staj yaptığım özel kurum staj sonunda bana yasal ücret ödemesi yapacaktır ve devlet katkısı teşviki talep etmektedir.",
                finishBtn: "Tüm Başvuruyu Onayla ve Sistem Verilerini Kilitle",
                success:
                    "Tebrikler! Tüm staj başvuru adımlarınız başarıyla sisteme işlendi ve veri tabanına kilitlendi.",
            },
            mgmt: {
                editBtn: "Düzenle",
                saveBtn: "Değişiklikleri Kaydet",
                cancelBtn: "İptal Et",
                secStaj: "Staj ve Akademik Bilgiler",
                secAmir: "Yetkili Firma Amiri Bilgileri",
                secEvrak: "Çıktı ve Belge Havuzu",
                evrakDesc:
                    "Koordinatörlüğe elden teslim etmeniz gereken yasal evrakların güncel dökümünü buradan alabilirsiniz.",
                evrakLink: "Sigorta Giriş Formunu Yeniden Yazdır / PDF İndir",
                fundStatus: "İşsizlik Katkısı Durumu:",
                fundTrue:
                    "Özel firmadan ücret alınacak (Teşvik Talep Ediliyor)",
                fundFalse: "Devlet katkısı talep edilmiyor",
            },
        },
        en: {
            panelTitle: "INTERNSHIP INFORMATION SYSTEM",
            subTitle: "Student Automation Dashboard",
            welcome: "Welcome,",
            logoutBtn: "Secure Logout",
            steps: [
                "1. Enter Staj Info",
                "2. Download Form",
                "3. Supervisor Info",
                "4. Fund Declaration",
            ],
            step1: {
                title: "Step 1: Declaration of Official Internship Details",
                btn: "Save Information & Proceed to Document",
            },
            step2: {
                title: "Step 2: Automatically Generated Insurance Form",
                desc: "Your official petition has been automatically compiled based on your inputs. Print, sign, and submit.",
                printBtn: "Print Document / Save PDF",
                nextBtn: "Proceed to Supervisor Step →",
            },
            step3: {
                title: "Step 3: Corporate Supervisor / Engineer Details",
                fields: [
                    "First Name",
                    "Last Name",
                    "Engineer Phone No",
                    "Corporate Business Email",
                ],
                btn: "Save Supervisor & Proceed to Final Step",
            },
            step4: {
                title: "Step 4: Unemployment Fund Legal Declaration",
                checkLabel:
                    "The private company will pay me an official salary and requests the state financial contribution reimbursement.",
                finishBtn: "Complete Application & Lock Database Record",
                success:
                    "Congratulations! All internship application steps have been successfully locked into the central database.",
            },
            mgmt: {
                editBtn: "Edit",
                saveBtn: "Save Changes",
                cancelBtn: "Cancel",
                secStaj: "Internship & Academic Details",
                secAmir: "Supervisor Information",
                secEvrak: "Document Repository",
                evrakDesc:
                    "You can download the latest generated copy of the official forms required by the department coordinator.",
                evrakLink: "Reprint Insurance Form / Save PDF",
                fundStatus: "Unemployment Fund:",
                fundTrue: "Salary claimed (State subsidy requested)",
                fundFalse: "No state financial subsidy requested",
            },
        },
    }[lang];

    const handleStepNav = (stepNumber) => {
        if (stepNumber <= maxUnlockedStep) setCurrentStep(stepNumber);
    };

    const nextFromStep1 = (e) => {
        e.preventDefault();
        setMaxUnlockedStep(2);
        setCurrentStep(2);
    };

    const nextFromStep3 = (e) => {
        e.preventDefault();
        setMaxUnlockedStep(4);
        setCurrentStep(4);
    };

    const handleFinalSubmit = (e) => {
        e.preventDefault();
        alert(t.step4.success);
        setIsFinalized(true);
    };

    return (
        <div className="w-full min-h-screen bg-slate-100 font-sans antialiased flex flex-col">
            {/* Üst Profil & Kontrol Barı */}
            <header className="w-full bg-[#2f4973] text-white px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center font-bold">
                        <img
                            src={logo}
                            alt="CENG Logo"
                            className="w-16 h-16 object-contain drop-shadow-xs"
                        />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-wider">
                            {t.panelTitle}
                        </h1>
                        <p className="text-xs text-slate-300 font-medium">
                            {t.subTitle}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                        <p className="text-xs text-slate-300 font-medium">
                            {t.welcome}
                        </p>
                        <p className="text-sm font-black text-white">
                            {stajData.firstName || "ÖĞRENCİ"}{" "}
                            {stajData.lastName || "ADI"}{" "}
                            <span className="text-xs font-mono font-normal text-slate-300">
                                ({studentNo || "20XXXXXXX"})
                            </span>
                        </p>
                    </div>

                    <div className="inline-flex rounded-lg border border-white/20 bg-white/10 p-0.5 text-xs font-mono">
                        <button
                            type="button"
                            onClick={() => setLang("tr")}
                            className={`px-2.5 py-1 font-bold rounded-md transition-colors cursor-pointer ${lang === "tr" ? "bg-white text-[#2f4973]" : "text-slate-200 hover:bg-white/10"}`}
                        >
                            TR
                        </button>
                        <button
                            type="button"
                            onClick={() => setLang("en")}
                            className={`px-2.5 py-1 font-bold rounded-md transition-colors cursor-pointer ${lang === "en" ? "bg-white text-[#2f4973]" : "text-slate-200 hover:bg-white/10"}`}
                        >
                            EN
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={onLogout}
                        className="text-xs bg-red-600/80 hover:bg-red-600 border border-red-500/30 text-white px-3 py-2 rounded-lg font-bold shadow-xs transition-colors cursor-pointer"
                    >
                        ❌ {t.logoutBtn}
                    </button>
                </div>
            </header>

            {/* GÖRÜNÜM A: DETAYLI DASHBOARD YÖNETİM MERKEZİ (image_d7563d.png üst kısmı silindi) */}
            {isFinalized ? (
                <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Sol İki Kolon: Veri Kartları */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* KART 1: STAJ VE AKADEMİK BİLGİLER */}
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                                        {t.mgmt.secStaj}
                                    </h3>
                                    {!isEditingStaj && (
                                        <button
                                            onClick={() =>
                                                setIsEditingStaj(true)
                                            }
                                            className="text-xs text-[#2f4973] font-bold hover:underline cursor-pointer"
                                        >
                                            {t.mgmt.editBtn}
                                        </button>
                                    )}
                                </div>

                                {isEditingStaj ? (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            setIsEditingStaj(false);
                                        }}
                                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700"
                                    >
                                        <div>
                                            <label className="block mb-1 text-slate-500">
                                                Öğrenci Adı
                                            </label>
                                            <input
                                                type="text"
                                                value={stajData.firstName}
                                                onChange={(e) =>
                                                    setStajData({
                                                        ...stajData,
                                                        firstName:
                                                            e.target.value.toUpperCase(),
                                                    })
                                                }
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-slate-500">
                                                Öğrenci Soyadı
                                            </label>
                                            <input
                                                type="text"
                                                value={stajData.lastName}
                                                onChange={(e) =>
                                                    setStajData({
                                                        ...stajData,
                                                        lastName:
                                                            e.target.value.toUpperCase(),
                                                    })
                                                }
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-slate-500">
                                                Eğitim Yılı
                                            </label>
                                            <select
                                                value={stajData.academicYear}
                                                onChange={(e) =>
                                                    setStajData({
                                                        ...stajData,
                                                        academicYear:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                                            >
                                                <option value="2025/2026">
                                                    2025/2026
                                                </option>
                                                <option value="2026/2027">
                                                    2026/2027
                                                </option>
                                                <option value="2027/2028">
                                                    2027/2028
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-slate-500">
                                                Staj Dersi
                                            </label>
                                            <select
                                                value={stajData.courseCode}
                                                onChange={(e) =>
                                                    setStajData({
                                                        ...stajData,
                                                        courseCode:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                                            >
                                                <option value="CENG 200">
                                                    CENG 200
                                                </option>
                                                <option value="CENG 300">
                                                    CENG 300
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-slate-500">
                                                Firma Adı
                                            </label>
                                            <input
                                                type="text"
                                                value={stajData.company}
                                                onChange={(e) =>
                                                    setStajData({
                                                        ...stajData,
                                                        company: e.target.value,
                                                    })
                                                }
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                className="bg-emerald-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                                            >
                                                {t.mgmt.saveBtn}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsEditingStaj(false)
                                                }
                                                className="bg-slate-100 text-slate-600 px-3 py-2 rounded-lg font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                                            >
                                                {t.mgmt.cancelBtn}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="grid grid-cols-2 gap-y-3 text-xs font-medium text-slate-600">
                                        <p>
                                            <strong className="text-slate-900">
                                                Öğrenci:
                                            </strong>{" "}
                                            {stajData.firstName}{" "}
                                            {stajData.lastName}
                                        </p>
                                        <p>
                                            <strong className="text-slate-900">
                                                T.C. No:
                                            </strong>{" "}
                                            {stajData.tcNo}
                                        </p>
                                        <p>
                                            <strong className="text-slate-900">
                                                Dönem / Ders:
                                            </strong>{" "}
                                            {stajData.academicYear} •{" "}
                                            {stajData.courseCode}
                                        </p>
                                        <p>
                                            <strong className="text-slate-900">
                                                Staj Türü:
                                            </strong>{" "}
                                            {stajData.type}
                                        </p>
                                        <p className="col-span-2">
                                            <strong className="text-slate-900">
                                                Kurum / Firma:
                                            </strong>{" "}
                                            <span className="uppercase font-semibold text-slate-800">
                                                {stajData.company}
                                            </span>
                                        </p>
                                        <p className="col-span-2">
                                            <strong className="text-slate-900">
                                                Tarih Aralığı:
                                            </strong>{" "}
                                            {stajData.startDate
                                                ? stajData.startDate
                                                      .split("-")
                                                      .reverse()
                                                      .join(".")
                                                : ""}{" "}
                                            /{" "}
                                            {stajData.endDate
                                                ? stajData.endDate
                                                      .split("-")
                                                      .reverse()
                                                      .join(".")
                                                : ""}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* KART 2: AMİR BİLGİLERİ */}
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                                        {t.mgmt.secAmir}
                                    </h3>
                                    {!isEditingSupervisor && (
                                        <button
                                            onClick={() =>
                                                setIsEditingSupervisor(true)
                                            }
                                            className="text-xs text-[#2f4973] font-bold hover:underline cursor-pointer"
                                        >
                                            {t.mgmt.editBtn}
                                        </button>
                                    )}
                                </div>

                                {isEditingSupervisor ? (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            setIsEditingSupervisor(false);
                                        }}
                                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700"
                                    >
                                        <div>
                                            <label className="block mb-1 text-slate-500">
                                                {t.step3.fields[0]}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={supervisor.firstName}
                                                onChange={(e) =>
                                                    setSupervisor({
                                                        ...supervisor,
                                                        firstName:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-slate-500">
                                                {t.step3.fields[1]}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={supervisor.lastName}
                                                onChange={(e) =>
                                                    setSupervisor({
                                                        ...supervisor,
                                                        lastName:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-slate-600">
                                                {t.step3.fields[2]}
                                            </label>
                                            <input
                                                type="tel"
                                                maxLength="11"
                                                pattern="0[0-9]{10}"
                                                required
                                                value={supervisor.phone}
                                                onChange={(e) =>
                                                    setSupervisor({
                                                        ...supervisor,
                                                        phone: e.target.value.replace(
                                                            /[^0-9]/g,
                                                            "",
                                                        ),
                                                    })
                                                }
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-slate-500">
                                                {t.step3.fields[3]}
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={supervisor.email}
                                                onChange={(e) =>
                                                    setSupervisor({
                                                        ...supervisor,
                                                        email: e.target.value,
                                                    })
                                                }
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                className="bg-emerald-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                                            >
                                                {t.mgmt.saveBtn}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsEditingSupervisor(
                                                        false,
                                                    )
                                                }
                                                className="bg-slate-100 text-slate-600 px-3 py-2 rounded-lg font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                                            >
                                                {t.mgmt.cancelBtn}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-slate-600">
                                        <p>
                                            <strong className="text-slate-900">
                                                {t.step3.fields[0]} /{" "}
                                                {t.step3.fields[1]}:
                                            </strong>{" "}
                                            {supervisor.firstName}{" "}
                                            {supervisor.lastName}
                                        </p>
                                        <p>
                                            <strong className="text-slate-900">
                                                {t.step3.fields[2]}:
                                            </strong>{" "}
                                            <span className="font-mono text-slate-800">
                                                {supervisor.phone ||
                                                    "•••••••••••"}
                                            </span>
                                        </p>
                                        <p className="sm:col-span-2">
                                            <strong className="text-slate-900">
                                                {t.step3.fields[3]}:
                                            </strong>{" "}
                                            <span className="font-mono text-slate-800">
                                                {supervisor.email ||
                                                    "••••@••••.•••"}
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sağ Tek Kolon: Dokümanlar ve Katkı Durumu */}
                        <div className="space-y-6">
                            {/* KART 3: EVRAK HAVUZU */}
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
                                    {t.mgmt.secEvrak}
                                </h3>
                                <p className="text-[11px] text-slate-500 leading-normal">
                                    {t.mgmt.evrakDesc}
                                </p>

                                <button
                                    onClick={() => {
                                        setIsFinalized(false);
                                        setCurrentStep(2);
                                    }}
                                    className="w-full text-left p-3 border border-dashed border-[#2f4973]/40 hover:border-[#2f4973] rounded-xl text-xs font-bold text-[#2f4973] bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer"
                                >
                                    {t.mgmt.evrakLink}
                                </button>
                            </div>

                            {/* KART 4: YASAL BEYAN DURUMU */}
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-3">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
                                    {t.steps[3]}
                                </h3>
                                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                                    {t.mgmt.fundStatus}
                                </span>

                                <label className="flex items-start gap-2.5 bg-slate-50 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/60 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={unemploymentFund}
                                        onChange={(e) =>
                                            setUnemploymentFund(
                                                e.target.checked,
                                            )
                                        }
                                        className="mt-0.5 text-[#2f4973] border-slate-300 rounded focus:ring-[#2f4973]"
                                    />
                                    <span className="text-[11px] font-bold text-slate-700 leading-normal">
                                        {unemploymentFund
                                            ? t.mgmt.fundTrue
                                            : t.mgmt.fundFalse}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </main>
            ) : (
                // GÖRÜNÜM B: AKTİF BAŞVURU ADIMLARI (WIZARD)
                <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 space-y-6">
                    {/* Adımölçer Butonları */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                        {t.steps.map((stepText, idx) => {
                            const stepNum = idx + 1;
                            const isCurrent = currentStep === stepNum;
                            const isUnlocked = stepNum <= maxUnlockedStep;
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    disabled={!isUnlocked}
                                    onClick={() => handleStepNav(stepNum)}
                                    className={`py-3 px-3 text-left text-xs font-bold rounded-xl border transition-all truncate
                                    ${isCurrent ? "bg-[#2f4973] text-white border-[#2f4973] shadow-md" : ""}
                                    ${!isCurrent && isUnlocked ? "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 cursor-pointer" : ""}
                                    ${!isUnlocked ? "bg-zinc-50 text-zinc-400 border-zinc-200 opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {stepText}
                                </button>
                            );
                        })}
                    </div>

                    {/* Dinamik Form Kutusu */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 md:p-8">
                        {/* ADIM 1: VERİ GİRİŞİ */}
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
                                    {t.step1.title}
                                </h3>
                                <form
                                    onSubmit={nextFromStep1}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-700"
                                >
                                    <div>
                                        <label className="block mb-1 text-slate-600">
                                            Öğrenci Adı
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={stajData.firstName}
                                            onChange={(e) =>
                                                setStajData({
                                                    ...stajData,
                                                    firstName:
                                                        e.target.value.toUpperCase(),
                                                })
                                            }
                                            placeholder="Örn: AHMET"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#2f4973] focus:bg-white transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-slate-600">
                                            Öğrenci Soyadı
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={stajData.lastName}
                                            onChange={(e) =>
                                                setStajData({
                                                    ...stajData,
                                                    lastName:
                                                        e.target.value.toUpperCase(),
                                                })
                                            }
                                            placeholder="Örn: YILMAZ"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#2f4973] focus:bg-white transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-slate-600">
                                            Eğitim-Öğretim Yılı
                                        </label>
                                        <select
                                            value={stajData.academicYear}
                                            onChange={(e) =>
                                                setStajData({
                                                    ...stajData,
                                                    academicYear:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#2f4973] cursor-pointer"
                                        >
                                            <option value="2025/2026">
                                                2025/2026
                                            </option>
                                            <option value="2026/2027">
                                                2026/2027
                                            </option>
                                            <option value="2027/2028">
                                                2027/2028
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-slate-600">
                                            Staj Dersi
                                        </label>
                                        <select
                                            value={stajData.courseCode}
                                            onChange={(e) =>
                                                setStajData({
                                                    ...stajData,
                                                    courseCode: e.target.value,
                                                })
                                            }
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#2f4973] cursor-pointer"
                                        >
                                            <option value="CENG 200">
                                                CENG 200 - Summer Training I
                                            </option>
                                            <option value="CENG 300">
                                                CENG 300 - Summer Training II
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-slate-600">
                                            T.C. Kimlik Numarası
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            maxLength="11"
                                            value={stajData.tcNo}
                                            onChange={(e) =>
                                                setStajData({
                                                    ...stajData,
                                                    tcNo: e.target.value.replace(
                                                        /[^0-9]/g,
                                                        "",
                                                    ),
                                                })
                                            }
                                            placeholder="XXXXXXXXXXX"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono focus:outline-none focus:border-[#2f4973]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-slate-600">
                                            Cep Telefonu No
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            maxLength="11"
                                            value={stajData.phone}
                                            onChange={(e) =>
                                                setStajData({
                                                    ...stajData,
                                                    phone: e.target.value.replace(
                                                        /[^0-9]/g,
                                                        "",
                                                    ),
                                                })
                                            }
                                            placeholder="05XXXXXXXXX"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono focus:outline-none focus:border-[#2f4973]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-slate-600">
                                            Staj Durumu (Türü)
                                        </label>
                                        <select
                                            value={stajData.type}
                                            onChange={(e) =>
                                                setStajData({
                                                    ...stajData,
                                                    type: e.target.value,
                                                })
                                            }
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#2f4973] cursor-pointer"
                                        >
                                            <option value="Zorunlu">
                                                {lang === "tr"
                                                    ? "Zorunlu"
                                                    : "Compulsory"}
                                            </option>
                                            <option value="Gönüllü">
                                                {lang === "tr"
                                                    ? "Gönüllü"
                                                    : "Voluntary"}
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-slate-600">
                                            Firma / Kurum Adı
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={stajData.company}
                                            onChange={(e) =>
                                                setStajData({
                                                    ...stajData,
                                                    company: e.target.value,
                                                })
                                            }
                                            placeholder="Örn: X Bilişim A.Ş."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block mb-1 text-slate-600">
                                                Staj Başlangıç
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={stajData.startDate}
                                                onChange={(e) =>
                                                    setStajData({
                                                        ...stajData,
                                                        startDate:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-slate-600">
                                                Staj Bitiş
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={stajData.endDate}
                                                onChange={(e) =>
                                                    setStajData({
                                                        ...stajData,
                                                        endDate: e.target.value,
                                                    })
                                                }
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 font-mono"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 pt-4">
                                        <button
                                            type="submit"
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl shadow-md cursor-pointer w-full uppercase tracking-wider text-xs transition-colors"
                                        >
                                            {t.step1.btn}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* ADIM 2: SİGORTA FORMU ÖNİZLEME */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-2">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                                            {t.step2.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {t.step2.desc}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMaxUnlockedStep(3);
                                            setCurrentStep(3);
                                        }}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-md whitespace-nowrap transition-colors"
                                    >
                                        {t.step2.nextBtn}
                                    </button>
                                </div>

                                <div className="border border-slate-400 bg-white p-6 md:p-8 max-w-2xl mx-auto shadow-xs text-slate-900 text-xs font-serif leading-relaxed">
                                    <h4 className="text-center font-black text-sm border-b-2 border-slate-900 pb-2 mb-4 uppercase tracking-wide">
                                        ÇANKAYA ÜNİVERSİTESİ ZORUNLU STAJYER
                                        ÖĞRENCİ SİGORTA GİRİŞ FORMU
                                    </h4>
                                    <table className="w-full border-collapse mb-6 text-[11px] font-sans">
                                        <tbody>
                                            <tr className="border-b border-slate-200">
                                                <td className="py-2 font-bold w-1/2">
                                                    Eğitim-Öğretim Yılı
                                                </td>
                                                <td className="py-2">
                                                    : {stajData.academicYear}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-200">
                                                <td className="py-2 font-bold">
                                                    Staj Ders Kodu
                                                </td>
                                                <td className="py-2">
                                                    : {stajData.courseCode}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-200">
                                                <td className="py-2 font-bold">
                                                    Öğrenci Okul Numarası
                                                </td>
                                                <td className="py-2">
                                                    : {studentNo}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-200">
                                                <td className="py-2 font-bold">
                                                    Öğrenci TC Kimlik No
                                                </td>
                                                <td className="py-2">
                                                    :{" "}
                                                    {stajData.tcNo ||
                                                        "XXXXXXXXXXX"}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-200">
                                                <td className="py-2 font-bold">
                                                    Öğrenci Adı Soyadı
                                                </td>
                                                <td className="py-2">
                                                    :{" "}
                                                    {stajData.firstName ||
                                                        "•••••"}{" "}
                                                    {stajData.lastName ||
                                                        "•••••"}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-200">
                                                <td className="py-2 font-bold">
                                                    Öğrenci Cep Telefonu
                                                </td>
                                                <td className="py-2">
                                                    :{" "}
                                                    {stajData.phone ||
                                                        "05XXXXXXXXX"}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-200">
                                                <td className="py-2 font-bold">
                                                    Fakülte / Bölüm
                                                </td>
                                                <td className="py-2">
                                                    : {stajData.faculty} /{" "}
                                                    {stajData.department}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-200">
                                                <td className="py-2 font-bold">
                                                    Staj Başlama / Bitiş Tarihi
                                                </td>
                                                <td className="py-2">
                                                    :{" "}
                                                    {stajData.startDate
                                                        ? stajData.startDate
                                                              .split("-")
                                                              .reverse()
                                                              .join(".")
                                                        : "••.••.••••"}{" "}
                                                    /{" "}
                                                    {stajData.endDate
                                                        ? stajData.endDate
                                                              .split("-")
                                                              .reverse()
                                                              .join(".")
                                                        : "••.••.••••"}
                                                </td>
                                            </tr>
                                            <tr className="border-b-2 border-slate-900">
                                                <td className="py-2 font-bold">
                                                    Staj Yeri Adı
                                                </td>
                                                <td className="py-2 uppercase">
                                                    :{" "}
                                                    {stajData.company ||
                                                        "••••••••••••"}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <p className="text-[10px] text-justify font-sans italic text-slate-700 leading-normal mb-8">
                                        Yukarıda belirttiğim Staj Başlama ve
                                        Bitiş Tarihleri arasında zorunlu staj
                                        programım kapsamında stajyer olarak
                                        görev yapacağım. Sosyal Güvenlik
                                        Kurumu'na Stajyer olarak İşe Giriş
                                        Bildirimimin yapılmasını, durumumda
                                        meydana gelebilecek değişiklikleri staj
                                        başlangıç tarihimden yedi gün öncesine
                                        kadar Kayıtlı Olduğum Bölüme bildirmeyi
                                        taahhüt ederim.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 text-center text-[10px] font-sans">
                                        <div>
                                            <p className="font-bold text-slate-950">
                                                Öğrenci İmza
                                            </p>
                                            <p className="mt-6 border-b border-slate-300 mx-8"></p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-950">
                                                Bölüm Staj Onay
                                            </p>
                                            <p className="mt-6 border-b border-slate-300 mx-8"></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center pt-2">
                                    <button
                                        type="button"
                                        onClick={() => window.print()}
                                        className="bg-[#2f4973] hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase cursor-pointer shadow-md transition-colors"
                                    >
                                        {t.step2.printBtn}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ADIM 3: AMİR BİLGİLERİ */}
                        {currentStep === 3 && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
                                    {t.step3.title}
                                </h3>
                                <form
                                    onSubmit={nextFromStep3}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-700"
                                >
                                    <div>
                                        <label className="block mb-1 text-slate-600">
                                            {t.step3.fields[0]}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={supervisor.firstName}
                                            onChange={(e) =>
                                                setSupervisor({
                                                    ...supervisor,
                                                    firstName: e.target.value,
                                                })
                                            }
                                            placeholder="Örn: Mehmet"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#2f4973]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-slate-600">
                                            {t.step3.fields[1]}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={supervisor.lastName}
                                            onChange={(e) =>
                                                setSupervisor({
                                                    ...supervisor,
                                                    lastName: e.target.value,
                                                })
                                            }
                                            placeholder="Örn: Şahin"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#2f4973]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-slate-600">
                                            {t.step3.fields[2]}
                                        </label>
                                        <input
                                            type="tel"
                                            maxLength="11"
                                            pattern="0[0-9]{10}"
                                            required
                                            placeholder="05XXXXXXXXX"
                                            title="Lütfen telefon numarasını başında 0 olacak şekilde 11 hane og bitişik yazınız."
                                            value={supervisor.phone}
                                            onChange={(e) =>
                                                setSupervisor({
                                                    ...supervisor,
                                                    phone: e.target.value.replace(
                                                        /[^0-9]/g,
                                                        "",
                                                    ),
                                                })
                                            }
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono focus:outline-none focus:border-[#2f4973]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-slate-600">
                                            {t.step3.fields[3]}
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={supervisor.email}
                                            onChange={(e) =>
                                                setSupervisor({
                                                    ...supervisor,
                                                    email: e.target.value,
                                                })
                                            }
                                            placeholder="kurumsal@firma.com"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono focus:outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2 pt-4">
                                        <button
                                            type="submit"
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl shadow-md cursor-pointer w-full uppercase tracking-wider text-xs transition-colors"
                                        >
                                            {t.step3.btn}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* ADIM 4: DEVLET KATKISI VE ONAY */}
                        {currentStep === 4 && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
                                    {t.step4.title}
                                </h3>
                                <form
                                    onSubmit={handleFinalSubmit}
                                    className="space-y-5 text-xs font-semibold text-slate-700"
                                >
                                    <label className="flex items-start gap-3 bg-slate-50 p-5 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100/70 transition-colors shadow-xs">
                                        <input
                                            type="checkbox"
                                            checked={unemploymentFund}
                                            onChange={(e) =>
                                                setUnemploymentFund(
                                                    e.target.checked,
                                                )
                                            }
                                            className="mt-0.5 w-4 h-4 text-[#2f4973] border-slate-300 rounded focus:ring-[#2f4973]"
                                        />
                                        <span className="text-slate-700 font-medium leading-normal text-sm">
                                            {t.step4.checkLabel}
                                        </span>
                                    </label>
                                    <button
                                        type="submit"
                                        className="bg-[#2f4973] hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-xl cursor-pointer shadow-md uppercase tracking-wider text-xs w-full md:w-auto transition-colors"
                                    >
                                        {t.step4.finishBtn}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </main>
            )}
        </div>
    );
}
