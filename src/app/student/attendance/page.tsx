
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Camera, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import haversine from 'haversine-distance';

export default function StudentAttendancePage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };
  
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleVerification = (studentLocation: GeolocationCoordinates) => {
    setIsVerifying(true);
    
    // Mock QR data with professor's location
    const MOCK_PROFESSOR_LOCATION = {
      latitude: studentLocation.latitude + 0.0001, // ~11 meters away
      longitude: studentLocation.longitude + 0.0001,
    };

    const distance = haversine(studentLocation, MOCK_PROFESSOR_LOCATION);

    setTimeout(() => {
      if (distance <= 100) { // 100 meters threshold
        toast({
          title: "Verification Successful!",
          description: "Your attendance has been marked.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: "You are too far from the classroom.",
        });
      }
      
      setIsVerifying(false);
      setIsScanning(false);
      stopCamera();
    }, 1500); 
  };
  
  const startScan = async () => {
    setIsScanning(true);
    setHasCameraPermission(null);
    setHasLocationPermission(null);

    // 1. Get Location
    if (!navigator.geolocation) {
      setHasLocationPermission(false);
      toast({ variant: "destructive", title: "Geolocation Not Supported" });
      setIsScanning(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setHasLocationPermission(true);

        // 2. Get Camera
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          setHasCameraPermission(true);
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              // Simulate scanning and then verify
              setTimeout(() => handleVerification(position.coords), 1000);
            };
          }
        } catch (error: any) {
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions to continue.',
          });
          setIsScanning(false);
        }
      },
      (error) => {
        setHasLocationPermission(false);
        toast({
          variant: "destructive",
          title: "Location Access Denied",
          description: "Please enable location permissions to mark attendance.",
        });
        setIsScanning(false);
      }
    );
  };

  const handleScanClick = () => {
    if (isScanning) {
      setIsScanning(false);
      setIsVerifying(false);
      stopCamera();
    } else {
      startScan();
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
          <div className="w-full max-w-md aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center relative">
            {isScanning ? (
                <>
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    {isVerifying && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white gap-2">
                            <Loader2 className="h-8 w-8 animate-spin"/>
                            <span>Verifying location...</span>
                        </div>
                    )}
                </>
            ) : (
               <div className="text-muted-foreground flex flex-col items-center gap-2">
                    <Camera className="w-24 h-24" />
                    <p>Ready to scan</p>
                </div>
            )}
          </div>
          
           {(hasCameraPermission === false || hasLocationPermission === false) && !isScanning && (
            <Alert variant="destructive" className="w-full max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Permissions Required</AlertTitle>
              <AlertDescription>
                Please grant both camera and location access to scan the QR code.
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
