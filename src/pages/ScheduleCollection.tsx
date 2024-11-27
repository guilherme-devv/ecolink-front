import { useState } from 'react';
import { Calendar, Clock, Plus } from 'lucide-react';
import { MaterialSelect } from '../components/MaterialSelect';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';


interface Material {
  id: string;
  type: string;
  quantity: number;
  unit: string;
}

export function ScheduleCollection() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [materials, setMaterials] = useState<Material[]>([
    { id: '1', type: '', quantity: 0, unit: 'kg' },
  ]);
  const [address, setAddress] = useState('');
  const navigate = useNavigate();


  const addMaterial = () => {
    setMaterials([
      ...materials,
      { id: Date.now().toString(), type: '', quantity: 0, unit: 'kg' },
    ]);
  };

  const updateMaterial = (id: string, updatedMaterial: Omit<Material, 'id'>) => {
    setMaterials(
      materials.map((material) =>
        material.id === id ? { ...updatedMaterial, id } : material
      )
    );
  };

  const removeMaterial = (id: string) => {
    if (materials.length > 1) {
      setMaterials(materials.filter((material) => material.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestData = {
      date: new Date(date).toISOString(),
      time,
      address,
      materials: materials.map((material) => ({
        tipo: material.type,
        amount: material.quantity.toString(),
        unit: material.unit,
      })),
      status: 'pending',
    };

    try {
      const response = await api.post('collections/', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Coleta agendada com sucesso:', response.data);
      alert('Coleta agendada com sucesso!');
      navigate('/');

    } catch (error: any) {
      console.error('Erro ao agendar coleta:', error.response || error.message);
      alert('Erro ao agendar coleta. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Agendar Coleta</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date and Time Selection */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data da Coleta
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horário
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Materials Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Materiais para Coleta</h2>
              <button
                type="button"
                onClick={addMaterial}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Adicionar Material
              </button>
            </div>
            <div className="space-y-4">
              {materials.map((material) => (
                <MaterialSelect
                  key={material.id}
                  material={material}
                  onUpdate={(updated) => updateMaterial(material.id, updated)}
                  onRemove={() => removeMaterial(material.id)}
                />
              ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço para Coleta
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Digite o endereço completo para coleta"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Agendar Coleta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}