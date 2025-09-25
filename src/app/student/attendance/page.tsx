
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Camera, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import haversine from 'haversine-distance';
import jsQR from 'jsqr';

export default function StudentAttendancePage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const { toast } = useToast();

  const stopCameraAndScan = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const handleVerification = useCallback((studentLocation: GeolocationCoordinates, qrDataString: string) => {
    setIsVerifying(true);
    stopCameraAndScan();

    setTimeout(() => {
      try {
        const qrData = JSON.parse(qrDataString);
        const professorLocation = qrData.geo;

        if (!professorLocation || typeof professorLocation.latitude !== 'number' || typeof professorLocation.longitude !== 'number') {
          throw new Error("Invalid QR code data format.");
        }

        const distance = haversine(
          { latitude: studentLocation.latitude, longitude: studentLocation.longitude },
          { latitude: professorLocation.latitude, longitude: professorLocation.longitude }
        );

        if (distance <= 100) {
          toast({
            title: "Verification Successful!",
            description: "Your attendance has been marked.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Verification Failed",
            description: `You are approximately ${Math.round(distance)} meters away from the classroom. Please move closer and try again.`,
          });
        }
      } catch (e) {
        console.error("QR Verification Error:", e);
        toast({
          variant: "destructive",
          title: "Invalid QR Code",
          description: "This QR code is not valid for attendance. Please scan the correct code.",
        });
      }

      setIsVerifying(false);
      setIsScanning(false);
    }, 1000);
  }, [stopCameraAndScan, toast]);
  
  const tick = useCallback((studentLocation: GeolocationCoordinates) => {
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
          handleVerification(studentLocation, code.data);
          return;
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(() => tick(studentLocation));
  }, [handleVerification]);

  useEffect(() => {
    // This effect handles the camera and scanning logic
    if (isScanning) {
      let stream: MediaStream | null = null;

      const startScan = async () => {
        try {
          // Reset permissions state on each attempt
          setHasCameraPermission(true);
          setHasLocationPermission(true);

          // Get permissions and data in parallel
          const [mediaStream, geoPosition] = await Promise.all([
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }),
            new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
            })
          ]);
          
          stream = mediaStream;

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            // Use onloadedmetadata to ensure video dimensions are available
            videoRef.current.onloadedmetadata = () => {
              if (videoRef.current) {
                videoRef.current.play().then(() => {
                  // Start scanning loop
                  animationFrameRef.current = requestAnimationFrame(() => tick(geoPosition.coords));
                }).catch(e => console.error("Video play failed:", e));
              }
            };
          }
        } catch (error: any) {
          console.error("Permission error:", error);
          if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            setHasCameraPermission(false);
            setHasLocationPermission(false);
          }
          toast({ variant: "destructive", title: "Permissions Required", description: "Camera and location access are required to scan the QR code." });
          setIsScanning(false);
        }
      };

      startScan();

      // Cleanup function
      return () => {
        stopCameraAndScan();
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      };
    } else {
      stopCameraAndScan();
    }
  }, [isScanning, stopCameraAndScan, tick, toast]);


  const handleScanClick = () => {
    if (isScanning) {
      setIsScanning(false);
    } else {
      setIsScanning(true);
      setIsVerifying(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>
            Scan the QR code presented by your professor. Location and camera access are required.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-6 p-8">
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div className="w-full max-w-md aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center relative">
            <video ref={videoRef} className="w-full h-full object-cover" muted playsInline autoPlay/>
            
            {isScanning && !isVerifying && (
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
          
           {(hasCameraPermission === false || hasLocationPermission === false) && !isScanning && (
            <Alert variant="destructive" className="w-full max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Permissions Required</AlertTitle>
              <AlertDescription>
                {hasCameraPermission === false && "Camera access is required. "}
                {hasLocationPermission === false && "Location access is required. "}
                Please grant access to scan the QR code.
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
