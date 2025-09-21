
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
import { QrCode, List, FileUp, Check, X, Minus, Loader2 } from 'lucide-react';
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

export default function AttendancePage() {
  const [attendanceMode, setAttendanceMode] = useState('qr');
  const [selectedClass, setSelectedClass] = useState('cs101');
  const [students, setStudents] = useState(studentsData);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (attendanceMode === 'qr-scan') {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({video: true});
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this feature.',
          });
        }
      };
      getCameraPermission();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [attendanceMode, toast]);

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

  const allPresent = students.every(s => s.status === 'present');
  const somePresent = students.some(s => s.status === 'present') && !allPresent;

  const renderAttendanceMode = () => {
    switch (attendanceMode) {
      case 'qr':
        return (
          <div className="text-center p-8 flex flex-col items-center justify-center gap-4">
            <h3 className="text-lg font-medium">Generate QR Code</h3>
            <p className="text-muted-foreground">
              Display a QR code for students to scan and mark their own attendance.
            </p>
            <div className="bg-muted w-64 h-64 flex items-center justify-center rounded-lg">
                <QrCode className="w-32 h-32 text-muted-foreground" />
            </div>
            <Button>
              <QrCode className="mr-2 h-4 w-4" /> Generate & Display QR
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
                <Button variant="link">browse to upload</Button>
            </div>
          </div>
        );
      case 'qr-scan':
        return (
           <div className="p-8 flex flex-col items-center justify-center gap-4">
             <h3 className="text-lg font-medium">Scan Student QR Code</h3>
             <p className="text-muted-foreground max-w-md text-center">
              Use the camera to scan a student's QR code from their ID card or mobile device to mark them present.
            </p>
            <div className="w-full max-w-md">
              <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline/>
              {hasCameraPermission === false && (
                <Alert variant="destructive" className="mt-4">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                        Please allow camera access in your browser to use this feature.
                    </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )
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
                <SelectItem value="qr-scan">Scan Student QR</SelectItem>
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
