@echo off
chcp 65001 > nul

if "%1"=="install" goto install_cli
if "%1"=="start" goto start_cli
if "%1"=="dev" goto dev_cli
if "%1"=="build" goto build_cli
if "%1"=="preview" goto preview_cli
if "%1"=="clean" goto clean_cli
if "%1"=="reset" goto reset_cli
if not "%1"=="" (
    echo Gecersiz parametre! Kullanilabilir komutlar: install, start, dev, build, preview, clean, reset
    exit /b
)

:menu
cls
echo ==================================================
echo          STAJ BILGI SISTEMI YONETIM BETIGI
echo ==================================================
echo 1) Proje Bagimliliklarini Yukle (Docker, .NET Restore ^& npm install)
echo 2) Tüm Sistemi Baslat (Docker, Backend API ^& Frontend dev)
echo 3) Sadece Frontend Gelistirme Sunucusunu Baslat (npm run dev)
echo 4) Projeyi Uretim Icin Derle (npm run build)
echo 5) Derlenmis Projeyi Önizle (npm run preview)
echo 6) Proje Onbellek ve Bagimliliklarini Temizle (Clean)
echo 7) Reset (Her Seyi Temizle ve Yeniden Yukle)
echo 8) Cikis
echo --------------------------------------------------
set /p secim="Lutfen yapmak istediginiz islemi secin [1-8]: "

if "%secim%"=="1" (
    call :install_logic
    pause
    goto menu
)
if "%secim%"=="2" (
    call :start_logic
    goto menu
)
if "%secim%"=="3" (
    call :dev_logic
    goto menu
)
if "%secim%"=="4" (
    call :build_logic
    pause
    goto menu
)
if "%secim%"=="5" (
    call :preview_logic
    goto menu
)
if "%secim%"=="6" (
    call :clean_logic
    pause
    goto menu
)
if "%secim%"=="7" (
    call :reset_logic
    pause
    goto menu
)
if "%secim%"=="8" goto exit_program
goto menu

:install_cli
call :install_logic
exit /b

:start_cli
call :start_logic
exit /b

:dev_cli
call :dev_logic
exit /b

:build_cli
call :build_logic
exit /b

:preview_cli
call :preview_logic
exit /b

:clean_cli
call :clean_logic
exit /b

:reset_cli
call :reset_logic
exit /b

:install_logic
echo.
echo [1/3] Docker veritabanı konteynerleri baslatiliyor...
if exist docker-compose.yml (
    docker compose up -d
    if %errorlevel% equ 0 (
        echo [BASARILI] Veritabanı konteyneri ayağa kalktı.
        echo [INFO] pgAdmin 4 arayüzüne http://localhost:8080 adresinden erişebilirsiniz.
        echo [INFO] PostgreSQL veritabanı 5432 portunda çalışmaktadır.
    ) else (
        echo [UYARI] Docker baslatilamadi. Docker Daemon calisiyor mu kontrol edin.
    )
) else (
    echo [HATA] docker-compose.yml bulunamadi!
)

echo.
echo [2/3] .NET Backend bağımlılıkları yükleniyor (dotnet restore)...
if exist CengStaj.Backend (
    dotnet restore CengStaj.Backend/
    if %errorlevel% equ 0 (
        echo [BASARILI] .NET bağımlılıkları restore edildi.
    ) else (
        echo [HATA] .NET bağımlılıkları yuklenirken hata olustu.
    )
) else (
    echo [HATA] CengStaj.Backend dizini bulunamadi!
)

echo.
echo [3/3] React Frontend bağımlılıkları yükleniyor (npm install)...
if exist CengStaj.Frontend (
    cd CengStaj.Frontend
    call npm install
    cd ..
    if %errorlevel% equ 0 (
        echo [BASARILI] Frontend bağımlılıkları yüklendi.
    ) else (
        echo [HATA] Frontend bağımlılıkları yuklenirken hata olustu.
    )
) else (
    echo [HATA] CengStaj.Frontend dizini bulunamadi!
)
goto :eof

:start_logic
echo.
echo [BILGI] Veritabanı kontrol ediliyor...
if exist docker-compose.yml (
    docker compose up -d
)

echo.
echo [BILGI] Tüm servisler (Backend ^& Frontend) başlatılıyor...
if exist CengStaj.Backend (
    echo [API] .NET Web API arka planda başlatılıyor...
    start "CENG Staj Backend API" /min dotnet run --project CengStaj.Backend/
    echo [API] API başlatıldı.
    echo [API] API Scalar arayüzü: http://localhost:5202/scalar/v1
) else (
    echo [HATA] CengStaj.Backend dizini bulunamadi!
    goto :eof
)

if exist CengStaj.Frontend (
    echo [FRONTEND] React Vite gelistirme sunucusu baslatiliyor...
    cd CengStaj.Frontend
    call npm run dev
    cd ..
) else (
    echo [HATA] CengStaj.Frontend dizini bulunamadi!
)
goto :eof

:dev_logic
echo.
echo [BILGI] Sadece Vite gelistirme sunucusu baslatiliyor...
if exist CengStaj.Frontend (
    cd CengStaj.Frontend
    if not exist node_modules (
        echo [UYARI] node_modules klasoru bulunamadi. Paketler otomatik yukleniyor...
        call npm install
    )
    call npm run dev
    cd ..
) else (
    echo [HATA] CengStaj.Frontend dizini bulunamadi!
    pause
)
goto :eof

:build_logic
echo.
echo [BILGI] Proje üretim (production) ortami icin derleniyor...
if exist CengStaj.Frontend (
    cd CengStaj.Frontend
    call npm run build
    cd ..
) else (
    echo [HATA] CengStaj.Frontend dizini bulunamadi!
)
goto :eof

:preview_logic
echo.
echo [BILGI] Üretim derlemesi yerelde onizleniyor...
if exist CengStaj.Frontend (
    cd CengStaj.Frontend
    if not exist dist (
        call npm run build
    )
    call npm run preview
    cd ..
) else (
    echo [HATA] CengStaj.Frontend dizini bulunamadi!
    pause
)
goto :eof

:clean_logic
echo.
echo [UYARI] Onbellekler ve derleme klasorleri temizleniyor...
if exist CengStaj.Frontend\dist (
    rmdir /s /q CengStaj.Frontend\dist
    echo [TEMIZLIK] 'dist/' klasoru silindi.
)
if exist CengStaj.Frontend\node_modules (
    rmdir /s /q CengStaj.Frontend\node_modules
    echo [TEMIZLIK] 'node_modules/' klasoru silindi.
)
if exist CengStaj.Frontend\package-lock.json (
    del /f /q CengStaj.Frontend\package-lock.json
    echo [TEMIZLIK] 'package-lock.json' dosyasi silindi.
)
if exist backend.log (
    del /f /q backend.log
    echo [TEMIZLIK] 'backend.log' dosyasi silindi.
)
echo.
echo [TEMIZLIK] Docker veritabanı konteynerleri durduruluyor...
docker compose down
echo [TEMIZLIK] Docker konteynerleri durduruldu.
echo [BASARILI] Temizlik islemi tamamlandi.
goto :eof

:reset_logic
echo.
echo [BILGI] Temiz kurulum baslatiliyor...
call :clean_silent
call :install_logic
goto :eof

:clean_silent
if exist CengStaj.Frontend\dist rmdir /s /q CengStaj.Frontend\dist
if exist CengStaj.Frontend\node_modules rmdir /s /q CengStaj.Frontend\node_modules
if exist CengStaj.Frontend\package-lock.json del /f /q CengStaj.Frontend\package-lock.json
if exist backend.log del /f /q backend.log
docker compose down
goto :eof

:exit_program
echo.
echo Iyi calismalar!
exit /b
