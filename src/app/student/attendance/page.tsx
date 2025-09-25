
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Camera, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import jsQR from 'jsqr';
import { cn } from '@/lib/utils';

export default function StudentAttendancePage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);
  
  const tick = useCallback(() => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current;
      const canvasElement = canvasRef.current;
      if (canvasElement) {
        const canvas = canvasElement.getContext('2d', { willReadFrequently: true });
        if (canvas) {
          canvasElement.height = video.videoHeight;
          canvasElement.width = video.videoWidth;
          canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
          
          try {
            const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            });

            if (code) {
              setIsScanning(false);
              setIsVerifying(true);
              
              toast({
                title: "Scanning is successful!",
              });

              // Simulate verification and reset
              setTimeout(() => {
                setIsVerifying(false);
              }, 2000);
              return;
            }
          } catch(e) {
            console.error("Error scanning QR code", e);
          }
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(tick);
  }, [toast]);


  useEffect(() => {
    if (isScanning) {
      const startScan = async () => {
        try {
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error("Camera not supported on this browser.");
          }
          
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          streamRef.current = stream;
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.setAttribute("playsinline", "true"); // Required for iOS
            videoRef.current.play().then(() => {
                animationFrameRef.current = requestAnimationFrame(tick);
            }).catch(e => console.error("Video play failed:", e));
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          setHasCameraPermission(false);
          setIsScanning(false);
          toast({
            variant: "destructive",
            title: "Camera Permission Denied",
            description: "Please enable camera permissions in your browser settings to use this feature.",
          });
        }
      };

      startScan();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isScanning, stopCamera, tick, toast]);

  const handleScanClick = () => {
    if (!isScanning) {
      setHasCameraPermission(null);
    }
    setIsScanning(prev => !prev);
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
          <canvas ref={canvasRef} className="hidden" />
          <div className="w-full max-w-md aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center relative">
            <video ref={videoRef} className={cn("w-full h-full object-cover", { "hidden": !isScanning })} muted playsInline />
            
            {isScanning && hasCameraPermission && !isVerifying && (
                <div className="absolute inset-0 bg-transparent flex flex-col items-center justify-center text-white p-4 text-center pointer-events-none" style={{ textShadow: '0 0 8px rgba(0,0,0,0.7)' }}>
                    <div className="border-2 border-dashed border-white/50 w-3/4 h-3/4 rounded-lg"></div>
                    <p className="mt-4 font-semibold">Scanning for QR Code...</p>
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
                    <span>Verifying...</span>
                </div>
            )}
          </div>
          
           {hasCameraPermission === false && (
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
