import { useState } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { ExamplesCarousel } from '../components/ExamplesCarousel';
import { DashboardShowcase } from '../components/DashboardShowcase';
import { DownloadTemplate } from '../components/DownloadTemplate';
import { UploadSection } from '../components/UploadSection';
import { ReportDisplay } from '../components/ReportDisplay';
import  UserManagement  from '../components/UserManagement';
import { Toaster, toast } from '../components/ui/sonner';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { LogOut, User, Users } from 'lucide-react';
import { apiService } from '../services/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'reports' | 'users'>('reports');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setGeneratedReport(null);
  };

  const handleGenerateReport = async () => {
    if (!uploadedFile) {
      toast.error('Nenhum arquivo selecionado', {
        description: 'Por favor, selecione um arquivo antes de gerar o relatório.'
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Chamar API para gerar relatório
      const blob = await apiService.generateReport(uploadedFile);
      
      // Criar URL temporária para download
      const url = window.URL.createObjectURL(blob);
      
      // Criar elemento <a> para download automático
      const a = document.createElement('a');
      a.href = url;
      
      // Nome do arquivo com timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const fileName = `Relatorio_Financeiro_${timestamp}.xlsx`;
      a.download = fileName;
      
      // Adicionar ao DOM, clicar e remover
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Limpar URL temporária
      window.URL.revokeObjectURL(url);
      
      // Mostrar mensagem de sucesso
      toast.success('Relatório gerado com sucesso!', {
        description: 'O arquivo foi baixado automaticamente.'
      });
      
      // Marcar como gerado (para mostrar feedback visual)
      setGeneratedReport('success');
      
    } catch (error: any) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório', {
        description: error.message || 'Ocorreu um erro ao processar o arquivo. Tente novamente.'
      });
      setGeneratedReport(null);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-gray-100">
      <Header />
      
      <header className="sticky top-0 z-10 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto max-w-7xl px-4">
            <div className="py-3 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2.5 rounded-lg shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-gray-100 font-semibold text-lg">
                    Olá, {user?.first_name} {user?.last_name}
                  </h2>
                  <p className="text-gray-300 text-sm">{user?.email}</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
        </div>
      </header>
      
      <main className="container mx-auto max-w-7xl px-4">
        <div className="py-12 md:py-16">
          <Hero />

          <div className="mt-12 md:mt-16">
            <div className="flex space-x-1 mb-8 bg-gray-800/50 p-1 rounded-lg w-fit mx-auto md:mx-0">
              <Button
                onClick={() => setActiveTab('reports')}
                variant={activeTab === 'reports' ? 'default' : 'ghost'}
                className={activeTab === 'reports' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' 
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }
              >
                Relatórios
              </Button>
              <Button
                onClick={() => setActiveTab('users')}
                variant={activeTab === 'users' ? 'default' : 'ghost'}
                className={activeTab === 'users' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' 
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }
              >
                <Users className="w-4 h-4 mr-2" />
                Usuários
              </Button>
            </div>

            {activeTab === 'reports' && (
              <div className="space-y-16 md:space-y-20">
                <ExamplesCarousel />
                <DashboardShowcase />
                
                <div className="space-y-8 p-8 md:p-12 bg-gray-800/50 rounded-2xl shadow-lg">
                  <DownloadTemplate />
                  
                  <UploadSection 
                    onFileUpload={handleFileUpload}
                    uploadedFile={uploadedFile}
                    onGenerateReport={handleGenerateReport}
                    isGenerating={isGenerating}
                  />
                  
                  {generatedReport === 'success' && (
                    <div className="mt-6 p-6 bg-green-900/30 border border-green-700 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-600 p-2 rounded-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-green-300 font-semibold text-lg">Relatório Gerado com Sucesso!</h3>
                          <p className="text-green-400 text-sm mt-1">
                            O arquivo Excel foi baixado automaticamente. Verifique sua pasta de Downloads.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <UserManagement />
            )}
          </div>
        </div>
      </main>

      <Toaster />
    </div>
  );
}
