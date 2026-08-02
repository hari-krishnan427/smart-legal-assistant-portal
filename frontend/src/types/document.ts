export type LegalDocumentCategory = 'Contract' | 'NDA' | 'Court Brief' | 'Court Order' | 'Legal Opinion' | 'General Legal Document';

export interface LegalDocument {
  id: number;
  filename: string;
  originalFilename: string;
  contentType: string;
  fileSize: number;
  fileCategory: LegalDocumentCategory;
  extractedText: string;
  extractedTextSnippet: string;
  userId: number;
  userFullName: string;
  createdAt: string;
}

export interface UploadProgress {
  percentage: number;
  filename: string;
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  errorMessage?: string;
}
