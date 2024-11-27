import { Menu, Recycle, User } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Recycle className="h-8 w-8" />
            <span className="text-xl font-bold">EcoLink</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            aria-label="Menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-green-200 transition-colors">
              Início
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/agendamentos"
                  className="hover:text-green-200 transition-colors"
                >
                  Agendar Coleta
                </Link>
                <Link
                  to="/coletas"
                  className="hover:text-green-200 transition-colors"
                >
                  Minhas Coletas
                </Link>
                <Link
                  to="/pontos-coleta"
                  className="hover:text-green-200 transition-colors"
                >
                  Pontos de Coleta
                </Link>
                <Link
                  to="/pontos-descarte"
                  className="block hover:text-green-200 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pontos de Descarte
                </Link>
              </>
            )}
            <Link to="/login" className="hover:text-green-200 transition-colors">
              <User className="h-6 w-6" />
            </Link>
          </nav>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-3">
            <Link
              to="/"
              className="block hover:text-green-200 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/agendamentos"
                  className="block hover:text-green-200 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Agendar Coleta
                </Link>
                <Link
                  to="/coletas"
                  className="block hover:text-green-200 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Minhas Coletas
                </Link>
                <Link
                  to="/pontos-coleta"
                  className="block hover:text-green-200 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pontos de Coleta
                </Link>
                <Link
                  to="/pontos-descarte"
                  className="block hover:text-green-200 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pontos de Descarte
                </Link>
              </>
            )}
            <Link
              to="/perfil"
              className="block hover:text-green-200 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Perfil
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}