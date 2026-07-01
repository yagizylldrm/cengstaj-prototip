import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // Hatayı düzelttiğimiz kritik satır burası!
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
});
