const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/kavi priya/Downloads/smart-port-management/smart-port-management/frontend/src/pages/';

// 1. Fix JournalsPage.jsx
let jFilePath = path.join(dir, 'JournalsPage.jsx');
let jContent = fs.readFileSync(jFilePath, 'utf8');

if (!jContent.includes("header: 'Actions'")) {
    const columnAdd = ",\n    {\n      header: 'Actions',\n      accessor: 'actions',\n      render: (row) => (\n        <button\n          onClick={() => handleDelete(row.journalId)}\n          className=\"p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer\"\n          title=\"Delete\"\n        >\n          <Trash2 className=\"w-4 h-4\" />\n        </button>\n      )\n    }";
    const endRegex = /(const\s+journalColumns\s*=\s*\[[\s\S]*?)(\s*\}\s*\];)/;
    if (endRegex.test(jContent)) {
        jContent = jContent.replace(endRegex, '$1' + columnAdd + '$2');
        fs.writeFileSync(jFilePath, jContent, 'utf8');
        console.log('Fixed JournalsPage.jsx');
    }
}

// 2. Fix InvoicesPage.jsx
let iFilePath = path.join(dir, 'InvoicesPage.jsx');
let iContent = fs.readFileSync(iFilePath, 'utf8');

if (!iContent.includes('Trash2')) {
    iContent = iContent.replace(/(import\s+\{.*?)(\}\s+from\s+['"]lucide-react['"])/, '$1, Trash2 $2');
}

if (!iContent.includes('const handleDelete')) {
    const fnCode = "\n  const handleDelete = async (id) => {\n" +
    "    if (!window.confirm('Are you sure you want to delete this record?')) return;\n" +
    "    try {\n" +
    "      await apiService.deleteInvoice(id);\n" +
    "      loadData();\n" +
    "      setAlert({ type: 'success', message: 'Record deleted successfully.' });\n" +
    "    } catch (err) {\n" +
    "      console.error('Delete failed', err);\n" +
    "      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to delete record.' });\n" +
    "    }\n" +
    "  };\n\n";

    const effRegex = /useEffect\(\(\) => \{[\s\S]*?\}, \[.*?\]\);/;
    if (effRegex.test(iContent)) {
      iContent = iContent.replace(effRegex, match => match + fnCode);
    }
}

if (!iContent.includes('onClick={() => handleDelete(inv.invoiceId)}')) {
    const deleteBtn = "\n                      <button\n                        onClick={() => handleDelete(inv.invoiceId)}\n                        className=\"p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer ml-1\"\n                        title=\"Delete\"\n                      >\n                        <Trash2 className=\"w-4 h-4\" />\n                      </button>\n";
    // Find the MoreVertical button and insert after it
    iContent = iContent.replace(/(<MoreVertical className="w-4 h-4" \/>\s*<\/button>)/, "$1" + deleteBtn);
    fs.writeFileSync(iFilePath, iContent, 'utf8');
    console.log('Fixed InvoicesPage.jsx');
}
