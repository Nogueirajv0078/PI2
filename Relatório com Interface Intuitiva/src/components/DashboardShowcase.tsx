import { Card } from './ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Activity, PieChart as PieChartIcon, BarChart as BarChartIcon } from 'lucide-react';

const salesData = [
  { month: 'Jan', vendas: 65, meta: 60 },
  { month: 'Fev', vendas: 78, meta: 65 },
  { month: 'Mar', vendas: 90, meta: 70 },
  { month: 'Abr', vendas: 81, meta: 75 },
  { month: 'Mai', vendas: 95, meta: 80 },
  { month: 'Jun', vendas: 105, meta: 85 }
];

const categoryData = [
  { name: 'Eletrônicos', value: 35, color: '#8b5cf6' },
  { name: 'Moda', value: 25, color: '#ec4899' },
  { name: 'Casa', value: 20, color: '#06b6d4' },
  { name: 'Esportes', value: 15, color: '#10b981' },
  { name: 'Outros', value: 5, color: '#f59e0b' }
];

const performanceData = [
  { day: 'Seg', conversao: 4.2 },
  { day: 'Ter', conversao: 3.8 },
  { day: 'Qua', conversao: 4.5 },
  { day: 'Qui', conversao: 5.1 },
  { day: 'Sex', conversao: 4.8 },
  { day: 'Sáb', conversao: 3.2 },
  { day: 'Dom', conversao: 2.9 }
];

export function DashboardShowcase() {
  return (
    <section className="space-y-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-semibold text-gray-100">Dashboards Gerados Automaticamente</h2>
        <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Visualizações interativas e inteligentes criadas a partir dos seus dados para insights rápidos e claros.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Barras */}
        <Card className="bg-gray-800/50 border-gray-700/60 p-6 rounded-2xl shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-600/10 p-2 rounded-lg">
              <BarChartIcon className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-gray-100 font-semibold">Vendas vs Meta</h3>
              <p className="text-gray-300 text-sm">Desempenho mensal comparativo</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #4b5563',
                  borderRadius: '0.75rem',
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Bar dataKey="vendas" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="meta" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Gráfico de Pizza */}
        <Card className="bg-gray-800/50 border-gray-700/60 p-6 rounded-2xl shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-pink-600/10 p-2 rounded-lg">
              <PieChartIcon className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h3 className="text-gray-100 font-semibold">Vendas por Categoria</h3>
              <p className="text-gray-300 text-sm">Distribuição percentual</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                stroke="#1f2937"
              >
                {categoryData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #4b5563',
                  borderRadius: '0.75rem',
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '14px' }}/>
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Gráfico de Linha */}
        <Card className="bg-gray-800/50 border-gray-700/60 p-6 rounded-2xl shadow-lg backdrop-blur-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600/10 p-2 rounded-lg">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-gray-100 font-semibold">Taxa de Conversão Semanal</h3>
              <p className="text-gray-300 text-sm">Tendência de performance por dia</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #4b5563',
                  borderRadius: '0.75rem',
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Line 
                type="monotone" 
                dataKey="conversao" 
                stroke="#38bdf8" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="bg-gray-800/50 border border-purple-500/20 rounded-2xl p-8 text-center shadow-lg">
        <TrendingUp className="w-10 h-10 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-100 mb-2">E muito mais!</h3>
        <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Nossa IA identifica automaticamente os melhores tipos de visualizações para seus dados,
          criando dashboards personalizados com gráficos de área, scatter plots, heatmaps e muito mais.
        </p>
      </div>
    </section>
  );
}
