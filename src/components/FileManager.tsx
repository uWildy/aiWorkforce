import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  Music, 
  Video, 
  Trash2, 
  Eye, 
  Download,
  Brain,
  Clock,
  FileCheck
} from "lucide-react";
import { FileAnalysisService, FileAnalysisResult } from '@/services/fileAnalysisService';
import { FileStorageService, FileRecord } from '@/services/fileStorageService';
import { toast } from 'sonner';

interface FileManagerProps {
  agentId: string;
  onFileAnalyzed?: (result: FileAnalysisResult) => void;
}

export function FileManager({ agentId, onFileAnalyzed }: FileManagerProps) {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        setUploadProgress((i / acceptedFiles.length) * 50);

        // Analyze file
        setAnalyzing(true);
        let analysisResult: FileAnalysisResult | undefined;
        
        try {
          analysisResult = await FileAnalysisService.analyzeFile(file);
          onFileAnalyzed?.(analysisResult);
        } catch (error) {
          console.warn('File analysis failed:', error);
          toast.error(`Analysis failed for ${file.name}`);
        }

        setAnalyzing(false);
        setUploadProgress(50 + (i / acceptedFiles.length) * 50);

        // Upload file
        const fileRecord = await FileStorageService.uploadFile(file, agentId, analysisResult);
        setFiles(prev => [fileRecord, ...prev]);

        toast.success(`${file.name} uploaded and analyzed successfully`);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
      setAnalyzing(false);
      setUploadProgress(0);
    }
  }, [agentId, onFileAnalyzed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'text/*': ['.txt', '.md', '.csv'],
      'audio/*': ['.mp3', '.wav', '.ogg'],
      'application/pdf': ['.pdf'],
      'application/json': ['.json']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleDeleteFile = async (fileId: string) => {
    try {
      await FileStorageService.deleteFile(fileId);
      setFiles(prev => prev.filter(f => f.id !== fileId));
      toast.success('File deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete file');
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (mimeType.startsWith('audio/')) return <Music className="w-4 h-4" />;
    if (mimeType.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (mimeType.includes('text') || mimeType.includes('pdf')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            File Upload & Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium">Drop files here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports images, audio, text files, and PDFs (max 10MB)
                </p>
              </div>
            )}
          </div>

          {(uploading || analyzing) && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{analyzing ? 'Analyzing files...' : 'Uploading files...'}</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Agent Files
            </div>
            <Badge variant="outline">{files.length} files</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <File className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No files uploaded yet</p>
            </div>
          ) : (
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={file.id}>
                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/50">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.mime_type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file.file_name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{formatFileSize(file.file_size)}</span>
                            <span>•</span>
                            <Clock className="w-3 h-3" />
                            <span>{new Date(file.uploaded_at).toLocaleDateString()}</span>
                            {file.analysis_result && (
                              <>
                                <span>•</span>
                                <Brain className="w-3 h-3" />
                                <span>Analyzed</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFile(file)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const url = FileStorageService.getFileUrl(file.file_path);
                            window.open(url, '_blank');
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {index < files.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* File Analysis Details */}
      {selectedFile?.analysis_result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Analysis Results: {selectedFile.file_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">File Type:</span>
                <span className="ml-2">{selectedFile.analysis_result.type}</span>
              </div>
              <div>
                <span className="font-medium">Processing Time:</span>
                <span className="ml-2">{selectedFile.analysis_result.metadata.processingTime}ms</span>
              </div>
            </div>

            {selectedFile.analysis_result.analysis.summary && (
              <div>
                <h4 className="font-medium mb-2">Summary</h4>
                <p className="text-sm text-muted-foreground p-3 bg-secondary/50 rounded">
                  {selectedFile.analysis_result.analysis.summary}
                </p>
              </div>
            )}

            {selectedFile.analysis_result.analysis.sentiment && (
              <div>
                <h4 className="font-medium mb-2">Sentiment Analysis</h4>
                <div className="space-y-1">
                  {selectedFile.analysis_result.analysis.sentiment.map((s: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span>{s.label}</span>
                      <Badge variant="outline">{(s.score * 100).toFixed(1)}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedFile.analysis_result.analysis.classification && (
              <div>
                <h4 className="font-medium mb-2">Classification</h4>
                <div className="space-y-1">
                  {selectedFile.analysis_result.analysis.classification.slice(0, 3).map((c: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span>{c.label}</span>
                      <Badge variant="outline">{(c.score * 100).toFixed(1)}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedFile.analysis_result.analysis.transcription && (
              <div>
                <h4 className="font-medium mb-2">Transcription</h4>
                <p className="text-sm text-muted-foreground p-3 bg-secondary/50 rounded">
                  {selectedFile.analysis_result.analysis.transcription}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}