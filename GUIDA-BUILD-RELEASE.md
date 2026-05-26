# Guida rapida: installazione, build e release Windows

Questa guida serve per:
- installare il progetto da zero
- compilare la web app
- creare l eseguibile/cartella Windows da condividere

## 1) Prerequisiti

- Windows 10/11
- Node.js consigliato: 22.22.2 o superiore (meglio ultima LTS)
- npm incluso con Node.js

Controlla versioni:

```powershell
node -v
npm -v
```

Se `npm` non viene riconosciuto in PowerShell, usa `npm.cmd` al posto di `npm` nei comandi.

## 2) Apri il progetto

Apri PowerShell nella cartella del progetto:

```powershell
cd C:\Users\giaco\Documents\GitHub\dnd-program
```

## 3) Installa dipendenze

```powershell
npm install
```

## 4) Avvio in sviluppo (opzionale)

Per provare velocemente l app durante sviluppo:

```powershell
npm run dev
```

## 5) Build web produzione

```powershell
npm run build
```

Output in:
- `dist\`

## 6) Crea release desktop Windows (Electron)

```powershell
npm run electron:build
```

Output in:
- `release\D&D Combat Tracker-win32-x64\`

Dentro questa cartella trovi il file eseguibile dell app.

## 7) Come condividere con un amico

Metodo semplice:
- comprimi tutta la cartella `release\D&D Combat Tracker-win32-x64\` in `.zip`
- invia lo zip
- il tuo amico estrae e avvia il file `.exe`

Nota:
- non serve installare Node.js sul PC del tuo amico per eseguire l app pacchettizzata

## 8) Build pulita (se serve)

Se vuoi rigenerare da zero:

```powershell
Remove-Item -Recurse -Force dist, release -ErrorAction SilentlyContinue
npm install
npm run build
npm run electron:build
```

## 9) Problemi comuni

### Warning EBADENGINE
Se vedi warning tipo `EBADENGINE` su alcune dipendenze, aggiorna Node.js a una versione piu recente (consigliato >= 22.22.2).

### Vulnerabilita npm audit
Nel progetto possono comparire vulnerabilita su dipendenze di sviluppo (es. Electron/Vite). Non blocca la build, ma prima di distribuire pubblicamente conviene pianificare upgrade major con test.

### `npm` non riconosciuto
Usa:

```powershell
npm.cmd install
npm.cmd run build
npm.cmd run electron:build
```

---

## Comandi minimi da ricordare

```powershell
npm install
npm run build
npm run electron:build
```
