
import React from 'react';
import { Material } from '../types';

interface StockTableProps {
  materials: Material[];
}

export const StockTable: React.FC<StockTableProps> = ({ materials }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-100">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
            <th className="px-6 py-4 font-semibold">Material</th>
            <th className="px-6 py-4 font-semibold">Categoria</th>
            <th className="px-6 py-4 font-semibold text-center">Quantidade</th>
            <th className="px-6 py-4 font-semibold text-center">Mínimo</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold">Valor Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {materials.map((item) => {
            const isLowStock = item.quantidade <= item.estoqueMinimo;
            const isCritical = item.quantidade <= item.estoqueMinimo * 0.5;
            
            return (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{item.nome}</td>
                <td className="px-6 py-4 text-slate-600">{item.categoria}</td>
                <td className="px-6 py-4 text-center text-slate-900">{item.quantidade} {item.unidade}</td>
                <td className="px-6 py-4 text-center text-slate-500">{item.estoqueMinimo}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    isCritical 
                      ? 'bg-rose-100 text-rose-700' 
                      : isLowStock 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {isCritical ? 'CRÍTICO' : isLowStock ? 'BAIXO' : 'OK'}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-900 font-semibold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantidade * item.precoUnitario)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
