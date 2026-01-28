
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardCheck, 
  AlertTriangle, 
  TrendingUp, 
  BrainCircuit, 
  Search,
  Bell,
  Menu,
  ChevronRight,
  RefreshCcw,
  FileText
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { MOCK_MATERIALS, MOCK_PEDIDOS } from './constants';
import { Material, PedidoAtendimento, Indicadores } from './types';
import { DashboardCard } from './components/DashboardCard';
import { StockTable } from './components/StockTable';
import { analyzeStock } from './services/geminiService';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1'];

const App: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>(MOCK_MATERIALS);
  const [pedidos, setPedidos] = useState<PedidoAtendimento[]>(MOCK_PEDIDOS);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'estoque' | 'atendimento'>('dashboard');

  // Calcular Indicadores
  const indicators = useMemo((): Indicadores => {
    const totalPedidos = pedidos.length;
    const atendidos = pedidos.filter(p => p.status === 'atendido').length;
    const nivelServico = (atendidos / totalPedidos) * 100;
    
    const valorTotal = materials.reduce((acc, curr) => acc + (curr.quantidade * curr.precoUnitario), 0);
    const ruptura = materials.filter(m => m.quantidade <= m.estoqueMinimo).length;
    
    return {
      nivelServico,
      giroEstoque: 4.2, // Mock valor
      rupturaEstoque: ruptura,
      valorTotalEstoque: valorTotal
    };
  }, [materials, pedidos]);

  // Dados para Gráficos
  const chartDataStatus = [
    { name: 'OK', value: materials.filter(m => m.quantidade > m.estoqueMinimo).length },
    { name: 'Baixo', value: materials.filter(m => m.quantidade <= m.estoqueMinimo && m.quantidade > 0).length },
    { name: 'Zerado', value: materials.filter(m => m.quantidade === 0).length },
  ];

  const chartDataCategorias = useMemo(() => {
    const categories: Record<string, number> = {};
    materials.forEach(m => {
      categories[m.categoria] = (categories[m.categoria] || 0) + (m.quantidade * m.precoUnitario);
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [materials]);

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeStock(materials, pedidos);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 p-6 border-r border-slate-800">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Package className="text-white w-5 h-5" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight italic">GestorPro</span>
        </div>

        <nav className="flex-1 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium text-sm">Painel Geral</span>
          </button>
          <button 
            onClick={() => setActiveTab('estoque')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'estoque' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Package size={20} />
            <span className="font-medium text-sm">Gestão de Estoque</span>
          </button>
          <button 
            onClick={() => setActiveTab('atendimento')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'atendimento' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <ClipboardCheck size={20} />
            <span className="font-medium text-sm">Atendimento</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="bg-slate-800/50 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2 text-indigo-400">
              <BrainCircuit size={16} />
              <span className="text-xs font-bold uppercase">Análise Inteligente</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
              Utilize o poder do Gemini para otimizar sua reposição de materiais.
            </p>
            <button 
              onClick={handleRunAiAnalysis}
              disabled={isAnalyzing}
              className="w-full bg-indigo-600 text-white text-xs py-2 rounded-lg hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
            >
              {isAnalyzing ? <RefreshCcw className="animate-spin" size={14} /> : 'Gerar Relatório AI'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-100 px-4 py-3 md:px-8 flex justify-between items-center shadow-sm">
          <div className="md:hidden">
            <Menu size={24} />
          </div>
          <div className="flex items-center gap-2 text-slate-400 bg-slate-100 rounded-lg px-3 py-1.5 w-full max-w-md ml-4 md:ml-0">
            <Search size={18} />
            <input type="text" placeholder="Pesquisar materiais, pedidos..." className="bg-transparent border-none outline-none text-sm w-full text-slate-600 placeholder:text-slate-400" />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
              <img src="https://picsum.photos/seed/user/100/100" alt="User" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-8 space-y-8 max-w-[1400px] mx-auto w-full">
          {/* AI Analysis Result (Banner) */}
          {aiAnalysis && (
            <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <BrainCircuit size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <BrainCircuit size={24} className="text-indigo-200" />
                  <h3 className="text-xl font-bold tracking-tight">Relatório de Inteligência Gemini</h3>
                </div>
                <div className="prose prose-invert max-w-none text-indigo-50 line-clamp-4 md:line-clamp-none whitespace-pre-line">
                  {aiAnalysis}
                </div>
                <button 
                  onClick={() => setAiAnalysis(null)} 
                  className="mt-6 text-sm font-semibold bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
                >
                  Fechar Análise
                </button>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <>
              {/* KPIs Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <DashboardCard 
                  title="Valor Total em Estoque" 
                  value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(indicators.valorTotalEstoque)} 
                  icon={<Package size={24} />}
                  trend="4.3% vs mês anterior"
                  trendUp={true}
                />
                <DashboardCard 
                  title="Nível de Serviço" 
                  value={`${indicators.nivelServico.toFixed(1)}%`} 
                  icon={<ClipboardCheck size={24} />}
                  trend="2.1% melhora"
                  trendUp={true}
                />
                <DashboardCard 
                  title="Itens em Ruptura" 
                  value={indicators.rupturaEstoque} 
                  icon={<AlertTriangle size={24} />}
                  trend="Novos itens detectados"
                  trendUp={false}
                />
                <DashboardCard 
                  title="Giro de Estoque" 
                  value={indicators.giroEstoque} 
                  icon={<TrendingUp size={24} />}
                  trend="Meta: 5.0"
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-[400px]">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <TrendingUp size={18} className="text-indigo-600" />
                    Valor por Categoria
                  </h3>
                  <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={chartDataCategorias}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        itemStyle={{color: '#6366f1'}}
                      />
                      <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-[400px]">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Bell size={18} className="text-amber-500" />
                    Status do Inventário
                  </h3>
                  <ResponsiveContainer width="100%" height="85%">
                    <PieChart>
                      <Pie
                        data={chartDataStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartDataStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-sm font-bold text-slate-400">
                        {materials.length} itens
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-2">
                    {chartDataStatus.map((s, i) => (
                      <div key={s.name} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[i]}}></span>
                        <span className="text-xs text-slate-500">{s.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Alerts / Short List */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800">Materiais com Estoque Baixo</h3>
                  <button onClick={() => setActiveTab('estoque')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    Ver Todos <ChevronRight size={16} />
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {materials.filter(m => m.quantidade <= m.estoqueMinimo).slice(0, 5).map(item => (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
                          <AlertTriangle size={20} />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{item.nome}</div>
                          <div className="text-xs text-slate-500">{item.categoria}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-rose-600">{item.quantidade} em estoque</div>
                        <div className="text-xs text-slate-400">Mínimo: {item.estoqueMinimo}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'estoque' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Controle de Materiais</h2>
                  <p className="text-slate-500">Gerencie saldos, entradas e saídas de itens.</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50">
                    <FileText size={18} /> Exportar
                  </button>
                  <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
                    + Novo Material
                  </button>
                </div>
              </div>
              <StockTable materials={materials} />
            </div>
          )}

          {activeTab === 'atendimento' && (
            <div className="space-y-6">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Indicadores de Atendimento</h2>
                  <p className="text-slate-500">Acompanhe a eficiência do setor na entrega de materiais.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                   <div className="w-24 h-24 rounded-full border-8 border-indigo-100 border-t-indigo-600 flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-slate-900">{indicators.nivelServico.toFixed(0)}%</span>
                   </div>
                   <h4 className="font-bold text-slate-800">Fill Rate</h4>
                   <p className="text-sm text-slate-500">Pedidos atendidos totalmente</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm md:col-span-2">
                   <h4 className="font-bold text-slate-800 mb-4">Lead Time de Atendimento (H)</h4>
                   <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={pedidos}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="data" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                        <Tooltip />
                        <Line type="monotone" dataKey="tempoRespostaHoras" stroke="#6366f1" strokeWidth={3} dot={{fill: '#6366f1', strokeWidth: 2}} />
                      </LineChart>
                   </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">ID Pedido</th>
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Tempo Resposta</th>
                      <th className="px-6 py-4">Itens</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {pedidos.map(p => (
                      <tr key={p.id}>
                        <td className="px-6 py-4 font-semibold text-slate-900">{p.id}</td>
                        <td className="px-6 py-4 text-slate-500">{p.data}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            p.status === 'atendido' ? 'bg-emerald-100 text-emerald-700' : 
                            p.status === 'pendente' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{p.tempoRespostaHoras}h</td>
                        <td className="px-6 py-4 text-slate-500">{p.itens.length} tipo(s)</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
