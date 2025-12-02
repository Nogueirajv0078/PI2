import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight, TrendingUp, Users, DollarSign, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';

const examples = [
  {
    icon: TrendingUp,
    color: 'from-green-400 to-teal-500',
    title: 'Vendas Semanais',
    category: 'Comércio',
    stats: [
      { label: 'Receita', value: 'R$ 24.500', change: '+8%' },
      { label: 'Pedidos', value: '1.240', change: '+12%' },
      { label: 'Conversão', value: '4.2%', change: '+0.4%' },
    ],
    insights: [
      'Aumento de vendas em categorias sazonais.',
      'Campanhas de e-mail tiveram CTR acima da média.',
      'O ticket médio subiu 5% em clientes recorrentes.'
    ]
  },
  {
    icon: Users,
    color: 'from-indigo-500 to-purple-500',
    title: 'Engajamento de Usuários',
    category: 'Marketing',
    stats: [
      { label: 'Usuários Ativos', value: '8.3k', change: '+6%' },
      { label: 'Novos Cadastros', value: '420', change: '+3%' },
      { label: 'Retenção', value: '72%', change: '+1%' },
    ],
    insights: [
      'A retenção melhorou após onboarding otimizado.',
      'Conteúdo educativo aumentou o tempo médio na plataforma.'
    ]
  },
  {
    icon: ShoppingCart,
    color: 'from-yellow-400 to-orange-500',
    title: 'Performance do Produto',
    category: 'Operações',
    stats: [
      { label: 'Itens Vendidos', value: '3.1k', change: '+9%' },
      { label: 'Estoque', value: '560', change: '-4%' },
      { label: 'Devoluções', value: '1.2%', change: '-0.1%' },
    ],
    insights: [
      'Alguns SKUs precisam de reposição urgente.',
      'Promoções aumentaram rotatividade de estoque em 20%.'
    ]
  }
];

export function ExamplesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % examples.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const next = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % examples.length);
  };

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + examples.length) % examples.length);
  };

  const current = examples[currentIndex];
  const Icon = current.icon;

  return (
    <section className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-semibold text-gray-100">Exemplos de Relatórios Gerados</h2>
        <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Veja alguns dos relatórios que nossa IA pode gerar para você, adaptados para diferentes áreas do seu negócio.
        </p>
      </div>

      <div className="relative">
        <Card className="bg-gray-800/50 border-gray-700/60 p-6 md:p-8 rounded-2xl shadow-lg backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              <div className={`bg-gradient-to-br ${current.color} p-3 rounded-xl shadow-md`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-100 mb-1">{current.title}</h3>
                <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30 font-semibold">
                  {current.category}
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-2 self-start sm:self-center">
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                className="border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={next}
                className="border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {current.stats.map((stat, index) => (
              <div key={index} className="bg-gray-900/60 rounded-xl p-4 border border-gray-700/70">
                <p className="text-gray-300 text-sm mb-1">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-semibold text-gray-100">{stat.value}</p>
                  <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-100 mb-2">Principais Insights:</h4>
            {current.insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                <p className="leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Indicadores */}
        <div className="flex justify-center gap-2 mt-6">
          {examples.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-6 bg-purple-500' 
                  : 'w-2 bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
