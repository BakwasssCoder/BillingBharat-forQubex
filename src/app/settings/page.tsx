"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Save, 
  Printer, 
  MessageCircle, 
  Database, 
  Key,
  Settings as SettingsIcon,
  Plus,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const [serviceFee, setServiceFee] = useState(200);
  const [specialRegions, setSpecialRegions] = useState([
    { city: "Delhi", fee: 51 },
    { city: "Mumbai", fee: 51 },
  ]);
  const [gstEnabled, setGstEnabled] = useState(false);
  const [whatsappToken, setWhatsappToken] = useState("");
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [printers, setPrinters] = useState([
    { id: 1, name: "Bluetooth Printer", type: "bluetooth", mac: "00:11:22:33:44:55" },
    { id: 2, name: "USB Printer", type: "usb", port: "COM1" },
  ]);

  const addSpecialRegion = () => {
    setSpecialRegions([...specialRegions, { city: "", fee: 51 }]);
  };

  const updateSpecialRegion = (index: number, field: string, value: string | number) => {
    const updated = [...specialRegions];
    updated[index] = { ...updated[index], [field]: value };
    setSpecialRegions(updated);
  };

  const removeSpecialRegion = (index: number) => {
    setSpecialRegions(specialRegions.filter((_, i) => i !== index));
  };

  const addPrinter = () => {
    setPrinters([...printers, { id: printers.length + 1, name: "", type: "bluetooth", mac: "" }]);
  };

  const updatePrinter = (index: number, field: string, value: string) => {
    const updated = [...printers];
    updated[index] = { ...updated[index], [field]: value };
    setPrinters(updated);
  };

  const removePrinter = (index: number) => {
    setPrinters(printers.filter((_, i) => i !== index));
  };

  const saveSettings = () => {
    // In a real app, this would save to a database or API
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Configure your billing system preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Service Fee Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <SettingsIcon className="mr-2 h-5 w-5" />
                  Service Fee Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="default-fee">Default Service Fee (₹)</Label>
                    <Input
                      id="default-fee"
                      type="number"
                      value={serviceFee}
                      onChange={(e) => setServiceFee(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Special Region Pricing</h3>
                    <Button onClick={addSpecialRegion} size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Region
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {specialRegions.map((region, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <Label>City</Label>
                          <Input
                            value={region.city}
                            onChange={(e) => updateSpecialRegion(index, "city", e.target.value)}
                            placeholder="Enter city name"
                          />
                        </div>
                        <div className="flex-1">
                          <Label>Service Fee (₹)</Label>
                          <Input
                            type="number"
                            value={region.fee}
                            onChange={(e) => updateSpecialRegion(index, "fee", Number(e.target.value))}
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeSpecialRegion(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>GST Compliance</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enable GST calculation in invoices
                    </p>
                  </div>
                  <Switch
                    checked={gstEnabled}
                    onCheckedChange={setGstEnabled}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* WhatsApp Integration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-token">API Token</Label>
                  <Input
                    id="whatsapp-token"
                    value={whatsappToken}
                    onChange={(e) => setWhatsappToken(e.target.value)}
                    placeholder="Enter your WhatsApp Cloud API token"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get your token from the WhatsApp Business Cloud API dashboard.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Database Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  Database Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supabase-url">Supabase URL</Label>
                  <Input
                    id="supabase-url"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://your-project.supabase.co"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supabase-key">Supabase Key</Label>
                  <Input
                    id="supabase-key"
                    type="password"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    placeholder="Enter your Supabase service role key"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Printer Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Printer className="mr-2 h-5 w-5" />
                  Printer Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Connected Printers</h3>
                    <Button onClick={addPrinter} size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Printer
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {printers.map((printer, index) => (
                      <div key={printer.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <Label>Printer Name</Label>
                          <Input
                            value={printer.name}
                            onChange={(e) => updatePrinter(index, "name", e.target.value)}
                            placeholder="Enter printer name"
                          />
                        </div>
                        <div className="flex-1">
                          <Label>Connection Type</Label>
                          <select
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            value={printer.type}
                            onChange={(e) => updatePrinter(index, "type", e.target.value)}
                          >
                            <option value="bluetooth">Bluetooth</option>
                            <option value="usb">USB/COM</option>
                            <option value="network">Network</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <Label>{printer.type === "bluetooth" ? "MAC Address" : "Port"}</Label>
                          <Input
                            value={printer.type === "bluetooth" ? printer.mac : printer.port}
                            onChange={(e) => updatePrinter(index, printer.type === "bluetooth" ? "mac" : "port", e.target.value)}
                            placeholder={printer.type === "bluetooth" ? "00:11:22:33:44:55" : "COM1"}
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removePrinter(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          {/* Save Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Save className="mr-2 h-5 w-5" />
                  Save Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Make sure to save your changes after making any modifications.
                </p>
                <Button className="w-full" onClick={saveSettings}>
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Version</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Last Updated</span>
                  <span className="font-medium">October 20, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Environment</span>
                  <span className="font-medium">Production</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}