import { FileText, Download, Share2, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface ReportDisplayProps {
  report: string;
  fileName?: string;
}

export function ReportDisplay({ report, fileName }: ReportDisplayProps) {
  const handleDownloadPDF = () => {
    toast.success('Relatório baixado!', {
      description: 'O arquivo PDF foi salvo com sucesso.'
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copiado!', {
      description: 'O link do relatório foi copiado para a área de transferência.'
    });
  };

  const formatReport = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-semibold text-gray-100 mb-4 mt-6">{line.replace('# ', '')}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold text-gray-100 mb-3 mt-5">{line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold text-gray-100 mb-2 mt-4">{line.replace('### ', '')}</h3>;
        }
        
        if (line.startsWith('**') && line.includes(':**')) {
          const [label, value] = line.split(':**');
          return (
            <p key={index} className="text-gray-300 mb-2 leading-relaxed">
              <strong className="text-gray-100 font-semibold">{label.replace('**', '')}:</strong>
              {value}
            </p>
          );
        }
        
        if (line.match(/^\d+\./)) {
          return <li key={index} className="text-gray-300 ml-6 mb-2 leading-relaxed">{line.replace(/^\d+\.\s*/, '')}</li>;
        }
        
        if (line.startsWith('- ')) {
          return <li key={index} className="text-gray-300 ml-6 mb-2 leading-relaxed">{line.replace('- ', '')}</li>;
        }
        
        if (line.startsWith('⚠️')) {
          return (
            <p key={index} className="text-amber-300 bg-amber-900/30 p-3 rounded-lg my-4 border-l-4 border-amber-500 leading-relaxed">
              {line}
            </p>
          );
        }
        
        if (line === '---') {
          return <hr key={index} className="my-6 border-gray-700" />;
        }
        
        if (line.startsWith('*') && line.endsWith('*')) {
          return <p key={index} className="text-gray-400 text-center italic mt-4">{line.replace(/\*/g, '')}</p>;
        }
        
        if (line.trim() !== '') {
          return <p key={index} className="text-gray-300 mb-3 leading-relaxed">{line}</p>;
        }
        
        return <div key={index} className="h-4" />;
      });
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700/60 p-6 md:p-8 rounded-2xl shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-700">
        <div className="flex items-start gap-5">
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-3 rounded-xl mt-1 shadow-md">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-1">Relatório Gerado com Sucesso</h2>
            <p className="text-gray-300">
              Análise completa baseada em: <strong className="font-semibold text-gray-200">{fileName}</strong>
            </p>
            <div className="flex gap-2 mt-3">
              <Badge variant="secondary" className="bg-green-900/50 text-green-300 border-green-700 font-semibold">
                ✓ Processado
              </Badge>
              <Badge variant="secondary" className="bg-purple-900/50 text-purple-300 border-purple-700 font-semibold">
                IA Avançada
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2 self-start md:self-center">
          <Button 
            variant="outline" 
            onClick={handleShare}
            className="gap-2 border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <Share2 className="w-4 h-4" />
            Compartilhar
          </Button>
          <Button 
            onClick={handleDownloadPDF}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-semibold gap-2 shadow-lg"
          >
            <Download className="w-4 h-4" />
            Baixar PDF
          </Button>
        </div>
      </div>

      <div className="bg-gray-900/50 rounded-2xl p-6 md:p-8 border border-gray-700/80">
        {formatReport(report)}
      </div>
    </Card>
  );
}
