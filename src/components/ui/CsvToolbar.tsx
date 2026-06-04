import { useRef, ChangeEvent } from 'react';
import { Download, Upload } from 'lucide-react';
import { parseCSV } from '../../utils/csvIO';

/**
 * Reusable CSV import/export toolbar.
 *
 * Props:
 *  - onExport: () => void  — triggers the download
 *  - onImport: (rows: object[]) => void  — called with parsed CSV rows
 */
interface CsvToolbarProps {
  onExport: () => void;
  onImport: (rows: Record<string, string>[]) => void;
}

export function CsvToolbar({ onExport, onImport }: CsvToolbarProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      const rows = parseCSV(result);
      onImport(rows);
    };
    reader.readAsText(file, 'utf-8');
    // Reset so the same file can be re-imported
    e.target.value = '';
  };

  return (
    <div className="flex gap-2">
      <button className="btn btn-outline btn-sm gap-1" onClick={onExport} title="Scarica CSV">
        <Download size={14} /> Esporta CSV
      </button>
      <button
        className="btn btn-outline btn-sm gap-1"
        onClick={() => fileRef.current?.click()}
        title="Importa da file CSV"
      >
        <Upload size={14} /> Importa CSV
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
