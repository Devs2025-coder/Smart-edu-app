
'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { QrCode, List, FileUp, Check, X, Minus, Loader2, MapPin, TimerOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const studentsData = [
  { id: '101', name: 'John Doe', status: 'present' },
  { id: '102', name: 'Jane Smith', status: 'present' },
  { id: '103', name: 'Peter Jones', status: 'absent' },
  { id: '104', name: 'Mary Johnson', status: 'present' },
  { id: '105', name: 'David Williams', status: 'late' },
  { id: '106', name: 'Sarah Brown', status: 'present' },
  { id: '107', name: 'Michael Davis', status: 'present' },
];

const QR_CODE_VALIDITY_SECONDS = 20;

export default function AttendancePage() {
  const [attendanceMode, setAttendanceMode] = useState('qr');
  const [selectedClass, setSelectedClass] = useState('cs101');
  const [students, setStudents] = useState(studentsData);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | undefined>(undefined);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrCodeExpiry, setQrCodeExpiry] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(QR_CODE_VALIDITY_SECONDS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (qrCodeExpiry && countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setQrCodeData(null);
      setQrCodeExpiry(null);
      toast({
        variant: 'destructive',
        title: 'QR Code Expired',
        description: 'Please generate a new QR code.',
      });
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [qrCodeExpiry, countdown, toast]);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setStudents(
      students.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
  };
  
  const handleSelectAll = (checked: boolean) => {
    const newStatus = checked ? 'present' : 'absent';
    setStudents(students.map(s => ({ ...s, status: newStatus })));
  };
  
  const handleSaveAttendance = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Saving attendance:", students);
    setIsSaving(false);
    toast({
      title: 'Attendance Saved',
      description: `Attendance for ${selectedClass.toUpperCase()} has been successfully recorded.`,
    });
  }

  const handleGenerateQr = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setIsGeneratingQr(true);
    if (!navigator.geolocation) {
      setHasLocationPermission(false);
      toast({
        variant: "destructive",
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
      });
      setIsGeneratingQr(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setHasLocationPermission(true);
        const qrData = JSON.stringify({
          class: selectedClass,
          timestamp: new Date().toISOString(),
          geo: {
            lat: position.coords.latitude,
            long: position.coords.longitude,
          }
        });
        setQrCodeData(qrData);
        const expiryTime = Date.now() + QR_CODE_VALIDITY_SECONDS * 1000;
        setQrCodeExpiry(expiryTime);
        setCountdown(QR_CODE_VALIDITY_SECONDS);
        
        console.log("Generated QR Data:", qrData);
        toast({
          title: "QR Code Generated",
          description: "Students can now scan the code for attendance. This code is valid for 20 seconds.",
        });
        setIsGeneratingQr(false);
      },
      (error) => {
        setHasLocationPermission(false);
        console.error('Error getting location:', error);
        toast({
          variant: "destructive",
          title: "Location Access Denied",
          description: "Please enable location permissions in your browser settings to generate a QR code.",
        });
        setIsGeneratingQr(false);
      }
    );
  };

  const allPresent = students.every(s => s.status === 'present');
  const somePresent = students.some(s => s.status === 'present') && !allPresent;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected file:', file.name);
      // Simulate file processing
      toast({
        title: 'File Uploaded',
        description: `${file.name} has been selected for processing.`,
      });
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const renderAttendanceMode = () => {
    switch (attendanceMode) {
      case 'qr':
        return (
          <div className="text-center p-8 flex flex-col items-center justify-center gap-4">
            <h3 className="text-lg font-medium">Generate QR Code</h3>
            <p className="text-muted-foreground max-w-md">
              Display a QR code for students to scan. Location access is required to ensure academic integrity.
            </p>
             {hasLocationPermission === false && (
                <Alert variant="destructive" className="mt-4 text-left">
                    <AlertTitle>Location Access Required</AlertTitle>
                    <AlertDescription>
                        Please allow location access to generate a secure QR code for attendance.
                    </AlertDescription>
                </Alert>
              )}
            <div className="bg-muted w-64 h-64 flex items-center justify-center rounded-lg my-4">
                {qrCodeData ? (
                   // In a real app, this would be an <Image> component with the generated QR code
                  <div className="flex flex-col items-center gap-2">
                    <QrCode className="w-32 h-32 text-primary" />
                    <span className="text-sm font-mono bg-background p-2 rounded-md">SCAN_ME</span>
                     <div className="font-mono text-lg text-primary mt-2">
                        Expires in: {formatTime(countdown)}
                     </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    {countdown === 0 ? (
                      <>
                        <TimerOff className="w-32 h-32" />
                        <span className="font-semibold">QR Code Expired</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-32 h-32" />
                        <span>Ready to generate</span>
                      </>
                    )}
                  </div>
                )}
            </div>
            <Button onClick={handleGenerateQr} disabled={isGeneratingQr}>
              {isGeneratingQr && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <QrCode className="mr-2 h-4 w-4" /> {qrCodeData ? 'Regenerate QR Code' : 'Generate & Display QR'}
            </Button>
          </div>
        );
      case 'manual':
        return (
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                   <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={allPresent}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox 
                        checked={student.status === 'present'}
                        onCheckedChange={(checked) => handleStatusChange(student.id, checked ? 'present' : 'absent')}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.id}</TableCell>
                    <TableCell className="text-center">
                       <Select 
                          value={student.status}
                          onValueChange={(value: 'present' | 'absent' | 'late') => handleStatusChange(student.id, value)}
                        >
                          <SelectTrigger className="w-32 mx-auto">
                            <SelectValue/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present"><div className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Present</div></SelectItem>
                            <SelectItem value="absent"><div className="flex items-center"><X className="mr-2 h-4 w-4 text-red-500" /> Absent</div></SelectItem>
                            <SelectItem value="late"><div className="flex items-center"><Minus className="mr-2 h-4 w-4 text-yellow-500" /> Late</div></SelectItem>
                          </SelectContent>
                        </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end mt-6">
                <Button onClick={handleSaveAttendance} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Attendance
                </Button>
            </div>
          </div>
        );
      case 'bulk':
        return (
           <div className="text-center p-8 flex flex-col items-center justify-center gap-4">
             <h3 className="text-lg font-medium">Bulk Upload</h3>
            <p className="text-muted-foreground">
              Upload a CSV or Excel file with student IDs and attendance status.
            </p>
             <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-12 w-full max-w-md">
                 <FileUp className="w-12 h-12 text-muted-foreground mx-auto" />
                 <p className="mt-4">Drag & drop your file here or</p>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                />
                <Button variant="link" onClick={handleBrowseClick}>browse to upload</Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>
            Select a class and choose your method to mark attendance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select defaultValue="cs101" onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cs101">Computer Science 101</SelectItem>
                <SelectItem value="ph203">Physics 203</SelectItem>
                <SelectItem value="ma305">Mathematics 305</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1" />
             <Select value={attendanceMode} onValueChange={setAttendanceMode}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Select Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qr">Generate QR Code</SelectItem>
                <SelectItem value="manual">Manual List</SelectItem>
                <SelectItem value="bulk">Bulk Upload</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="border rounded-lg">
             {renderAttendanceMode()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
