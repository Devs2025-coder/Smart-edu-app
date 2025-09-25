
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Camera, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import jsQR from 'jsqr';

export default function StudentAttendancePage() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const handleVerification = useCallback((qrDataString: string) => {
    setIsVerifying(true);
    setIsScanning(false);
    stopCamera();

    // Simulate verification and show success message
    setTimeout(() => {
      console.log('Scanned QR Data:', qrDataString);
      toast({
        title: "Scanning is successful!",
        description: "Your attendance has been marked.",
      });
      setIsVerifying(false);
    }, 1000);
  }, [stopCamera, toast]);

  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d', { willReadFrequently: true });
  
        if (context) {
          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });
  
          if (code) {
            handleVerification(code.data);
            return; // Stop the loop once a code is found
          }
        }
      }
      if (isScanning) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    const startScan = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasPermission(true);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.oncanplay = () => {
            if (isScanning) {
               animationFrameId = requestAnimationFrame(tick);
            }
          };
          videoRef.current.play().catch(e => console.error("Video play failed:", e));
        }
      } catch (error: any) {
        console.error("Permission error:", error);
        setHasPermission(false);
        toast({ variant: "destructive", title: "Camera Permission Required", description: "Camera access is required to scan the QR code." });
        setIsScanning(false);
      }
    };

    if (isScanning) {
      startScan();
    } else {
      stopCamera();
    }

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId);
      stopCamera();
    };
  }, [isScanning, handleVerification, stopCamera, toast]);


  const handleScanClick = () => {
    if (isScanning) {
      setIsScanning(false);
    } else {
      setIsScanning(true);
      setIsVerifying(false); // Reset verification state
      setHasPermission(null); // Reset permission state to re-trigger checks
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>
            Scan the QR code presented by your professor.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-6 p-8">
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div className="w-full max-w-md aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center relative">
            <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
            
            {isScanning && hasPermission && !isVerifying && (
                <div className="absolute inset-0 bg-transparent flex flex-col items-center justify-center text-white p-4 text-center pointer-events-none" style={{ textShadow: '0 0 8px rgba(0,0,0,0.7)' }}>
                    <div className="border-2 border-dashed border-white/50 w-3/4 h-3/4 rounded-lg"></div>
                    <p className="mt-4 font-semibold">Scan QR Code</p>
                </div>
            )}

            {!isScanning && !isVerifying && (
               <div className="absolute inset-0 text-muted-foreground flex flex-col items-center justify-center gap-2">
                    <Camera className="w-24 h-24" />
                    <p>Ready to scan</p>
                </div>
            )}
            
            {isVerifying && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white gap-2">
                    <Loader2 className="h-8 w-8 animate-spin"/>
                    <span>QR Scanned! Verifying...</span>
                </div>
            )}
          </div>
          
           {hasPermission === false && !isScanning && (
            <Alert variant="destructive" className="w-full max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Permissions Denied</AlertTitle>
              <AlertDescription>
                Camera access was denied. Please enable it in your browser settings to continue.
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={handleScanClick} size="lg" disabled={isVerifying}>
            <QrCode className="mr-2 h-5 w-5" />
            {isScanning ? (isVerifying ? 'Verifying...' : 'Stop Scanning') : 'Start QR Scan'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
