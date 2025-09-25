
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Camera, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function StudentAttendancePage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
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

  const handleScanSuccess = () => {
    setIsVerifying(true);
    
    setTimeout(() => {
      toast({
        title: "Scanning is successful",
        description: "Your attendance has been marked.",
      });
      setIsVerifying(false);
      setIsScanning(false);
      stopCamera();
    }, 1500); 
  };
  
  const startScan = async () => {
    setIsScanning(true);
    setHasCameraPermission(null);
  
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setHasCameraPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          handleScanSuccess();
        };
      }
  
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
            Scan the QR code presented by your professor.
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
                            <span>Verifying scan...</span>
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
          
           {(hasCameraPermission === false) && !isScanning && (
            <Alert variant="destructive" className="w-full max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Permissions Required</AlertTitle>
              <AlertDescription>
                Please grant camera access to scan the QR code.
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
