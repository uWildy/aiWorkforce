import { createClient } from '@supabase/supabase-js';

// Note: In a real application, these should be environment variables
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface FileRecord {
  id: string;
  agent_id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  file_path: string;
  analysis_result?: any;
  uploaded_at: string;
  updated_at: string;
}

export class FileStorageService {
  static async uploadFile(file: File, agentId: string, analysisResult?: any): Promise<FileRecord> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${agentId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('agent-files')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Save file metadata to database
      const { data: fileRecord, error: dbError } = await supabase
        .from('agent_files')
        .insert({
          agent_id: agentId,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          file_path: uploadData.path,
          analysis_result: analysisResult
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      return fileRecord;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  static async getAgentFiles(agentId: string): Promise<FileRecord[]> {
    try {
      const { data, error } = await supabase
        .from('agent_files')
        .select('*')
        .eq('agent_id', agentId)
        .order('uploaded_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching agent files:', error);
      throw error;
    }
  }

  static async deleteFile(fileId: string): Promise<void> {
    try {
      // Get file record to get the path
      const { data: fileRecord, error: fetchError } = await supabase
        .from('agent_files')
        .select('file_path')
        .eq('id', fileId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('agent-files')
        .remove([fileRecord.file_path]);

      if (storageError) {
        console.warn('Error deleting from storage:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('agent_files')
        .delete()
        .eq('id', fileId);

      if (dbError) {
        throw dbError;
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  static async downloadFile(filePath: string): Promise<Blob> {
    try {
      const { data, error } = await supabase.storage
        .from('agent-files')
        .download(filePath);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  static getFileUrl(filePath: string): string {
    const { data } = supabase.storage
      .from('agent-files')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
}