// Printing utilities for different methods
interface PrinterConfig {
  id: string;
  name: string;
  type: 'bluetooth' | 'usb' | 'network' | 'browser';
  mac?: string;
  port?: string;
  ipAddress?: string;
}

// Extend Navigator interface for Web Bluetooth
declare global {
  interface Navigator {
    bluetooth?: {
      requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>;
    };
  }
}

interface RequestDeviceOptions {
  filters: Array<{ services: string[] }>;
  optionalServices?: string[];
}

interface BluetoothDevice {
  gatt?: BluetoothRemoteGATTServer;
}

interface BluetoothRemoteGATTServer {
  connect(): Promise<BluetoothRemoteGATTServer>;
  getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
}

interface BluetoothRemoteGATTService {
  getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristic>;
}

interface BluetoothRemoteGATTCharacteristic {
  writeValueWithoutResponse(value: ArrayBuffer | ArrayBufferView): Promise<void>;
}

export async function printViaBrowser(pdfBlob: Blob): Promise<boolean> {
  try {
    // Create a URL for the PDF blob
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    // Open the PDF in a new window for printing
    const printWindow = window.open(pdfUrl);
    
    if (printWindow) {
      // Wait for the PDF to load before printing
      printWindow.onload = () => {
        printWindow.print();
      };
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error printing via browser:', error);
    return false;
  }
}

export async function printViaWebBluetooth(pdfBlob: Blob): Promise<boolean> {
  try {
    // Check if Web Bluetooth is supported
    if (!navigator.bluetooth) {
      throw new Error('Web Bluetooth is not supported in this browser');
    }
    
    // Request a Bluetooth device
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ['printer'] }],
      optionalServices: ['printer']
    });
    
    // Connect to the device
    const server = await device.gatt?.connect();
    
    if (!server) {
      throw new Error('Failed to connect to Bluetooth device');
    }
    
    // Get the printer service
    const service = await server.getPrimaryService('printer');
    
    // Get the characteristic for printing
    const characteristic = await service.getCharacteristic('printer-control');
    
    // Convert PDF blob to ArrayBuffer
    const arrayBuffer = await pdfBlob.arrayBuffer();
    
    // Send the PDF data to the printer
    await characteristic.writeValueWithoutResponse(new Uint8Array(arrayBuffer));
    
    return true;
  } catch (error) {
    console.error('Error printing via Web Bluetooth:', error);
    return false;
  }
}

export async function printViaLocalAgent(pdfBlob: Blob, printerConfig: PrinterConfig): Promise<boolean> {
  try {
    // Convert PDF blob to base64
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    // Send print request to local agent
    const response = await fetch('http://localhost:4321/print', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        printerId: printerConfig.id,
        pdfData: base64,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Local print agent returned an error');
    }
    
    const result = await response.json();
    console.log('Print job sent to local agent:', result);
    
    return true;
  } catch (error) {
    console.error('Error printing via local agent:', error);
    return false;
  }
}

export function getPrintMethod(printerType: string): 'browser' | 'bluetooth' | 'local' {
  switch (printerType) {
    case 'bluetooth':
      return 'bluetooth';
    case 'usb':
    case 'network':
      return 'local';
    default:
      return 'browser';
  }
}