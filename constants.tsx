
import { Material, PedidoAtendimento } from './types';

export const MOCK_MATERIALS: Material[] = [
  { id: '1', nome: 'Papel A4 Office', categoria: 'Escritório', quantidade: 450, estoqueMinimo: 100, unidade: 'Resma', precoUnitario: 25.50, ultimaAtualizacao: '2023-10-25' },
  { id: '2', nome: 'Cartucho HP Black', categoria: 'Suprimentos', quantidade: 12, estoqueMinimo: 15, unidade: 'Unidade', precoUnitario: 120.00, ultimaAtualizacao: '2023-10-24' },
  { id: '3', nome: 'Cabo de Rede Cat6', categoria: 'TI', quantidade: 200, estoqueMinimo: 50, unidade: 'Metros', precoUnitario: 3.20, ultimaAtualizacao: '2023-10-20' },
  { id: '4', nome: 'Teclado Mecânico Pro', categoria: 'TI', quantidade: 5, estoqueMinimo: 10, unidade: 'Unidade', precoUnitario: 350.00, ultimaAtualizacao: '2023-10-22' },
  { id: '5', nome: 'Café Premium 500g', categoria: 'Copa', quantidade: 30, estoqueMinimo: 20, unidade: 'Pacote', precoUnitario: 18.90, ultimaAtualizacao: '2023-10-26' },
  { id: '6', nome: 'Água Mineral 500ml', categoria: 'Copa', quantidade: 120, estoqueMinimo: 48, unidade: 'Unidade', precoUnitario: 1.50, ultimaAtualizacao: '2023-10-26' },
];

export const MOCK_PEDIDOS: PedidoAtendimento[] = [
  { id: 'P001', data: '2023-10-01', status: 'atendido', itens: [{ materialId: '1', quantidade: 10 }], tempoRespostaHoras: 2 },
  { id: 'P002', data: '2023-10-05', status: 'pendente', itens: [{ materialId: '2', quantidade: 5 }], tempoRespostaHoras: 0 },
  { id: 'P003', data: '2023-10-10', status: 'atendido', itens: [{ materialId: '3', quantidade: 50 }], tempoRespostaHoras: 4 },
  { id: 'P004', data: '2023-10-15', status: 'parcial', itens: [{ materialId: '4', quantidade: 8 }], tempoRespostaHoras: 24 },
  { id: 'P005', data: '2023-10-20', status: 'atendido', itens: [{ materialId: '6', quantidade: 24 }], tempoRespostaHoras: 1 },
];
