const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');

// Load .env from project root
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const store = new Store();

const DEVIN_API_KEY = process.env.DEVIN_API_KEY || '';
const DEVIN_API_BASE = 'https://api.devin.ai/v1';

const SYSTEM_PROMPT =
  'Sos un coach de running experto en medias maratones. Tu atleta es Axel, corredor amateur de Buenos Aires, entrenando para un 21k el 19 de abril. Usá español rioplatense, respondé de forma concisa y práctica. Si pregunta sobre lesiones, sé conservador. Dá números concretos sobre pace.';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 780,
    frame: false,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ── electron-store IPC ──────────────────────────────────────────────────────

ipcMain.handle('store:get', (_event, key) => {
  return store.get(key);
});

ipcMain.handle('store:set', (_event, key, value) => {
  const ALLOWED_KEYS = ['sessions'];
  if (!ALLOWED_KEYS.includes(key)) return;
  store.set(key, value);
});

// ── Devin API IPC ───────────────────────────────────────────────────────────

ipcMain.handle('ai:chat', async (_event, messages) => {
  if (!DEVIN_API_KEY) {
    return { error: 'DEVIN_API_KEY no configurada. Agregá tu key en .env' };
  }

  try {
    // Build prompt: system context + full conversation history
    const conversationText = messages
      .map((m) => (m.role === 'user' ? `Usuario: ${m.content}` : `Coach: ${m.content}`))
      .join('\n');

    const fullPrompt = `${SYSTEM_PROMPT}\n\nHistorial de conversación:\n${conversationText}\n\nResponde como coach al último mensaje del usuario. Solo responde el texto del coach, sin prefijo.`;

    // Create a new Devin session
    const createRes = await fetch(`${DEVIN_API_BASE}/sessions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${DEVIN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: fullPrompt }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      return { error: `Error API (${createRes.status}): ${errText}` };
    }

    const session = await createRes.json();
    const sessionId = session.session_id;

    // Poll for response
    const maxAttempts = 60;
    const pollInterval = 3000;

    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((resolve) => setTimeout(resolve, pollInterval));

      const statusRes = await fetch(`${DEVIN_API_BASE}/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${DEVIN_API_KEY}` },
      });

      if (!statusRes.ok) continue;

      const statusData = await statusRes.json();

      // Check if Devin has responded
      if (statusData.structured_output) {
        return { response: statusData.structured_output };
      }

      // Check for messages from Devin (assistant messages)
      if (statusData.messages && statusData.messages.length > 0) {
        const devinMessages = statusData.messages.filter(
          (m) => m.role === 'devin' || m.role === 'assistant'
        );
        if (devinMessages.length > 0) {
          const lastMsg = devinMessages[devinMessages.length - 1];
          return { response: lastMsg.message || lastMsg.content || JSON.stringify(lastMsg) };
        }
      }

      // Check terminal statuses
      if (['finished', 'stopped', 'error', 'exit', 'suspended'].includes(statusData.status)) {
        // Try to extract any output
        if (statusData.structured_output) {
          return { response: statusData.structured_output };
        }
        if (statusData.result) {
          return { response: statusData.result };
        }
        // If Devin finished but no clear message, return a fallback
        if (statusData.status === 'error') {
          return { error: 'La sesión de Devin terminó con error.' };
        }
        break;
      }
    }

    return {
      response:
        'No pude obtener una respuesta en este momento. Intentá de nuevo en unos segundos.',
    };
  } catch (err) {
    return { error: `Error de conexión: ${err.message}` };
  }
});

// ── Window controls ─────────────────────────────────────────────────────────

ipcMain.on('window:minimize', () => mainWindow?.minimize());
ipcMain.on('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});
ipcMain.on('window:close', () => mainWindow?.close());
