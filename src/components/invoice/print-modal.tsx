"use client";

import { useState } from "react";
import { 
  Printer, 
  Download, 
  MessageCircle,
  Chrome,
  Bluetooth,
  HardDrive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PrintModalProps {
  orderId: string;
  invoiceUrl: string;
  onPrint: (method: 'browser' | 'bluetooth' | 'local') => void;
  onDownload: () => void;
  onSendWhatsApp: (phoneNumber: string) => void;
}

export function PrintModal({ 
  orderId, 
  invoiceUrl, 
  onPrint, 
  onDownload,
  onSendWhatsApp
}: PrintModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendWhatsApp = async () => {
    if (!phoneNumber) return;
    
    setIsSending(true);
    await onSendWhatsApp(phoneNumber);
    setIsSending(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Printer className="mr-2 h-4 w-4" />
          Print/Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Print & Share Invoice</DialogTitle>
          <DialogDescription>
            Choose how you'd like to handle this invoice for order {orderId}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Print Options</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  onPrint('browser');
                  setIsOpen(false);
                }}
              >
                <Chrome className="mr-2 h-4 w-4" />
                Browser Print
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  onPrint('bluetooth');
                  setIsOpen(false);
                }}
              >
                <Bluetooth className="mr-2 h-4 w-4" />
                Bluetooth Printer
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  onPrint('local');
                  setIsOpen(false);
                }}
              >
                <HardDrive className="mr-2 h-4 w-4" />
                Local Print Agent
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Other Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  onDownload();
                  setIsOpen(false);
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              
              <div className="grid gap-2">
                <Label htmlFor="phone">Send via WhatsApp</Label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleSendWhatsApp}
                    disabled={!phoneNumber || isSending}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {isSending ? "Sending..." : "Send"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}