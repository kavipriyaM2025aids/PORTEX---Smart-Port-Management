const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/kavi priya/Downloads/smart-port-management/smart-port-management/frontend/src/pages/';

const pageConfigs = [
  { file: 'AccountsPage.jsx', apiMethod: 'deleteAccount', idField: 'accountId', loadMethod: 'loadAccounts' },
  { file: 'AnalyticAccountsPage.jsx', apiMethod: 'deleteAnalyticAccount', idField: 'analyticAccountId', loadMethod: 'loadData' },
  { file: 'BudgetsPage.jsx', apiMethod: 'deleteBudget', idField: 'budgetId', loadMethod: 'loadData' },
  { file: 'ContactsPage.jsx', apiMethod: 'deleteContact', idField: 'contactId', loadMethod: 'loadContacts' },
  { file: 'ContainersPage.jsx', apiMethod: 'deleteContainer', idField: 'containerId', loadMethod: 'loadData' },
  { file: 'GateEntryPage.jsx', apiMethod: 'deleteGateEntry', idField: 'gateEntryId', loadMethod: 'loadData' },
  { file: 'GatesPage.jsx', apiMethod: 'deleteGate', idField: 'gateId', loadMethod: 'loadGates' },
  { file: 'JournalsPage.jsx', apiMethod: 'deleteJournal', idField: 'journalId', loadMethod: 'loadData' },
  { file: 'PaymentsPage.jsx', apiMethod: 'deletePayment', idField: 'paymentId', loadMethod: 'loadData' },
  { file: 'ProductsPage.jsx', apiMethod: 'deleteProduct', idField: 'productId', loadMethod: 'loadProducts' },
  { file: 'PurchaseOrdersPage.jsx', apiMethod: 'deletePurchaseOrder', idField: 'poId', loadMethod: 'loadData' },
  { file: 'SalesOrdersPage.jsx', apiMethod: 'deleteSalesOrder', idField: 'salesOrderId', loadMethod: 'loadData' },
  { file: 'VendorBillsPage.jsx', apiMethod: 'deleteVendorBill', idField: 'billId', loadMethod: 'loadData' },
  { file: 'VendorPaymentsPage.jsx', apiMethod: 'deleteVendorPayment', idField: 'paymentId', loadMethod: 'loadData' },
  { file: 'WeighbridgePage.jsx', apiMethod: 'deleteWeighbridgeReading', idField: 'readingId', loadMethod: 'loadData' }
];

for (const cfg of pageConfigs) {
  const filePath = path.join(dir, cfg.file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add Trash2 to lucide-react imports if not there
  if (!content.includes('Trash2')) {
    content = content.replace(/(import\s+\{.*?)(\}\s+from\s+['"]lucide-react['"])/, '$1, Trash2 $2');
  }

  // 2. Add handleDelete function
  if (!content.includes('const handleDelete')) {
    const fnCode = "\n  const handleDelete = async (id) => {\n" +
    "    if (!window.confirm('Are you sure you want to delete this record?')) return;\n" +
    "    try {\n" +
    "      await apiService." + cfg.apiMethod + "(id);\n" +
    "      " + cfg.loadMethod + "();\n" +
    "      setAlert({ type: 'success', message: 'Record deleted successfully.' });\n" +
    "    } catch (err) {\n" +
    "      console.error('Delete failed', err);\n" +
    "      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to delete record.' });\n" +
    "    }\n" +
    "  };\n\n";

    const effRegex = /useEffect\(\(\) => \{[\s\S]*?\}, \[.*?\]\);/;
    if (effRegex.test(content)) {
      content = content.replace(effRegex, match => match + fnCode);
    } else {
      console.log('Could not find useEffect in', cfg.file);
    }
  }

  // 3. Add column to columns array
  if (!content.includes("header: 'Actions'") && !content.includes('header: "Actions"')) {
    const columnAdd = ",\n" +
    "    {\n" +
    "      header: 'Actions',\n" +
    "      accessor: 'actions',\n" +
    "      render: (row) => (\n" +
    "        <button\n" +
    "          onClick={() => handleDelete(row." + cfg.idField + ")}\n" +
    "          className=\"p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer\"\n" +
    "          title=\"Delete\"\n" +
    "        >\n" +
    "          <Trash2 className=\"w-4 h-4\" />\n" +
    "        </button>\n" +
    "      )\n" +
    "    }";
    
    // Replace before the last bracket of columns array
    const columnsEndRegex = /(const\s+columns\s*=\s*\[[\s\S]*?)(\s*\}\s*\];)/;
    if (columnsEndRegex.test(content)) {
      content = content.replace(columnsEndRegex, '$1' + columnAdd + '$2');
    } else {
      console.log('Could not find columns array end in', cfg.file);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated', cfg.file);
}
