#!/bin/bash

# --- RENK TANIMLAMALARI (ANSI ESCAPE CODES) ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0;0m' # Renksiz (No Color)

# --- FONKSİYONLAR ---

Goster_Baslik() {
    echo -e "${BLUE}==================================================${NC}"
    echo -e "${BLUE}         STAJ BILGI SISTEMI YONETIM BETIGI        ${NC}"
    echo -e "${BLUE}==================================================${NC}"
}

Paket_Yukle() {
    echo -e "\n${CYan}[BILGI] Proje bagimliliklari yukleniyor...${NC}"
    if [ -f "package.json" ]; then
        npm install
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}[BASARILI] Bagimliliklar basariyla yuklendi.${NC}"
        else
            echo -e "${RED}[HATA] Paket yukleme sirasinda bir sorun olustu.${NC}"
        fi
    else
        echo -e "${RED}[HATA] package.json dosyasi bulunamadi! Dogru dizinde oldugunuzdan emin olun.${NC}"
    fi
}

Gelis_Sunucu_Baslat() {
    echo -e "\n${CYAN}[BILGI] Vite gelistirme sunucusu baslatiliyor...${NC}"
    if [ -d "node_modules" ]; then
        npm run dev
    else
        echo -e "${YELLOW}[UYARI] node_modules klasoru bulunamadi. Paketler otomatik yukleniyor...${NC}"
        Paket_Yukle
        npm run dev
    fi
}

Projeyi_Derle() {
    echo -e "\n${CYAN}[BILGI] Proje üretim (production) ortami icin derleniyor...${NC}"
    if [ -d "node_modules" ]; then
        npm run build
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}[BASARILI] Derleme islemi tamamlandi. Çikti 'dist/' klasorune kaydedildi.${NC}"
        else
            echo -e "${RED}[HATA] Derleme sirasinda bir hata meydana geldi.${NC}"
        fi
    else
        echo -e "${RED}[HATA] Proje henuz yuklenmemis. Once paketleri yukleyin.${NC}"
    fi
}

Derleme_Onizleme() {
    echo -e "\n${CYAN}[BILGI] Üretim derlemesi yerelde onizleniyor...${NC}"
    if [ -d "dist" ]; then
        npm run preview
    else
        echo -e "${YELLOW}[UYARI] 'dist/' klasoru bulunamadi. Önce proje derleniyor...${NC}"
        Projeyi_Derle
        npm run preview
    fi
}

Sistemi_Temizle() {
    echo -e "\n${YELLOW}[UYARI] Onbellekler ve derleme klasorleri temizleniyor...${NC}"
    
    if [ -d "dist" ]; then
        rm -rf dist
        echo -e "${GREEN}[TEMIZLIK] 'dist/' klasoru silindi.${NC}"
    fi
    
    if [ -d "node_modules" ]; then
        rm -rf node_modules
        echo -e "${GREEN}[TEMIZLIK] 'node_modules/' klasoru silindi.${NC}"
    fi

    if [ -f "package-lock.json" ]; then
        rm package-lock.json
        echo -e "${GREEN}[TEMIZLIK] 'package-lock.json' dosyasi silindi.${NC}"
    fi
    
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
    echo -e "1) Proje Bagimliliklarini Yukle (npm install)"
    echo -e "2) Gelistirme Sunucusunu Baslat (npm run dev)"
    echo -e "3) Projeyi Uretim Icin Derle (npm run build)"
    echo -e "4) Derlenmis Projeyi Önizle (npm run preview)"
    echo -e "5) Proje Onbellek ve Bagimliliklarini Temizle (Clean)"
    echo -e "6) Reset (Her Seyi Temizle ve Yeniden Yukle)"
    echo -e "7) Çikis"
    echo -e "${BLUE}--------------------------------------------------${NC}"
    echo -n "Lutfen yapmak istediginiz islemi secin [1-7]: "
}

# --- ANA DÖNGÜ (MAIN LOOP) ---

if [ $# -gt 0 ]; then
    # Parametreli calistirma destegi (Örn: ./manage.sh dev)
    case "$1" in
        install) Paket_Yukle ;;
        dev) Gelis_Sunucu_Baslat ;;
        build) Projeyi_Derle ;;
        preview) Derleme_Onizleme ;;
        clean) Sistemi_Temizle ;;
        reset) Yeniden_Kur ;;
        *) echo -e "${RED}Gecersiz parametre! Kullanilabilir komutlar: install, dev, build, preview, clean, reset${NC}" ;;
    esac
else
    # Parametre girilmediyse interaktif menuyu ac
    while true; do
        Goster_Menu
        read secim
        case "$secim" in
            1) Paket_Yukle; echo -n "Devam etmek icin Enter'a basin..."; read ;;
            2) Gelis_Sunucu_Baslat; break ;;
            3) Projeyi_Derle; echo -n "Devam etmek icin Enter'a basin..."; read ;;
            4) Derleme_Onizleme; break ;;
            5) Sistemi_Temizle; echo -n "Devam etmek icin Enter'a basin..."; read ;;
            6) Yeniden_Kur; echo -n "Devam etmek icin Enter'a basin..."; read ;;
            7) echo -e "\n${GREEN}Iyi calismalar!${NC}"; exit 0 ;;
            *) echo -e "\n${RED}[HATA] Gecersiz secim! Lutfen 1 ile 7 arasinda bir rakam girin.${NC}"; sleep 2 ;;
        esac
    done
fi