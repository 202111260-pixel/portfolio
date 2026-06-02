import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.glb"], // lanyard 3D model
  server: {
    host: true, // expose on the local network so phones on the same Wi-Fi can open it
    port: 5180,
    strictPort: true,
  },
});
