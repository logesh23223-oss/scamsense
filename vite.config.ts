import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      {
        name: 'copy-static-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'assets');
          const distAssets = path.resolve(distDir, 'assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, { recursive: true, force: true });
          }
        },
      },
    ],
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          scamChecker: path.resolve(__dirname, 'scam-checker.html'),
          urlChecker: path.resolve(__dirname, 'url-checker.html'),
          learnScams: path.resolve(__dirname, 'learn-scams.html'),
          quiz: path.resolve(__dirname, 'quiz.html'),
          safetyTips: path.resolve(__dirname, 'safety-tips.html'),
          emergencyHelp: path.resolve(__dirname, 'emergency-help.html'),
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
