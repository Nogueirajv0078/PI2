import { Sparkles, TrendingUp, FileBarChart } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 blur-3xl opacity-50"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-20 max-w-7xl relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-semibold text-sm">Powered by Advanced AI</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-semibold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent mb-6 leading-tight">
            Relatórios Inteligentes em Segundos
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl mb-10 leading-relaxed">
            Carregue seus dados e deixe nossa IA gerar relatórios completos com insights,
            análises preditivas e dashboards interativos automaticamente.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 border border-gray-700/60 rounded-2xl p-6 backdrop-blur-sm shadow-lg">
              <div className="bg-purple-600/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <FileBarChart className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Relatórios Automáticos</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Análises completas com insights acionáveis gerados por IA.
              </p>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700/60 rounded-2xl p-6 backdrop-blur-sm shadow-lg">
              <div className="bg-pink-600/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Dashboards Visuais</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Gráficos e visualizações interativas dos seus dados.
              </p>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700/60 rounded-2xl p-6 backdrop-blur-sm shadow-lg">
              <div className="bg-blue-600/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Análise Preditiva</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Projeções e tendências baseadas em machine learning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
