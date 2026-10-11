import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

const DataTable = ({
  columns = [],
  data = [],
  searchPlaceholder = 'Search records...',
  searchKey,
  emptyMessage = 'No records found in database',
  actions,
  pageSize = 10,
  hideDefaultSearch = false
}) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data
  const filteredData = data.filter((item) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    if (searchKey && item[searchKey]) {
      return String(item[searchKey]).toLowerCase().includes(query);
    }
    return Object.values(item).some((val) =>
      val !== null && val !== undefined && String(val).toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="rounded-2xl border border-pink-200/60 bg-white/80 backdrop-blur-md shadow-[0_8px_30px_-6px_rgba(236,72,153,0.08)] overflow-hidden">
      {/* Search & Actions Bar (if not hidden) */}
      {!hideDefaultSearch && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-pink-100 bg-[#fdf8fa]/80">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-white border border-pink-200/70 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-400/20 transition-all shadow-xs"
            />
          </div>
          {actions && <div className="flex items-center gap-2 w-full sm:w-auto justify-end">{actions}</div>}
        </div>
      )}

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-[#faf1f5] text-[11px] uppercase text-slate-600 font-extrabold border-b border-pink-200/60 tracking-wider">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`px-5 py-4 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-100/70">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-pink-50/40 transition-colors group"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`px-5 py-4 text-xs ${col.className || ''}`}>
                      {col.render ? col.render(row) : (row[col.accessor] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-14 text-center text-slate-400">
                  <Inbox className="w-10 h-10 mx-auto mb-2 text-pink-300 opacity-80" />
                  <p className="text-sm font-semibold text-slate-600">{emptyMessage}</p>
                  <p className="text-xs text-slate-400 mt-1">Real-time data fetched from MySQL database</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer Matching Reference */}
      <div className="flex items-center justify-between px-5 py-3.5 border-t border-pink-100 bg-[#fdf8fa]/70 text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-800">{filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{' '}
          <span className="font-semibold text-slate-800">
            {Math.min(currentPage * pageSize, filteredData.length)}
          </span>{' '}
          of <span className="font-semibold text-slate-800">{filteredData.length}</span> entries
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-lg border border-pink-200/80 bg-white text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-pink-50 hover:text-pink-600 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentPage === page
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-sm shadow-pink-500/30'
                  : 'bg-white border border-pink-200/80 text-slate-600 hover:bg-pink-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || filteredData.length === 0}
            className="w-8 h-8 rounded-lg border border-pink-200/80 bg-white text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-pink-50 hover:text-pink-600 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;