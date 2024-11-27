import { Trash2 } from 'lucide-react';

interface Material {
  type: string;
  quantity: number;
  unit: string;
}

interface MaterialSelectProps {
  material: Material;
  onUpdate: (material: Material) => void;
  onRemove: () => void;
}

export function MaterialSelect({ material, onUpdate, onRemove }: MaterialSelectProps) {
  const materialTypes = [
    'Papel',
    'Papelão',
    'Plástico',
    'Metal',
    'Vidro',
    'Eletrônicos',
    'Óleo',
  ];

  return (
    <div className="flex gap-4 items-start p-4 bg-white rounded-lg shadow-sm">
      <div className="flex-1">
        <select
          value={material.type}
          onChange={(e) => onUpdate({ ...material, type: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Selecione o material</option>
          {materialTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <input
          type="number"
          value={material.quantity}
          onChange={(e) =>
            onUpdate({ ...material, quantity: parseInt(e.target.value) || 0 })
          }
          min="0"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Quantidade"
        />
      </div>
      <div className="flex-1">
        <select
          value={material.unit}
          onChange={(e) => onUpdate({ ...material, unit: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="kg">Quilos (kg)</option>
          <option value="l">Litros (l)</option>
          <option value="un">Unidades</option>
        </select>
      </div>
      <button
        onClick={onRemove}
        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
        aria-label="Remover material"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}