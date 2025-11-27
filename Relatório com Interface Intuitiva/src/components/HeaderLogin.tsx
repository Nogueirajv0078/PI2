import { Sparkles } from "lucide-react";

export function HeaderLogin() {
  return (
    <header className="w-full flex items-center justify-center py-6">
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-xl shadow-lg">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            RelatórioIA
          </h1>
          <p className="text-gray-400 text-sm">
            Gere relatórios inteligentes com IA
          </p>
        </div>
      </div>
    </header>
  );
}
