import { useState } from "react";

export default function LoginPortal({
    lang,
    setLang,
    onLoginSuccess,
    onCancel,
    logo,
}) {
    const [mode, setMode] = useState("login"); // 'login' | 'register' | 'otp'
    const [studentNo, setStudentNo] = useState("");
    const [password, setPassword] = useState("");
    const [otpInput, setOtpInput] = useState("");
    const [generatedOtp, setGeneratedOtp] = useState("");

    // --- 🔐 CANLI ŞİFRE KRİTER KONTROLLERİ ---
    const isLengthValid = password.length >= 8 && password.length <= 24;
    const isNumberValid = /[0-9]/.test(password);
    const isSymbolValid =
        /^(?=.*[^A-Za-z0-9]).*$/.test(password) || /[\W_]/.test(password);

    // --- 📧 TÜRETİLMİŞ STATE (DERIVED STATE) ---
    // Kesinlikle useEffect veya setEmail kullanılmaz, ESLint hatasını kökten çözer!
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
            critSymbol: "En az 1 sembol/özel karakter",
            forgotTitle: "🔐 Şifre Sıfırlama Talebi",
            resetTitle: "🔄 Yeni Şifre Belirleme",
            forgotSendBtn: "Doğrulama Kodu Gönder",
            resetBtn: "Şifreyi Güncelle ve Giriş Ekranına Dön",
            newPassLabel: "Yeni Şifre",
            resetSuccess:
                "Şifreniz başarıyla güncellendi! Yeni şifrenizle giriş yapabilirsiniz.",
        },
        en: {
            sysTitle: "INTERNSHIP INFORMATION SYSTEM",
            deptTitle: "Computer Engineering",
            userLabel: "Student Number",
            emailLabel: "School Email Address (Auto-Calculated)",
            passLabel: "Password",
            otpLabel: "Email Activation Code",
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
            critSymbol: "At least 1 symbol",
            forgotTitle: "🔐 Password Reset Request",
            resetTitle: "🔄 Set New Password",
            forgotSendBtn: "Send Verification Code",
            resetBtn: "Update Password & Go to Login",
            newPassLabel: "New Password",
            resetSuccess:
                "Password successfully updated! You can now log in with your new password.",
        },
    }[lang];

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        if (studentNo.trim() !== "" && password.trim() !== "") {
            onLoginSuccess(studentNo);
        } else {
            alert(t.alertErr);
        }
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        if (!/^20\d{7}$/.test(studentNo)) {
            alert(
                lang === "tr"
                    ? "Öğrenci numarası 20 ile başlamalı ve 9 haneli olmalıdır! (Örn: 20XXXXXXX)"
                    : "ID must start with 20 and be 9 digits! (e.g. 20XXXXXXX)",
            );
            return;
        }
        if (!isLengthValid || !isNumberValid || !isSymbolValid) {
            alert(
                lang === "tr"
                    ? "Lütfen tüm şifre kriterlerini sağlayın!"
                    : "Please satisfy all password criteria!",
            );
            return;
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(code);
        setMode("otp");
        alert(`${t.otpAlert} [ ${code} ]`);
    };

    const handleForgotSubmit = (e) => {
        e.preventDefault();
        if (!/^20\d{7}$/.test(studentNo)) {
            alert(
                lang === "tr"
                    ? "Lütfen geçerli bir öğrenci numarası giriniz! (Örn: 20XXXXXXX)"
                    : "Please enter a valid student number! (e.g. 20XXXXXXX)",
            );
            return;
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(code);
        setMode("forgot_otp");
        alert(`${t.otpAlert} [ ${code} ]`);
    };

    const handleOtpVerify = (e) => {
        e.preventDefault();
        if (otpInput === generatedOtp) {
            if (mode === "forgot_otp") {
                setPassword("");
                setMode("reset");
            } else {
                alert(t.otpSuccess);
                setMode("login");
            }
            setOtpInput("");
        } else {
            alert(t.otpWrong);
        }
    };

    const handleResetPasswordSubmit = (e) => {
        e.preventDefault();
        if (!isLengthValid || !isNumberValid || !isSymbolValid) {
            alert(
                lang === "tr"
                    ? "Lütfen yeni şifre için tüm kuralları sağlayın!"
                    : "Please satisfy all new password criteria!",
            );
            return;
        }
        alert(t.resetSuccess);
        setPassword("");
        setMode("login");
    };

    return (
        <div className="w-full min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative font-sans antialiased">
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
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1 font-sans">
                        {t.deptTitle}
                    </p>
                </div>

                {mode === "login" && (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                {t.userLabel}
                            </label>
                            <input
                                type="text"
                                value={studentNo}
                                onChange={(e) => setStudentNo(e.target.value)}
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
                                onChange={(e) => setPassword(e.target.value)}
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
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                {t.userLabel}
                            </label>
                            <input
                                type="text"
                                required
                                maxLength="9"
                                value={studentNo}
                                onChange={(e) => setStudentNo(e.target.value)}
                                placeholder="Örn: 20XXXXXXX"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-cu-lacivert"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
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
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                {t.passLabel}
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer mt-2"
                        >
                            {t.registerBtn}
                        </button>
                        <div className="text-center mt-4 pt-4 border-t border-slate-50 text-xs font-semibold">
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
                    <form onSubmit={handleForgotSubmit} className="space-y-4">
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
                                onChange={(e) => setStudentNo(e.target.value)}
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
                    <form onSubmit={handleOtpVerify} className="space-y-4">
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
                                        e.target.value.replace(/[^0-9]/g, ""),
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
                                onChange={(e) => setPassword(e.target.value)}
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
            </div>
            <span className="text-[10px] text-slate-400 font-mono font-medium mt-6 tracking-wide pointer-events-none">
                Çankaya University Computer Engineering Faculty Portal © 2026
            </span>
        </div>
    );
}
