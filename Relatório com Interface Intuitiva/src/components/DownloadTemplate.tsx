import { Download, FileSpreadsheet, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { toast } from 'sonner';

export function DownloadTemplate() {
  const handleDownload = () => {
    // Prefer a static template file placed in `public/planilha_modelo_relatorios.csv` (Vite serves it at /planilha_modelo_relatorios.csv)
    // Fallback to generating the CSV on the fly if the static file isn't served for some reason.
    // Direct download: force the static XLS file from public/ to be downloaded unchanged.
    const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/';
    const xlsUrl = `${base}Modelo_base.xls`;

    const link = document.createElement('a');
    link.setAttribute('href', xlsUrl);
    // ensure the filename is preserved exactly
    link.setAttribute('download', 'Modelo_base.xls');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    // Direct click should prompt a download of the static file without modification
    link.click();
    document.body.removeChild(link);
    toast.success('Modelo base baixado com sucesso!', {
      description: 'O arquivo foi baixado sem alterações.'
    });
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700/60 p-6 md:p-8 rounded-2xl shadow-lg backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-5 flex-1">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-lg mt-1 shadow-md">
            <FileSpreadsheet className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <h2 className="text-xl font-semibold text-gray-100">Passo 1: Baixe a Planilha Modelo</h2>
            <p className="text-gray-300 leading-relaxed">
              Baixe nossa planilha padrão e preencha com os dados que deseja analisar. 
              A planilha já vem com exemplos e estrutura otimizada para nossa IA.
            </p>
            <Alert className="bg-gray-900/50 border-purple-500/30 text-purple-200 mt-4">
              <Info className="h-5 w-5 text-purple-400" />
              <AlertTitle className="font-semibold">Dica</AlertTitle>
              <AlertDescription>
                Mantenha a estrutura original das colunas para garantir os melhores resultados na análise.
              </AlertDescription>
            </Alert>
          </div>
        </div>
        <div className="flex-shrink-0">
          <Button 
            onClick={handleDownload}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-semibold gap-2 whitespace-nowrap md:w-auto shadow-lg min-w-[180px] justify-center"
          >
            <Download className="w-5 h-5" />
            Baixar Planilha
          </Button>
        </div>
      </div>
    </Card>
  );
}
