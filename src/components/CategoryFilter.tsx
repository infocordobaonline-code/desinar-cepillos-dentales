import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Smile, Leaf, HeartHandshake, Film, Layers } from 'lucide-react';

export const CategoryFilter: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory } = useStore();

  // Extract distinct categories
  const categories = [
    { id: 'Todos', label: 'Todos los Productos', icon: Layers },
    { id: 'Adulto', label: 'Línea Adultos', icon: Sparkles },
    { id: 'Infantil', label: 'Línea Infantiles', icon: Smile },
    { id: 'Sustentable / Bambú', label: 'Bambú y Sustentable', icon: Leaf },
    { id: 'Ecológico / Reciclado', label: 'Plástico Reciclado', icon: HeartHandshake },
    { id: 'Licencias', label: 'Disney & Pixar', icon: Film },
  ];

  // Count items per category
  const getCount = (catId: string) => {
    if (catId === 'Todos') return products.filter(p => p.isActive).length;
    if (catId === 'Licencias') {
      return products.filter(
        p => p.isActive && (p.category.includes('Licencias') || p.line.includes('Disney') || p.line.includes('Pixar'))
      ).length;
    }
    return products.filter(p => p.isActive && p.category.toLowerCase().includes(catId.toLowerCase())).length;
  };

  return (
    <div className="bg-white border-b border-slate-200 shadow-xs py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count = getCount(cat.id);

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#183054] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
