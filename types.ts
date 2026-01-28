
export interface Material {
  id: string;
  nome: string;
  categoria: string;
  quantidade: number;
  estoqueMinimo: number;
  unidade: string;
  precoUnitario: number;
  ultimaAtualizacao: string;
}

export interface PedidoAtendimento {
  id: string;
  data: string;
  status: 'atendido' | 'pendente' | 'parcial';
  itens: { materialId: string; quantidade: number }[];
  tempoRespostaHoras: number;
}

export interface Indicadores {
  nivelServico: number; // Porcentagem de pedidos atendidos totalmente
  giroEstoque: number;
  rupturaEstoque: number; // Itens com estoque zero ou abaixo do mínimo
  valorTotalEstoque: number;
}
