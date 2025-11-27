import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2.5 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white">RelatórioIA</h1>
              <p className="text-gray-400 text-sm">
                Transforme dados em decisões inteligentes
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
