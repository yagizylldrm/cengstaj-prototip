import { useState } from "react";

export default function LoginPortal({
    lang,
    setLang,
    onLoginSuccess,
    onCancel,
    logo,
}) {
    const [mode, setMode] = useState("login"); // 'login' | 'register' | 'otp' | 'forgot' | 'forgot_otp' | 'reset'
    const [studentNo, setStudentNo] = useState("");
    const [password, setPassword] = useState("");
    const [otpInput, setOtpInput] = useState("");
    const [generatedOtp, setGeneratedOtp] = useState("");

    // --- GERÇEK KAYIT FORMU İÇİN DİNAMİK STATE'LER ---
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [tcNo, setTcNo] = useState("");
    const [phone, setPhone] = useState("");

    const [loginSuccess, setLoginSuccess] = useState(false);

    // --- CANLI ŞİFRE KRİTER KONTROLLERI ---
    const isLengthValid = password.length >= 8 && password.length <= 24;
    const isNumberValid = /[0-9]/.test(password);
    const isUppercaseValid = /[A-Z]/.test(password);
    const isSymbolValid =
        /^(?=.*[^A-Za-z0-9]).*$/.test(password) || /[\W_]/.test(password);

    // --- TÜRETİLMİŞ STATE (DERIVED STATE) ---
    const email =
        studentNo.trim().startsWith("20") && studentNo.length === 9
            ? `c${studentNo.substring(2)}@student.cankaya.edu.tr`.toLowerCase()
            : "";

    const t = {
        tr: {
            sysTitle: "STAJ BİLGİ SİSTEMİ",
            deptTitle: "Bilgisayar Mühendisliği",
            userLabel: "Öğrenci Numarası",
            emailLabel: "Okul E-Posta Adresi",
            passLabel: "Şifre",
            otpLabel: "E-posta Aktivasyon Kodu",
            firstNameLabel: "Ad",
            lastNameLabel: "Soyad",
            tcLabel: "T.C. Kimlik No",
            phoneLabel: "Telefon Numarası",
            loginBtn: "Giriş Yap",
            registerBtn: "Hesap Oluştur ve Kod Gönder",
            verifyBtn: "Kodu Doğrula ve Devam Et",
            createAcc: "Kayıt Ol",
            forgotPass: "Şifremi Unuttum",
            hasAcc: "Zaten bir hesabım var? Giriş Yap",
            backBtn: "← Ana Sayfaya Dön",
            alertErr: "Lütfen gerekli tüm alanları doldurunuz!",
            otpAlert:
                "Simüle edilen 6 haneli güvenlik kodunuz okul mailinize gönderildi: ",
            otpWrong: "Girdiğiniz doğrulama kodu hatalı!",
            otpSuccess:
                "Hesabınız başarıyla onaylandı! Şimdi giriş yapabilirsiniz.",
            critLength: "8 - 24 karakter arası",
            critNumber: "En az 1 rakam/sayı",
            critUppercase: "En az 1 büyük harf",
            critSymbol: "En az 1 sembol/özel karakter",
            forgotTitle: "🔐 Şifre Sıfırlama Talebi",
            resetTitle: "🔄 Yeni Şifre Belirleme",
            forgotSendBtn: "Doğrulama Kodu Gönder",
            resetBtn: "Şifreyi Güncelle ve Giriş Ekranına Dön",
            newPassLabel: "Yeni Şifre",
            resetSuccess:
                "Şifreniz başarıyla güncellendi! Yeni şifrenizle giriş yapabilirsiniz.",
            loginSuccessMsg: "Giriş Başarılı! Yönlendiriliyorsunuz...",
        },
        en: {
            sysTitle: "INTERNSHIP INFORMATION SYSTEM",
            deptTitle: "Computer Engineering",
            userLabel: "Student Number",
            emailLabel: "School Email Address (Auto-Calculated)",
            passLabel: "Password",
            otpLabel: "Email Activation Code",
            firstNameLabel: "First Name",
            lastNameLabel: "Last Name",
            tcLabel: "T.C. ID Number",
            phoneLabel: "Phone Number",
            loginBtn: "Sign In",
            registerBtn: "Register & Send Code",
            verifyBtn: "Verify Code & Proceed",
            createAcc: "Create Account",
            forgotPass: "Forget Password",
            hasAcc: "Already have an account? Sign In",
            backBtn: "← Back to Home",
            alertErr: "Please fill in all required fields!",
            otpAlert: "Your simulated 6-digit OTP code sent to your email: ",
            otpWrong: "Invalid verification code!",
            otpSuccess: "Account successfully verified! You can now log in.",
            critLength: "8 - 24 characters",
            critNumber: "At least 1 number",
            critUppercase: "At least 1 uppercase letter",
            critSymbol: "At least 1 symbol",
            forgotTitle: "🔐 Password Reset Request",
            resetTitle: "🔄 Set New Password",
            forgotSendBtn: "Send Verification Code",
            resetBtn: "Update Password & Go to Login",
            newPassLabel: "New Password",
            resetSuccess:
                "Password successfully updated! You can now log in with your new password.",
            loginSuccessMsg: "Login Successful! Redirecting...",
        },
    }[lang];

    // --- MODERNIZE EDILMIS GIRIŞ BAĞLANTISI (RATE LIMIT KORUMALI) ---
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (studentNo.trim() === "" || password.trim() === "") {
            alert(t.alertErr);
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5202/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        studentNo: studentNo.trim(),
                        password: password.trim(),
                    }),
                },
            );

            // 💡 KONTROL: Eğer sunucu 429 döndürdüyse JSON parse etmeden direkt engelle
            if (response.status === 429) {
                alert(
                    lang === "tr"
                        ? "Çok fazla başarısız deneme yaptınız! Lütfen 1 dakika bekleyin."
                        : "Too many attempts! Please wait 1 minute.",
                );
                return;
            }

            const result = await response.json();

            if (response.ok) {
                // 🔒 GÜVENLİK FIX'I: Backend'den dönen kriptografik JWT token yerel hafızaya mühürleniyor
                localStorage.setItem("token", result.token);

                setLoginSuccess(true);
                setTimeout(() => {
                    onLoginSuccess(result.studentNo);
                }, 1500);
            } else {
                alert(result.message || "Giriş yapılamadı!");
            }
        } catch (error) {
            console.error("Giriş hatası:", error);
            alert("Sunucu bağlantı hatası!");
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (!/^20\d{7}$/.test(studentNo)) {
            alert(
                lang === "tr"
                    ? "Öğrenci numarası 20 ile başlamalı ve 9 haneli olmalıdır!"
                    : "ID must start with 20 and be 9 digits!",
            );
            return;
        }
        if (
            !isLengthValid ||
            !isNumberValid ||
            !isUppercaseValid ||
            !isSymbolValid
        ) {
            alert(
                lang === "tr"
                    ? "Lütfen tüm şifre kriterlerini sağlayın!"
                    : "Please satisfy all password criteria!",
            );
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5202/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        studentNo: studentNo.trim(),
                        password: password.trim(),
                        firstName: firstName.trim(),
                        lastName: lastName.trim(),
                        tcNo: tcNo.trim(),
                        phone: phone.trim(),
                    }),
                },
            );

            if (response.status === 429) {
                alert(
                    lang === "tr"
                        ? "Çok fazla istek! Lütfen biraz bekleyin."
                        : "Too many requests! Please wait.",
                );
                return;
            }

            const result = await response.json();

            if (response.ok) {
                const code = Math.floor(
                    100000 + Math.random() * 900000,
                ).toString();
                setGeneratedOtp(code);
                setMode("otp");
                alert(`${t.otpAlert} [ ${code} ]`);
            } else {
                alert(result.message || "Kayıt sırasında bir hata oluştu!");
            }
        } catch (error) {
            console.error("Kayıt hatası:", error);
            alert("Backend sunucusuna bağlanılamadı!");
        }
    };

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        if (!/^20\d{7}$/.test(studentNo)) {
            alert(
                lang === "tr"
                    ? "Lütfen geçerli bir öğrenci numarası giriniz!"
                    : "Please enter a valid student number!",
            );
            return;
        }
        try {
            const response = await fetch(
                "http://localhost:5202/api/auth/forgot-password",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ studentNo: studentNo.trim() }),
                },
            );

            if (response.status === 429) {
                alert(
                    lang === "tr"
                        ? "Çok fazla kod talebi! Lütfen 1 dakika bekleyin."
                        : "Too many requests! Please wait 1 minute.",
                );
                return;
            }

            const result = await response.json();

            if (response.ok) {
                setMode("forgot_otp");
                alert(
                    lang === "tr"
                        ? "Şifre sıfırlama kodu oluşturuldu! Lütfen .NET sunucu terminalindeki/konsolundaki kodu bulun."
                        : "Reset code generated! Please find the code in your .NET server console.",
                );
            } else {
                alert(result.message || "Hata oluştu.");
            }
        } catch (error) {
            console.error(error);
            alert("Sunucu bağlantı hatası!");
        }
    };

    const handleOtpVerify = async (e) => {
        e.preventDefault();

        // 💡 UX & GÜVENLİK FIX'I: Şifre sıfırlama kodunu peşinen backend'e soruyoruz
        if (mode === "forgot_otp") {
            try {
                const response = await fetch(
                    "http://localhost:5202/api/auth/verify-reset-code",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            studentNo: studentNo.trim(),
                            otpCode: otpInput.trim(),
                        }),
                    },
                );

                const result = await response.json();

                if (response.ok) {
                    // Kod doğruysa şifre sıfırlama ekranına geçiş izni ver
                    setMode("reset");
                } else {
                    // Kod yanlışsa anında burada durdur ve uyar!
                    alert(result.message || "Doğrulama kodu hatalı!");
                }
            } catch (error) {
                console.error(error);
                alert("Sunucu bağlantı hatası!");
            }
            return;
        }

        // Normal ilk kayıt aktivasyon kodu kontrolü (Eski yerel Math.random lojiği)
        if (otpInput === generatedOtp) {
            alert(t.otpSuccess);
            setMode("login");
            setOtpInput("");
        } else {
            alert(t.otpWrong);
        }
    };

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();
        if (
            !isLengthValid ||
            !isNumberValid ||
            !isUppercaseValid ||
            !isSymbolValid
        ) {
            alert(
                lang === "tr"
                    ? "Lütfen yeni şifre için tüm kuralları sağlayın!"
                    : "Please satisfy all new password criteria!",
            );
            return;
        }
        try {
            const response = await fetch(
                "http://localhost:5202/api/auth/reset-password",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        studentNo: studentNo.trim(),
                        newPassword: password.trim(),
                        otpCode: otpInput.trim(), // 💡 FIX: otpInput içindeki kod nihai kontrol için backend'e gidiyor
                    }),
                },
            );

            if (response.status === 429) {
                alert(
                    lang === "tr"
                        ? "Çok fazla deneme! Kilidinizin açılmasını bekleyin."
                        : "Too many requests! Wait for unlock.",
                );
                return;
            }

            const result = await response.json();

            if (response.ok) {
                alert(t.resetSuccess);
                setPassword("");
                setOtpInput(""); // Formu temizle
                setMode("login");
            } else {
                // 💡 Backend'den gelen "Geçersiz veya süresi dolmuş kod" hatası artık buraya düşecek!
                alert(result.message || "Şifre güncellenemedi.");
            }
        } catch (error) {
            console.error(error);
            alert("Sunucu bağlantı hatası!");
        }
    };

    return (
        <div className="w-full min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative font-sans antialiased">
            {!loginSuccess && (
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="pointer-events-auto text-xs font-semibold text-slate-500 hover:text-cu-lacivert bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                        {t.backBtn}
                    </button>
                    <div className="pointer-events-auto inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-mono shadow-xs">
                        <button
                            type="button"
                            onClick={() => setLang("tr")}
                            className={`px-3 py-1 font-bold rounded-md transition-colors cursor-pointer ${lang === "tr" ? "bg-cu-lacivert text-white" : "text-slate-600 hover:bg-slate-100"}`}
                        >
                            TR
                        </button>
                        <button
                            type="button"
                            onClick={() => setLang("en")}
                            className={`px-3 py-1 font-bold rounded-md transition-colors cursor-pointer ${lang === "en" ? "bg-cu-lacivert text-white" : "text-slate-600 hover:bg-slate-100"}`}
                        >
                            EN
                        </button>
                    </div>
                </div>
            )}

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 relative overflow-hidden mt-8">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-cu-lacivert"></div>
                <div className="flex flex-col items-center text-center border-b border-slate-100 pb-5 mb-5">
                    {logo ? (
                        <img
                            src={logo}
                            alt="Okul Logo"
                            className="w-16 h-16 object-contain mb-4 drop-shadow-xs"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-400 mb-4">
                            CENG
                        </div>
                    )}
                    <h1 className="text-lg font-bold tracking-wider text-slate-900 leading-tight">
                        {t.sysTitle}
                    </h1>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
                        {t.deptTitle}
                    </p>
                </div>

                {/* --- BAŞARILI GİRİŞ DURUMUNDA GÖSTERİLECEK MODERN PANORAMA --- */}
                {loginSuccess ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-emerald-600 rounded-full animate-spin"></div>
                        <p className="text-sm font-bold text-emerald-600 tracking-wide animate-pulse">
                            {t.loginSuccessMsg}
                        </p>
                    </div>
                ) : (
                    <>
                        {mode === "login" && (
                            <form
                                onSubmit={handleLoginSubmit}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                        {t.userLabel}
                                    </label>
                                    <input
                                        type="text"
                                        value={studentNo}
                                        onChange={(e) =>
                                            setStudentNo(e.target.value)
                                        }
                                        placeholder="20XXXXXXX"
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-cu-lacivert"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                        {t.passLabel}
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="••••••••"
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cu-lacivert"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-cu-lacivert hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer mt-2"
                                >
                                    {t.loginBtn}
                                </button>
                                <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50 text-xs font-semibold">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMode("register");
                                            setPassword("");
                                            setStudentNo("");
                                        }}
                                        className="text-sky-700 hover:text-cu-kirmizi hover:underline cursor-pointer bg-transparent border-none"
                                    >
                                        {t.createAcc}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMode("forgot");
                                            setStudentNo("");
                                        }}
                                        className="text-sky-700 hover:text-cu-kirmizi hover:underline cursor-pointer bg-transparent border-none"
                                    >
                                        {t.forgotPass}
                                    </button>
                                </div>
                            </form>
                        )}

                        {mode === "register" && (
                            <form
                                onSubmit={handleRegisterSubmit}
                                className="space-y-3"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            {t.firstNameLabel}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={firstName}
                                            onChange={(e) =>
                                                setFirstName(e.target.value)
                                            }
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-cu-lacivert"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            {t.lastNameLabel}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={lastName}
                                            onChange={(e) =>
                                                setLastName(e.target.value)
                                            }
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-cu-lacivert"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            {t.tcLabel}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            maxLength="11"
                                            value={tcNo}
                                            onChange={(e) =>
                                                setTcNo(
                                                    e.target.value.replace(
                                                        /[^0-9]/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:border-cu-lacivert"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                            {t.phoneLabel}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            maxLength="11"
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(
                                                    e.target.value.replace(
                                                        /[^0-9]/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            placeholder="05XXXXXXXXX"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:border-cu-lacivert"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                                        {t.userLabel}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        maxLength="9"
                                        value={studentNo}
                                        onChange={(e) =>
                                            setStudentNo(e.target.value)
                                        }
                                        placeholder="Örn: 20XXXXXXX"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:border-cu-lacivert"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                                        {t.emailLabel}
                                    </label>
                                    <input
                                        type="email"
                                        disabled
                                        value={email}
                                        placeholder="cXXXXXXX@student.cankaya.edu.tr"
                                        className="w-full bg-zinc-100 border border-slate-200 text-zinc-500 rounded-xl px-3 py-2 text-sm font-mono cursor-not-allowed select-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                                        {t.passLabel}
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-cu-lacivert"
                                    />
                                </div>

                                <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 border border-slate-100 text-[11px] font-semibold">
                                    <div
                                        className={`flex items-center gap-2 ${isLengthValid ? "text-emerald-600" : "text-rose-600"}`}
                                    >
                                        <span>{isLengthValid ? "✓" : "✗"}</span>{" "}
                                        <p>{t.critLength}</p>
                                    </div>
                                    <div
                                        className={`flex items-center gap-2 ${isUppercaseValid ? "text-emerald-600" : "text-rose-600"}`}
                                    >
                                        <span>
                                            {isUppercaseValid ? "✓" : "✗"}
                                        </span>{" "}
                                        <p>{t.critUppercase}</p>
                                    </div>
                                    <div
                                        className={`flex items-center gap-2 ${isNumberValid ? "text-emerald-600" : "text-rose-600"}`}
                                    >
                                        <span>{isNumberValid ? "✓" : "✗"}</span>{" "}
                                        <p>{t.critNumber}</p>
                                    </div>
                                    <div
                                        className={`flex items-center gap-2 ${isSymbolValid ? "text-emerald-600" : "text-rose-600"}`}
                                    >
                                        <span>{isSymbolValid ? "✓" : "✗"}</span>{" "}
                                        <p>{t.critSymbol}</p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer mt-1"
                                >
                                    {t.registerBtn}
                                </button>
                                <div className="text-center mt-3 pt-3 border-t border-slate-50 text-xs font-semibold">
                                    <button
                                        type="button"
                                        onClick={() => setMode("login")}
                                        className="text-sky-700 hover:text-cu-kirmizi hover:underline cursor-pointer bg-transparent border-none"
                                    >
                                        {t.hasAcc}
                                    </button>
                                </div>
                            </form>
                        )}

                        {mode === "forgot" && (
                            <form
                                onSubmit={handleForgotSubmit}
                                className="space-y-4"
                            >
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                                    {t.forgotTitle}
                                </h3>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                        {t.userLabel}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        maxLength="9"
                                        value={studentNo}
                                        onChange={(e) =>
                                            setStudentNo(e.target.value)
                                        }
                                        placeholder="Örn: 20XXXXXXX"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-cu-lacivert"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 tracking-wide mb-1.5">
                                        {t.emailLabel}
                                    </label>
                                    <input
                                        type="email"
                                        disabled
                                        value={email}
                                        placeholder="cXXXXXXX@student.cankaya.edu.tr"
                                        className="w-full bg-zinc-100 border border-slate-200 text-zinc-500 rounded-xl px-3 py-2.5 text-sm font-mono cursor-not-allowed select-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-cu-lacivert hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition-all cursor-pointer"
                                >
                                    {t.forgotSendBtn}
                                </button>
                                <div className="text-center mt-4 pt-4 border-t border-slate-50 text-xs font-semibold">
                                    <button
                                        type="button"
                                        onClick={() => setMode("login")}
                                        className="text-sky-700 hover:text-cu-kirmizi hover:underline cursor-pointer bg-transparent border-none"
                                    >
                                        {lang === "tr"
                                            ? "← Giriş Ekranına Dön"
                                            : "← Back to Login"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {(mode === "otp" || mode === "forgot_otp") && (
                            <form
                                onSubmit={handleOtpVerify}
                                className="space-y-4"
                            >
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 leading-normal font-medium">
                                    🚨{" "}
                                    {lang === "tr"
                                        ? "Güvenlik uyarısı: Tarayıcı penceresine düşen 6 haneli kodu aşağıdaki kutuya giriniz."
                                        : "Security notice: Enter the 6-digit code prompted in the alert box."}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                        {t.otpLabel}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        maxLength="6"
                                        value={otpInput}
                                        onChange={(e) =>
                                            setOtpInput(
                                                e.target.value.replace(
                                                    /[^0-9]/g,
                                                    "",
                                                ),
                                            )
                                        }
                                        placeholder="••••••"
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-center text-xl font-mono font-bold tracking-widest focus:outline-none focus:border-cu-lacivert"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-cu-lacivert hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition-all cursor-pointer"
                                >
                                    {t.verifyBtn}
                                </button>
                            </form>
                        )}

                        {mode === "reset" && (
                            <form
                                onSubmit={handleResetPasswordSubmit}
                                className="space-y-4"
                            >
                                <h3 className="text-xs font-bold text-[#2f4973] uppercase tracking-wide bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                                    {t.resetTitle}
                                </h3>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                        {t.newPassLabel}
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cu-lacivert"
                                    />
                                </div>

                                <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 border border-slate-100 text-[11px] font-semibold">
                                    <div
                                        className={`flex items-center gap-2 ${isLengthValid ? "text-emerald-600" : "text-rose-600"}`}
                                    >
                                        <span>{isLengthValid ? "✓" : "✗"}</span>{" "}
                                        <p>{t.critLength}</p>
                                    </div>
                                    <div
                                        className={`flex items-center gap-2 ${isUppercaseValid ? "text-emerald-600" : "text-rose-600"}`}
                                    >
                                        <span>
                                            {isUppercaseValid ? "✓" : "✗"}
                                        </span>{" "}
                                        <p>{t.critUppercase}</p>
                                    </div>
                                    <div
                                        className={`flex items-center gap-2 ${isNumberValid ? "text-emerald-600" : "text-rose-600"}`}
                                    >
                                        <span>{isNumberValid ? "✓" : "✗"}</span>{" "}
                                        <p>{t.critNumber}</p>
                                    </div>
                                    <div
                                        className={`flex items-center gap-2 ${isSymbolValid ? "text-emerald-600" : "text-rose-600"}`}
                                    >
                                        <span>{isSymbolValid ? "✓" : "✗"}</span>{" "}
                                        <p>{t.critSymbol}</p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition-all cursor-pointer mt-2"
                                >
                                    {t.resetBtn}
                                </button>
                            </form>
                        )}
                    </>
                )}
            </div>
            <span className="text-[10px] text-slate-400 font-mono font-medium mt-6 tracking-wide pointer-events-none">
                Çankaya University Computer Engineering Faculty Portal © 2026
            </span>
        </div>
    );
}
