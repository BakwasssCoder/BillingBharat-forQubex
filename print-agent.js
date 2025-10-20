// Electron Print Agent for local printing
const { app, BrowserWindow, ipcMain } = require('electron');
const { createServer } = require('http');
const { parse } = require('url');
const fs = require('fs');
const path = require('path');

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load the index.html of the app
  mainWindow.loadFile('index.html');

  // Open the DevTools
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed
  mainWindow.on('closed', function () {
    // Dereference the window object
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open
  if (mainWindow === null) {
    createWindow();
  }
});

// Print server
const server = createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/print') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const { printerId, pdfData } = JSON.parse(body);
        
        // Decode base64 PDF data
        const pdfBuffer = Buffer.from(pdfData, 'base64');
        
        // Save PDF to temporary file
        const tempPath = path.join(app.getPath('temp'), `invoice-${Date.now()}.pdf`);
        fs.writeFileSync(tempPath, pdfBuffer);
        
        // Print the PDF
        const win = new BrowserWindow({ show: false });
        win.loadURL(`file://${tempPath}`);
        
        win.webContents.on('did-finish-load', () => {
          win.webContents.print({ silent: true }, (success, errorType) => {
            if (!success) {
              console.error('Print failed:', errorType);
            }
            
            // Clean up temporary file
            fs.unlinkSync(tempPath);
            win.destroy();
            
            // Send response
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              success: true, 
              message: 'Print job completed',
              jobId: `job_${Date.now()}`
            }));
          });
        });
      } catch (error) {
        console.error('Error processing print request:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to process print request' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

// Start the server on port 4321
server.listen(4321, () => {
  console.log('Print agent server running on port 4321');
});

// Handle print requests from renderer process
ipcMain.handle('print-invoice', async (event, pdfData) => {
  try {
    // Decode base64 PDF data
    const pdfBuffer = Buffer.from(pdfData, 'base64');
    
    // Save PDF to temporary file
    const tempPath = path.join(app.getPath('temp'), `invoice-${Date.now()}.pdf`);
    fs.writeFileSync(tempPath, pdfBuffer);
    
    // Print the PDF
    const win = new BrowserWindow({ show: false });
    win.loadURL(`file://${tempPath}`);
    
    return new Promise((resolve) => {
      win.webContents.on('did-finish-load', () => {
        win.webContents.print({ silent: true }, (success, errorType) => {
          if (!success) {
            console.error('Print failed:', errorType);
          }
          
          // Clean up temporary file
          fs.unlinkSync(tempPath);
          win.destroy();
          
          resolve({ success, errorType });
        });
      });
    });
  } catch (error) {
    console.error('Error printing invoice:', error);
    return { success: false, error: error.message };
  }
});