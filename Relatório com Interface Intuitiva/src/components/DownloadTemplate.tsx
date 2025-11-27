import { Download, FileSpreadsheet, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { toast } from 'sonner';

export function DownloadTemplate() {
  const handleDownload = () => {
    const csvContent = `Nome,Produto,Valor,Quantidade,Data,Categoria,Status
João Silva,Notebook Dell,4500.00,2,2025-01-15,Eletrônicos,Aprovado
Maria Santos,Mouse Logitech,150.00,5,2025-01-16,Periféricos,Aprovado
Pedro Costa,Teclado Mecânico,350.00,3,2025-01-17,Periféricos,Pendente
Ana Oliveira,Monitor LG,1200.00,4,2025-01-18,Eletrônicos,Aprovado
Carlos Souza,Webcam HD,280.00,6,2025-01-19,Acessórios,Aprovado
Juliana Lima,Headset Gamer,450.00,2,2025-01-20,Acessórios,Cancelado
Roberto Alves,SSD 1TB,650.00,8,2025-01-21,Hardware,Aprovado
Fernanda Reis,Cadeira Gamer,1800.00,1,2025-01-22,Mobiliário,Aprovado
Lucas Martins,Mesa Digitalizadora,980.00,2,2025-01-23,Periféricos,Pendente
Patricia Rocha,Impressora HP,850.00,3,2025-01-24,Equipamentos,Aprovado`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'planilha_modelo_relatorios.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Planilha modelo baixada com sucesso!', {
      description: 'Preencha os dados e faça o upload para gerar o relatório.'
    });
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700/60 p-6 md:p-8 rounded-2xl shadow-lg backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-5 flex-1">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-lg mt-1 shadow-md">
            <FileSpreadsheet className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 space-y-2">
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
        <Button 
          onClick={handleDownload}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-semibold gap-2 whitespace-nowrap w-full md:w-auto shadow-lg"
        >
          <Download className="w-5 h-5" />
          Baixar Planilha
        </Button>
      </div>
    </Card>
  );
}
