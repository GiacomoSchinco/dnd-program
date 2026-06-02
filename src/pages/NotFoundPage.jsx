import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="hero min-h-[60vh]">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <MapPin size={48} className="mx-auto mb-4 text-error" />
          <h1 className="text-5xl font-bold">404</h1>
          <p className="py-4 text-base-content/60">Questa pagina non esiste nella mappa del dungeon.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Torna alla Home
          </button>
        </div>
      </div>
    </div>
  );
}
