const { spawn } = require('child_process');
const path = require('path');

const rootDir = __dirname;

const extraPaths = [
  'C:\\Program Files\\LibreOffice\\program',
  'C:\\Program Files\\gs\\gs10.07.1\\bin',
  'C:\\Program Files\\Tesseract-OCR',
  'C:\\ProgramData\\chocolatey\\bin'
].join(';');

const extendedPath = `${extraPaths};${process.env.PATH || ''}`;

console.log('[Stirling-PDF] Starting backend service on port 8080 with full toolchain (LibreOffice, OCR, GS)...');

const backend = spawn('cmd.exe', ['/c', 'gradlew.bat :stirling-pdf:bootRun -PnoSpotless'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: false,
  windowsHide: true,
  env: {
    ...process.env,
    PATH: extendedPath,
    TESSDATA_PREFIX: 'C:\\Program Files\\Tesseract-OCR\\tessdata'
  }
});

backend.on('error', (err) => console.error('[Stirling-PDF Backend Error]:', err));

function shutdown() {
  console.log('[Stirling-PDF] Shutting down backend service...');
  if (backend && backend.pid) {
    try {
      spawn('taskkill', ['/pid', backend.pid.toString(), '/T', '/F']);
    } catch (e) {}
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', shutdown);
