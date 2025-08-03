import { pipeline } from "@huggingface/transformers";

export interface FileAnalysisResult {
  type: 'text' | 'image' | 'document' | 'audio';
  analysis: {
    summary?: string;
    sentiment?: { label: string; score: number }[];
    classification?: { label: string; score: number }[];
    entities?: { entity: string; label: string; score: number }[];
    embedding?: number[];
    transcription?: string;
    translation?: string;
  };
  metadata: {
    fileName: string;
    fileSize: number;
    mimeType: string;
    processedAt: string;
    processingTime: number;
  };
}

export class FileAnalysisService {
  private static textClassifier: any = null;
  private static sentimentAnalyzer: any = null;
  private static imageClassifier: any = null;
  private static speechRecognizer: any = null;
  private static embedder: any = null;

  static async initializeModels() {
    try {
      console.log('Initializing AI models for file analysis...');
      
      // Initialize models on demand to avoid loading all at once
      this.textClassifier = await pipeline(
        "text-classification",
        "cardiffnlp/twitter-roberta-base-sentiment-latest",
        { device: "webgpu" }
      );

      this.imageClassifier = await pipeline(
        "image-classification",
        "onnx-community/mobilenetv4_conv_small.e2400_r224_in1k",
        { device: "webgpu" }
      );

      console.log('AI models initialized successfully');
    } catch (error) {
      console.warn('WebGPU not available, falling back to CPU:', error);
      // Fallback to CPU if WebGPU not available
      this.textClassifier = await pipeline(
        "text-classification",
        "cardiffnlp/twitter-roberta-base-sentiment-latest"
      );
    }
  }

  static async analyzeText(text: string, fileName: string): Promise<FileAnalysisResult> {
    const startTime = Date.now();

    try {
      if (!this.textClassifier) {
        await this.initializeModels();
      }

      // Sentiment analysis
      const sentiment = await this.textClassifier(text);

      // Simple text summary (first 200 characters + analysis)
      const summary = text.length > 200 ? text.substring(0, 200) + '...' : text;

      // Text statistics
      const wordCount = text.split(/\s+/).length;
      const charCount = text.length;

      return {
        type: 'text',
        analysis: {
          summary,
          sentiment: sentiment.map((s: any) => ({
            label: s.label,
            score: s.score
          })),
          entities: [], // Could add named entity recognition
        },
        metadata: {
          fileName,
          fileSize: charCount,
          mimeType: 'text/plain',
          processedAt: new Date().toISOString(),
          processingTime: Date.now() - startTime
        }
      };
    } catch (error) {
      console.error('Error analyzing text:', error);
      throw error;
    }
  }

  static async analyzeImage(imageFile: File): Promise<FileAnalysisResult> {
    const startTime = Date.now();

    try {
      if (!this.imageClassifier) {
        await this.initializeModels();
      }

      const imageUrl = URL.createObjectURL(imageFile);
      const classification = await this.imageClassifier(imageUrl);

      // Clean up object URL
      URL.revokeObjectURL(imageUrl);

      return {
        type: 'image',
        analysis: {
          classification: classification.map((c: any) => ({
            label: c.label,
            score: c.score
          })),
          summary: `Image classified as: ${classification[0]?.label || 'Unknown'}`
        },
        metadata: {
          fileName: imageFile.name,
          fileSize: imageFile.size,
          mimeType: imageFile.type,
          processedAt: new Date().toISOString(),
          processingTime: Date.now() - startTime
        }
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  }

  static async analyzeAudio(audioFile: File): Promise<FileAnalysisResult> {
    const startTime = Date.now();

    try {
      if (!this.speechRecognizer) {
        this.speechRecognizer = await pipeline(
          "automatic-speech-recognition",
          "onnx-community/whisper-tiny.en"
        );
      }

      const audioUrl = URL.createObjectURL(audioFile);
      const transcription = await this.speechRecognizer(audioUrl);
      URL.revokeObjectURL(audioUrl);

      return {
        type: 'audio',
        analysis: {
          transcription: transcription.text,
          summary: `Audio transcription: ${transcription.text.substring(0, 100)}${transcription.text.length > 100 ? '...' : ''}`
        },
        metadata: {
          fileName: audioFile.name,
          fileSize: audioFile.size,
          mimeType: audioFile.type,
          processedAt: new Date().toISOString(),
          processingTime: Date.now() - startTime
        }
      };
    } catch (error) {
      console.error('Error analyzing audio:', error);
      throw error;
    }
  }

  static async analyzeDocument(file: File): Promise<FileAnalysisResult> {
    const startTime = Date.now();

    try {
      let text = '';

      if (file.type === 'application/pdf') {
        // For PDF files, we'd need a PDF parser
        // For now, return basic metadata
        text = 'PDF document analysis requires additional parsing';
      } else if (file.type.includes('text') || file.name.endsWith('.txt')) {
        text = await file.text();
        return await this.analyzeText(text, file.name);
      } else {
        text = 'Document type not supported for text analysis';
      }

      return {
        type: 'document',
        analysis: {
          summary: `Document: ${file.name} (${file.type})`,
        },
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          processedAt: new Date().toISOString(),
          processingTime: Date.now() - startTime
        }
      };
    } catch (error) {
      console.error('Error analyzing document:', error);
      throw error;
    }
  }

  static async analyzeFile(file: File): Promise<FileAnalysisResult> {
    const mimeType = file.type;

    if (mimeType.startsWith('image/')) {
      return await this.analyzeImage(file);
    } else if (mimeType.startsWith('audio/')) {
      return await this.analyzeAudio(file);
    } else if (mimeType.startsWith('text/') || mimeType === 'application/pdf' || file.name.endsWith('.txt')) {
      return await this.analyzeDocument(file);
    } else {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }
  }
}