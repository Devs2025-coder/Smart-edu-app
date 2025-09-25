
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

  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const handleVerification = useCallback((studentLocation: GeolocationCoordinates, qrDataString: string) => {
    setIsVerifying(true);
    stopCamera();

    // Simulate verification delay
    setTimeout(() => {
      try {
        const qrData = JSON.parse(qrDataString);
        const professorLocation = qrData.geo;

        if (!professorLocation || typeof professorLocation.latitude !== 'number' || typeof professorLocation.longitude !== 'number') {
          throw new Error("Invalid QR code data.");
        }

        const distance = haversine(
          { latitude: studentLocation.latitude, longitude: studentLocation.longitude },
          { latitude: professorLocation.latitude, longitude: professorLocation.longitude }
        );

        if (distance <= 100) { // 100 meters threshold
          toast({
            title: "Verification Successful!",
            description: "Your attendance has been marked.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Verification Failed",
            description: `You are approximately ${Math.round(distance)} meters away from the classroom.`,
          });
        }
      } catch (e) {
        toast({
          variant: "destructive",
          title: "Invalid QR Code",
          description: "This QR code is not valid for attendance.",
        });
      }

      setIsVerifying(false);
      setIsScanning(false);
    }, 1000);
  }, [stopCamera, toast]);


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
          return; // Stop the loop once a code is found
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(() => tick(studentLocation));
  }, [handleVerification]);

  useEffect(() => {
    const startScan = async () => {
      if (!isScanning) {
        stopCamera();
        return;
      }

      setHasCameraPermission(null);
      setHasLocationPermission(null);
      let stream: MediaStream | null = null;
      try {
        // Request permissions
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) {
            return reject(new Error("Geolocation not supported"));
          }
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          });
        });
        setHasLocationPermission(true);
        
        // If everything is successful, setup the video and start scanning
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play().catch(e => console.error("Video play failed:", e));
              animationFrameRef.current = requestAnimationFrame(() => tick(position.coords));
            }
          };
        }

      } catch (error: any) {
        console.error("Permission error:", error);
        let title = "Error";
        let description = "Could not access camera or location.";
        
        if (error.name === 'NotAllowedError' || error.message.includes('permission denied')) {
            // Check if it's a location error first, as it's more specific
            if (error.code === 1 && 'geolocation' in navigator && error.message.toLowerCase().includes('location')){
                title = "Location Access Denied";
                description = "Please grant location access to continue.";
                setHasLocationPermission(false);
            } else { // Assume camera error otherwise
                title = "Camera Access Denied";
                description = "Please grant camera access to continue.";
                setHasCameraPermission(false);
            }
        } else if (error.name === 'NotFoundError') {
            title = "Camera not found";
            description = "No camera was found on this device.";
            setHasCameraPermission(false);
        } else if (error.name === 'TimeoutError') {
            title = "Location Timeout";
            description = "Could not get your location in time. Please try again.";
            setHasLocationPermission(false);
        }
        
        toast({ variant: "destructive", title, description });
        setIsScanning(false);
        stopCamera();
      }
    };
    
    startScan();

    // Cleanup function to stop camera when component unmounts or isScanning becomes false
    return () => {
      stopCamera();
    };
  }, [isScanning, stopCamera, tick, toast]);


  const handleScanClick = () => {
    if (isScanning) {
      setIsScanning(false);
      setIsVerifying(false);
    } else {
      setIsScanning(true);
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
            <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
            
            {isScanning && !isVerifying && hasCameraPermission && (
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
