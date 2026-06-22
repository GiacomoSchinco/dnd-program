import { useMemo, useState, useCallback, ChangeEvent, MouseEvent } from "react";
import { Eye, Pencil, Trash2, ScrollText } from 'lucide-react';

function toLabel(key: string) {
    return key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/_/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase());
}

interface ColumnDef<T> {
    key: string;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
    initialData: T[];
    columns?: ColumnDef<T>[];
    idKey?: keyof T;
    hiddenColumns?: string[];
    labels?: Record<string, string>;
    visibleColumns?: string[];
    onView?: (id: any, row: T) => void;
    onEdit?: (id: any, row: T) => void;
    onDelete?: (id: any, row: T) => void;
    onRowClick?: (id: any, row: T) => void;
    pagination?: boolean;
    customRenderers?: Record<string, (value: any, row: T) => React.ReactNode>;
    emptyMessage?: string;
    className?: string;
    itemsPerPage?: number;
}

export default function DataTable<T extends Record<string, any>>({
    initialData,
    columns: columnDefs,
    idKey = "id" as keyof T,
    hiddenColumns = [],
    labels: labelsRaw = {},
    visibleColumns: visibleColumnsRaw,
    onView,
    onEdit,
    onDelete,
    onRowClick,
    pagination = false,
    customRenderers: customRenderersRaw,
    emptyMessage = "Nessun record trovato",
    className = "",
    itemsPerPage = 10,
}: DataTableProps<T>) {
    // Risolve colonne da props
    const labels = columnDefs
        ? Object.fromEntries(columnDefs.map((c) => [c.key, c.label]))
        : labelsRaw;
    const visibleColumns = columnDefs ? columnDefs.map((c) => c.key) : visibleColumnsRaw;
    const customRenderers = columnDefs
        ? Object.fromEntries(columnDefs.filter((c) => c.render).map((c) => [c.key, c.render]))
        : customRenderersRaw;

    const data = useMemo(() => initialData ?? [], [initialData]);

    const keys = useMemo(() => {
        const first = data[0] ?? initialData[0] ?? {};
        return Object.keys(first);
    }, [data, initialData]);

    // Paginazione
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);
    const totalRows = data.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
    const currentPage = Math.min(page, totalPages);
    
    const paginatedData = useMemo(() => {
        if (!pagination) return data;
        const start = (currentPage - 1) * rowsPerPage;
        return data.slice(start, start + rowsPerPage);
    }, [data, currentPage, rowsPerPage, pagination]);

    const visibleKeys = useMemo(() => {
        const idStr = String(idKey);
        if (visibleColumns && visibleColumns.length) {
            return visibleColumns.filter((k) => {
                if (k === idStr) return false;
                if (hiddenColumns.includes(k)) return false;
                // Colonne virtuali (non nei dati) sono ammesse se hanno un customRenderer
                return true;
            });
        }
        return keys.filter((k) => k !== idStr && !hiddenColumns.includes(k));
    }, [keys, idKey, hiddenColumns, visibleColumns]);

    const renderCellForKey = useCallback((key: string, v: any, row: T) => {
        const renderer = customRenderers && customRenderers[key];
        if (renderer) return renderer(v, row);
        if (v === null || v === undefined) return <span className="text-base-content/40">—</span>;
        if (typeof v === "boolean") return v ? "✓" : "✗";
        return String(v);
    }, [customRenderers]);
    
    const columns = useMemo(() => {
        const baseCols = visibleKeys.map((key) => {
            const headerLabel = labels[key] ?? toLabel(key);

            if (key.includes('.')) {
                const path = key.split('.');
                const accessor = (row: T) => path.reduce((acc, p) => {
                    if (acc && typeof acc === 'object' && p in acc) {
                        return (acc as Record<string, any>)[p];
                    }
                    return undefined;
                }, row);

                return {
                    id: key,
                    header: headerLabel,
                    cell: (row: T) => renderCellForKey(key, accessor(row), row),
                };
            }

            return {
                id: key,
                header: headerLabel,
                // Se la chiave non esiste nel record (colonna virtuale come 'actions'),
                // passa undefined al renderer — il customRenderer gestirà il rendering
                cell: (row: T) => renderCellForKey(key, row[key as keyof T], row),
            };
        });

        if (onView || onEdit || onDelete) {
            baseCols.push({
                id: "actions",
                header: "Azioni",
                cell: (row: T) => (
                    <div className="flex gap-1">
                        {onView && (
                            <button
                                className="btn btn-xs btn-info btn-square"
                                onClick={(e: MouseEvent<HTMLButtonElement>) => { 
                                    e.stopPropagation(); 
                                    onView(row[idKey], row); 
                                }}
                                title="Dettagli"
                            >
                                <Eye size={14} />
                            </button>
                        )}
                        {onEdit && (
                            <button
                                className="btn btn-xs btn-primary btn-square"
                                onClick={(e: MouseEvent<HTMLButtonElement>) => { 
                                    e.stopPropagation(); 
                                    onEdit(row[idKey], row); 
                                }}
                                title="Modifica"
                            >
                                <Pencil size={14} />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                className="btn btn-xs btn-error btn-square"
                                onClick={(e: MouseEvent<HTMLButtonElement>) => { 
                                    e.stopPropagation(); 
                                    onDelete(row[idKey], row); 
                                }}
                                title="Elimina"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                ),
            });
        }

        return baseCols;
    }, [visibleKeys, labels, idKey, onEdit, onDelete, renderCellForKey]);

    return (
        <div className={`w-full ${className}`}>
            {/* Tabella */}
            <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
                <table className="table table-zebra">
                    <thead>
                        <tr className="border-b border-base-300 bg-base-300">
                            {columns.map((col) => (
                                <th key={col.id} className="px-4 py-3">
                                    <span className="font-semibold text-base-content text-sm uppercase tracking-wider">
                                        {col.header}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-4">
                                        <ScrollText size={48} className="opacity-30" />
                                        <p className="text-base-content/70 text-lg">{emptyMessage}</p>
                                        <p className="text-base-content/40 text-sm italic">Nessun dato disponibile...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, index) => (
                                <tr
                                    key={String(row[idKey] ?? index)}
                                    onClick={() => onRowClick && onRowClick(row[idKey], row)}
                                    className={`
                                        transition-all duration-200
                                        ${onRowClick ? 'cursor-pointer hover:bg-base-200' : ''}
                                    `}
                                >
                                    {columns.map((col) => (
                                        <td key={col.id} className="px-4 py-3">
                                            <div className="text-base-content">
                                                {col.cell(row)}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginazione */}
            {pagination && totalPages > 1 && (
                <div className="mt-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-base-content/70 flex items-center gap-1">
                                Righe:
                            </span>
                            <select
                                className="select select-bordered select-sm"
                                value={rowsPerPage}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => { 
                                    setRowsPerPage(Number(e.target.value)); 
                                    setPage(1); 
                                }}
                            >
                                {[5, 10, 20, 50].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                className="btn btn-sm btn-outline"
                                disabled={currentPage === 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                <span>←</span>
                                Prec
                            </button>
                            
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-base-content/70">Pag.</span>
                                <span className="px-3 py-1 bg-base-200 rounded-lg text-base-content font-bold min-w-[60px] text-center">
                                    {currentPage}
                                </span>
                                <span className="text-sm text-base-content/70">di {totalPages}</span>
                            </div>
                            
                            <button
                                className="btn btn-sm btn-outline"
                                disabled={currentPage === totalPages}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            >
                                Succ
                                <span>→</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-3 text-center">
                        <p className="text-xs text-base-content/50 flex items-center justify-center gap-2">
                            Mostrati {((currentPage - 1) * rowsPerPage) + 1} - {Math.min(currentPage * rowsPerPage, totalRows)} di {totalRows} elementi
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}