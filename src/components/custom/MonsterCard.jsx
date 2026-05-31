export function MonsterCard({ monster, onEdit, onDelete }) {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      <div className="card-body p-4">
        <div className="flex justify-between items-start">
          <h3 className="card-title text-lg">{monster.name}</h3>
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-xs">⋮</button>
            <ul tabIndex={0} className="dropdown-content menu z-50 p-2 shadow bg-base-200 rounded-box w-32">
              <li><button onClick={onEdit}>✏️ Modifica</button></li>
              <li><button onClick={onDelete}>🗑️ Elimina</button></li>
            </ul>
          </div>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="opacity-70">HP:</span>
            <span className="font-semibold">{monster.hp}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">CA:</span>
            <span className="font-semibold">{monster.ac}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">Danno:</span>
            <span className="font-semibold">{monster.damage}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">CR:</span>
            <span className="badge badge-xs badge-primary">{monster.cr}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
