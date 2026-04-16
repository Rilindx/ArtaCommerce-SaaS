const DataTable = ({ columns, rows, emptyText = 'No records found.' }) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-4 text-left font-semibold text-slate-600">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.length === 0 ? (
              <tr>
                <td className="px-5 py-6 text-slate-500" colSpan={columns.length}>
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-slate-50/80">
                  {columns.map((column) => (
                    <td key={column.key} className="px-5 py-4 text-slate-700">
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
