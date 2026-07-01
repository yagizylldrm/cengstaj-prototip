#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0;0m'

Goster_Baslik() {
    echo -e "${BLUE}==================================================${NC}"
    echo -e "${BLUE}         STAJ BILGI SISTEMI YONETIM BETIGI        ${NC}"
    echo -e "${BLUE}==================================================${NC}"
}

Paket_Yukle() {
    echo -e "\n${CYAN}[1/3] Docker veritabanı konteynerleri baslatiliyor...${NC}"
    if [ -f "docker-compose.yml" ]; then
        docker compose up -d
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}[BASARILI] Veritabanı konteyneri ayağa kalktı.${NC}"
            echo -e "${YELLOW}[INFO] pgAdmin 4 arayüzüne http://localhost:8080 adresinden erişebilirsiniz.${NC}"
            echo -e "${YELLOW}[INFO] PostgreSQL veritabanı 5432 portunda çalışmaktadır.${NC}"
        else
            echo -e "${YELLOW}[UYARI] Docker baslatilamadi. Docker Daemon calisiyor mu kontrol edin.${NC}"
        fi
    else
        echo -e "${RED}[HATA] docker-compose.yml bulunamadi!${NC}"
    fi

    echo -e "\n${CYAN}[2/3] .NET Backend bağımlılıkları yükleniyor (dotnet restore)...${NC}"
    if [ -d "CengStaj.Backend" ]; then
        dotnet restore CengStaj.Backend/
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}[BASARILI] .NET bağımlılıkları restore edildi.${NC}"
        else
            echo -e "${RED}[HATA] .NET bağımlılıkları yuklenirken hata olustu.${NC}"
        fi
    else
        echo -e "${RED}[HATA] CengStaj.Backend dizini bulunamadi!${NC}"
    fi

    echo -e "\n${CYAN}[3/3] React Frontend bağımlılıkları yükleniyor (npm install)...${NC}"
    if [ -d "CengStaj.Frontend" ]; then
        (cd CengStaj.Frontend && npm install)
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}[BASARILI] Frontend bağımlılıkları yüklendi.${NC}"
        else
            echo -e "${RED}[HATA] Frontend bağımlılıkları yuklenirken hata olustu.${NC}"
        fi
    else
        echo -e "${RED}[HATA] CengStaj.Frontend dizini bulunamadi!${NC}"
    fi
}

Projeyi_Baslat() {
    echo -e "\n${CYAN}[BILGI] Veritabanı kontrol ediliyor...${NC}"
    if [ -f "docker-compose.yml" ]; then
        docker compose up -d
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}[BASARILI] Veritabanı çalışıyor.${NC}"
            echo -e "${YELLOW}[INFO] pgAdmin 4 arayüzü: http://localhost:8080${NC}"
        fi
    fi

    echo -e "\n${CYAN}[BILGI] Tüm servisler (Backend & Frontend) başlatılıyor...${NC}"

    if [ -d "CengStaj.Backend" ]; then
        echo -e "${BLUE}[API] .NET Web API arka planda başlatılıyor...${NC}"
        dotnet run --project CengStaj.Backend/ > backend.log 2>&1 &
        BACKEND_PID=$!
        echo -e "${GREEN}[API] API başlatıldı (PID: $BACKEND_PID). Loglar 'backend.log' dosyasına yazılıyor.${NC}"
        echo -e "${YELLOW}[API] API Scalar arayüzü: http://localhost:5202/scalar/v1${NC}"
    else
        echo -e "${RED}[HATA] CengStaj.Backend dizini bulunamadi!${NC}"
        exit 1
    fi

    if [ -d "CengStaj.Frontend" ]; then
        echo -e "${BLUE}[FRONTEND] React Vite gelistirme sunucusu baslatiliyor...${NC}"
        
        # Ctrl+C veya çıkış sinyallerinde arka plandaki .NET sürecini öldür
        trap 'echo -e "\n${YELLOW}[INFO] Servisler kapatılıyor...${NC}"; kill $BACKEND_PID; exit' INT TERM
        
        (cd CengStaj.Frontend && npm run dev)
    else
        echo -e "${RED}[HATA] CengStaj.Frontend dizini bulunamadi!${NC}"
        kill $BACKEND_PID
        exit 1
    fi
}

Gelis_Sunucu_Baslat() {
    echo -e "\n${CYAN}[BILGI] Sadece Vite gelistirme sunucusu baslatiliyor...${NC}"
    if [ -d "CengStaj.Frontend/node_modules" ]; then
        (cd CengStaj.Frontend && npm run dev)
    else
        echo -e "${YELLOW}[UYARI] node_modules klasoru bulunamadi. Paketler otomatik yukleniyor...${NC}"
        Paket_Yukle
        (cd CengStaj.Frontend && npm run dev)
    fi
}

Projeyi_Derle() {
    echo -e "\n${CYAN}[BILGI] Proje üretim (production) ortami icin derleniyor...${NC}"
    if [ -d "CengStaj.Frontend/node_modules" ]; then
        (cd CengStaj.Frontend && npm run build)
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}[BASARILI] Derleme islemi tamamlandi. Çikti 'CengStaj.Frontend/dist/' klasorune kaydedildi.${NC}"
        else
            echo -e "${RED}[HATA] Derleme sirasinda bir hata meydana geldi.${NC}"
        fi
    else
        echo -e "${RED}[HATA] Proje henuz yuklenmemis. Once paketleri yukleyin.${NC}"
    fi
}

Derleme_Onizleme() {
    echo -e "\n${CYAN}[BILGI] Üretim derlemesi yerelde onizleniyor...${NC}"
    if [ -d "CengStaj.Frontend/dist" ]; then
        (cd CengStaj.Frontend && npm run preview)
    else
        echo -e "${YELLOW}[UYARI] 'CengStaj.Frontend/dist' klasoru bulunamadi. Önce proje derleniyor...${NC}"
        Projeyi_Derle
        (cd CengStaj.Frontend && npm run preview)
    fi
}

Sistemi_Temizle() {
    echo -e "\n${YELLOW}[UYARI] Onbellekler ve derleme klasorleri temizleniyor...${NC}"
    
    if [ -d "CengStaj.Frontend/dist" ]; then
        rm -rf CengStaj.Frontend/dist
        echo -e "${GREEN}[TEMIZLIK] 'dist/' klasoru silindi.${NC}"
    fi
    
    if [ -d "CengStaj.Frontend/node_modules" ]; then
        rm -rf CengStaj.Frontend/node_modules
        echo -e "${GREEN}[TEMIZLIK] 'node_modules/' klasoru silindi.${NC}"
    fi

    if [ -f "CengStaj.Frontend/package-lock.json" ]; then
        rm CengStaj.Frontend/package-lock.json
        echo -e "${GREEN}[TEMIZLIK] 'package-lock.json' dosyasi silindi.${NC}"
    fi

    if [ -f "backend.log" ]; then
        rm backend.log
        echo -e "${GREEN}[TEMIZLIK] 'backend.log' dosyasi silindi.${NC}"
    fi

    echo -e "\n${CYAN}[TEMIZLIK] Docker veritabanı konteynerleri durduruluyor...${NC}"
    docker compose down
    echo -e "${GREEN}[TEMIZLIK] Docker konteynerleri durduruldu.${NC}"
    
    echo -e "${GREEN}[BASARILI] Temizlik islemi tamamlandi.${NC}"
}

Yeniden_Kur() {
    echo -e "\n${CYAN}[BILGI] Temiz kurulum baslatiliyor...${NC}"
    Sistemi_Temizle
    Paket_Yukle
}

Goster_Menu() {
    clear
    Goster_Baslik
    echo -e "1) Proje Bagimliliklarini Yukle (Docker, .NET Restore & npm install)"
    echo -e "2) Tüm Sistemi Baslat (Docker, Backend API & Frontend dev)"
    echo -e "3) Sadece Frontend Gelistirme Sunucusunu Baslat (npm run dev)"
    echo -e "4) Projeyi Uretim Icin Derle (npm run build)"
    echo -e "5) Derlenmis Projeyi Önizle (npm run preview)"
    echo -e "6) Proje Onbellek ve Bagimliliklarini Temizle (Clean)"
    echo -e "7) Reset (Her Seyi Temizle ve Yeniden Yukle)"
    echo -e "8) Çikis"
    echo -e "${BLUE}--------------------------------------------------${NC}"
    echo -n "Lutfen yapmak istediginiz islemi secin [1-8]: "
}

if [ $# -gt 0 ]; then
    case "$1" in
        install) Paket_Yukle ;;
        start) Projeyi_Baslat ;;
        dev) Gelis_Sunucu_Baslat ;;
        build) Projeyi_Derle ;;
        preview) Derleme_Onizleme ;;
        clean) Sistemi_Temizle ;;
        reset) Yeniden_Kur ;;
        *) echo -e "${RED}Gecersiz parametre! Kullanilabilir komutlar: install, start, dev, build, preview, clean, reset${NC}" ;;
    esac
else
    while true; do
        Goster_Menu
        read secim
        case "$secim" in
            1) Paket_Yukle; echo -n "Devam etmek icin Enter'a basin..."; read ;;
            2) Projeyi_Baslat; break ;;
            3) Gelis_Sunucu_Baslat; break ;;
            4) Projeyi_Derle; echo -n "Devam etmek icin Enter'a basin..."; read ;;
            5) Derleme_Onizleme; break ;;
            6) Sistemi_Temizle; echo -n "Devam etmek icin Enter'a basin..."; read ;;
            7) Yeniden_Kur; echo -n "Devam etmek icin Enter'a basin..."; read ;;
            8) echo -e "\n${GREEN}Iyi calismalar!${NC}"; exit 0 ;;
            *) echo -e "\n${RED}[HATA] Gecersiz secim! Lutfen 1 ile 8 arasinda bir rakam girin.${NC}"; sleep 2 ;;
        esac
    done
fi
