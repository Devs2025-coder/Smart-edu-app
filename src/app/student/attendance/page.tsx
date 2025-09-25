
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Camera, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import haversine from 'haversine-distance';

// This is a mock of what the professor's QR code would contain
const MOCK_PROFESSOR_QR_DATA = JSON.stringify({
  class: 'cs101',
  timestamp: new Date().toISOString(),
  geo: {
    latitude: 34.052235, // Mock professor's latitude
    longitude: -118.243683, // Mock professor's longitude
  }
});

const MAX_DISTANCE_METERS = 10;

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

  const handleVerification = (studentCoords: GeolocationCoordinates) => {
    setIsVerifying(true);
    
    // Simulate scanning and verification delay
    setTimeout(() => {
        // In a real app, this data would come from a QR scanner library
        const professorQrData = JSON.parse(MOCK_PROFESSOR_QR_DATA);
        
        const studentLocation = { latitude: studentCoords.latitude, longitude: studentCoords.longitude };
        const professorLocation = { latitude: professorQrData.geo.latitude, longitude: professorQrData.geo.longitude };

        const distance = haversine(studentLocation, professorLocation);
        
        if (distance <= MAX_DISTANCE_METERS) {
        toast({
            title: "Attendance Marked!",
            description: "You have been successfully marked as present.",
        });
        } else {
        toast({
            variant: "destructive",
            title: "Verification Failed",
            description: `You are not in the classroom. Distance: ${distance.toFixed(2)}m. Please move closer and try again.`,
        });
        }
        setIsVerifying(false);
        setIsScanning(false);
        stopCamera();
    }, 1500); // Simulate 1.5 second scan/verification time
  };
  
  const startScan = async () => {
    setIsScanning(true);
    setHasCameraPermission(null);
    setHasLocationPermission(null);
  
    try {
      // Request camera first to show preview immediately
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setHasCameraPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
  
      // Then get location and perform verification
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setHasLocationPermission(true);
          handleVerification(position.coords);
        },
        (error) => {
          setHasLocationPermission(false);
          toast({
            variant: 'destructive',
            title: 'Location Access Denied',
            description: 'Please enable location permissions to verify your position.',
          });
          setIsScanning(false);
          stopCamera();
        }
      );
  
    } catch (error: any) {
      setIsScanning(false);
      stopCamera();
  
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setHasCameraPermission(false);
        toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
        });
      } else if (error.message.includes('geolocation')) {
        setHasLocationPermission(false);
        toast({
            variant: "destructive",
            title: "Geolocation Error",
            description: error.message,
        });
      } else {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Error',
          description: 'Could not access the camera. It might be in use by another application.',
        });
      }
      console.error('Error starting scan:', error);
    }
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
            Scan the QR code presented by your professor. You must be in the classroom to be marked present.
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
                {hasCameraPermission === false && "Please grant camera access to scan the QR code. "}
                {hasLocationPermission === false && "Please grant location access to verify your position."}
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
