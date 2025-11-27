import { useState } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { ExamplesCarousel } from '../components/ExamplesCarousel';
import { DashboardShowcase } from '../components/DashboardShowcase';
import { DownloadTemplate } from '../components/DownloadTemplate';
import { UploadSection } from '../components/UploadSection';
import { ReportDisplay } from '../components/ReportDisplay';
import  UserManagement  from '../components/UserManagement';
import { Toaster } from '../components/ui/sonner';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { LogOut, User, Users } from 'lucide-react';

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
    if (!uploadedFile) return;

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockReport = generateMockReport(uploadedFile.name);
    setGeneratedReport(mockReport);
    setIsGenerating(false);
  };

  const generateMockReport = (fileName: string): string => {
    const currentDate = new Date().toLocaleDateString('pt-BR');
    
    return `# Relatório de Análise de Dados
**Data de Geração:** ${currentDate}
**Arquivo Analisado:** ${fileName}
... (conteúdo do relatório permanece o mesmo) ...
*Relatório gerado automaticamente por IA avançada*`;
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
                  
                  {generatedReport && (
                    <ReportDisplay report={generatedReport} fileName={uploadedFile?.name} />
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
