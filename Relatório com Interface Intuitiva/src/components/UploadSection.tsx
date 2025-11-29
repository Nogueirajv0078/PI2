import { useState, useRef } from 'react';
import { Upload, FileCheck, Sparkles, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface UploadSectionProps {
  onFileUpload: (file: File) => void;
  uploadedFile: File | null;
  onGenerateReport: () => void;
  isGenerating: boolean;
}

export function UploadSection({ 
  onFileUpload, 
  uploadedFile, 
  onGenerateReport,
  isGenerating 
}: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validar extensão
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExtension)) {
      toast.error('Formato inválido', {
        description: 'Por favor, envie apenas arquivos CSV ou Excel (.xlsx, .xls).'
      });
      return;
    }

    // Validar tamanho (50MB máximo)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error('Arquivo muito grande', {
        description: 'O arquivo deve ter no máximo 50MB.'
      });
      return;
    }

    onFileUpload(file);
    toast.success('Arquivo carregado!', {
      description: 'Agora clique em "Gerar Relatório" para processar os dados.'
    });
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
        <div className="flex items-start gap-5">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-lg mt-1 shadow-md">
                <Upload className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 space-y-1">
                <h2 className="text-xl font-semibold text-gray-100">Passo 2: Envie sua Planilha</h2>
                <p className="text-gray-300 leading-relaxed">
                    Faça upload da planilha com seus dados e nossa IA irá gerar um relatório completo automaticamente.
                </p>
            </div>
        </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
          ${isDragging 
            ? 'border-purple-500 bg-purple-900/30 scale-105' 
            : uploadedFile 
              ? 'border-green-500 bg-green-900/30'
              : 'border-gray-700 bg-gray-900/50 hover:border-purple-500/50 hover:bg-gray-800/60'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
          onChange={handleFileInput}
          className="hidden"
        />
        
        {uploadedFile ? (
          <div className="flex flex-col items-center gap-2 text-center">
            <FileCheck className="w-12 h-12 text-green-400" />
            <div>
              <p className="font-semibold text-gray-100">{uploadedFile.name}</p>
              <p className="text-sm text-gray-300">
                {(uploadedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-10 h-10 text-gray-500" />
            <div>
              <p className="font-semibold text-gray-100">
                Arraste e solte ou clique para selecionar
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Formatos suportados: CSV, XLSX
              </p>
            </div>
          </div>
        )}
      </div>

      {uploadedFile && (
        <div className="mt-6 space-y-4 animate-in fade-in duration-500">
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-purple-300 font-semibold">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processando dados com IA...
                </span>
              </div>
              <Progress value={85} className="h-2 bg-purple-900/50" />
            </div>
          )}
          
          <Button
            onClick={onGenerateReport}
            disabled={isGenerating || !uploadedFile}
            size="lg"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-semibold gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Gerando Relatório...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Gerar Relatório com IA
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
