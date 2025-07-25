import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/gerar', label: 'Gerar Paleta' },
  { to: '/paletas', label: 'Minhas Paletas' },
  { to: '/contraste', label: 'Checagem de Contraste' },
];

export function Header() {
  const location = useLocation();
  return (
    <header className="fixed top-0 left-0 w-full z-30 bg-white/80 backdrop-blur shadow-md">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/gerar" className="flex items-center gap-2 select-none">
          <span className="text-2xl font-extrabold text-purple-600 tracking-tight">
            Vibe
          </span>
          <span className="text-2xl font-extrabold text-gray-800 tracking-tight">
            Color
          </span>
        </Link>
        <ul className="flex gap-2 md:gap-6">
          {navLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${location.pathname.startsWith(link.to) ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
