import { Calendar, MapPin, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Conectando Recicladores e Geradores de Resíduos
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Otimize suas coletas, aumente sua renda e contribua para um mundo mais sustentável
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/agendamentos"
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Agendar Coleta
            </Link>
            <Link
              to="/pontos-coleta"
              className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
            >
              Encontrar Pontos de Coleta
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Como funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-2">Agendamento Fácil</h3>
              <p className="text-gray-600">
                Agende suas coletas de forma simples e rápida, informando tipo e quantidade de material
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <Truck className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-2">Otimização de Rotas</h3>
              <p className="text-gray-600">
                Encontre as melhores rotas para suas coletas e aumente sua eficiência
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-2">Pontos de Entrega</h3>
              <p className="text-gray-600">
                Localize os pontos de entrega mais próximos usando geolocalização
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Comece a Reciclar Hoje</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Junte-se à nossa comunidade e faça parte da mudança por um futuro mais sustentável
          </p>
          <Link
            to="/cadastro"
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-block"
          >
            Cadastre-se Gratuitamente
          </Link>
        </div>
      </section>
    </div>
  );
}