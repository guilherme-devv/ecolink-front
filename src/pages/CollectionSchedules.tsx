import { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CollectionSchedule {
  id: string;
  date: Date;
  time: string;
  address: string;
  materials: {
    type: string;
    quantity: number;
    unit: string;
  }[];
  status: 'pending' | 'collected';
  requesterName: string;
  requesterPhone: string;
}

export function CollectionSchedules() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'collected'>('pending');
  const [schedules, setSchedules] = useState<CollectionSchedule[]>([
    {
      id: '1',
      date: new Date(),
      time: '09:00',
      address: 'Rua das Flores, 123 - Centro',
      materials: [
        { type: 'Papel', quantity: 10, unit: 'kg' },
        { type: 'Plástico', quantity: 5, unit: 'kg' },
      ],
      status: 'pending',
      requesterName: 'João Silva',
      requesterPhone: '(11) 98765-4321',
    },
    {
      id: '2',
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: '14:30',
      address: 'Av. Principal, 456 - Jardim América',
      materials: [
        { type: 'Metal', quantity: 15, unit: 'kg' },
        { type: 'Vidro', quantity: 8, unit: 'kg' },
      ],
      status: 'pending',
      requesterName: 'Maria Santos',
      requesterPhone: '(11) 91234-5678',
    },
  ]);

  const handleMarkAsCollected = (scheduleId: string) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === scheduleId
          ? { ...schedule, status: 'collected' }
          : schedule
      )
    );
  };

  const filteredSchedules = schedules.filter((schedule) => {
    if (filter === 'all') return true;
    return schedule.status === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Agendamentos de Coleta</h1>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as 'all' | 'pending' | 'collected')
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="pending">Pendentes</option>
              <option value="collected">Coletados</option>
              <option value="all">Todos</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(schedule.date, "dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })}
                    </span>
                    <Clock className="w-4 h-4 ml-4" />
                    <span>{schedule.time}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 mt-1" />
                    <span>{schedule.address}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      schedule.status === 'collected'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {schedule.status === 'collected' ? 'Coletado' : 'Pendente'}
                  </span>
                </div>
              </div>

              <div className="border-t border-b py-4 my-4">
                <h3 className="font-semibold mb-3">Materiais para coleta:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {schedule.materials.map((material, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-3 text-sm"
                    >
                      <span className="font-medium">{material.type}</span>
                      <p className="text-gray-600">
                        {material.quantity} {material.unit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <p className="font-medium">{schedule.requesterName}</p>
                  <p className="text-gray-600">{schedule.requesterPhone}</p>
                </div>
                {schedule.status === 'pending' && (
                  <button
                    onClick={() => handleMarkAsCollected(schedule.id)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Marcar como Coletado
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredSchedules.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600">
                {filter === 'pending'
                  ? 'Não há coletas pendentes no momento.'
                  : filter === 'collected'
                  ? 'Não há coletas realizadas no histórico.'
                  : 'Não há agendamentos de coleta.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}