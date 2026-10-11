package smart_port_management.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import smart_port_management.dto.JournalEntryRequest;
import smart_port_management.dto.JournalRequest;
import smart_port_management.entity.Account;
import smart_port_management.entity.JournalType;
import smart_port_management.entity.PurchaseOrder;
import smart_port_management.entity.VendorBill;
import smart_port_management.entity.VendorBillStatus;
import smart_port_management.repository.AccountRepository;
import smart_port_management.repository.JournalRepository;
import smart_port_management.repository.PurchaseOrderRepository;
import smart_port_management.repository.VendorBillRepository;

@Service
public class VendorBillService {

    private final VendorBillRepository vendorBillRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final JournalPostingService journalPostingService;
    private final JournalRepository journalRepository;
    private final AccountRepository accountRepository;

    public VendorBillService(
            VendorBillRepository vendorBillRepository,
            PurchaseOrderRepository purchaseOrderRepository,
            JournalPostingService journalPostingService,
            JournalRepository journalRepository,
            AccountRepository accountRepository) {

        this.vendorBillRepository = vendorBillRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.journalPostingService = journalPostingService;
        this.journalRepository = journalRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional
    public VendorBill createVendorBill(Integer poId) {

        PurchaseOrder purchaseOrder =
                purchaseOrderRepository.findById(poId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Purchase order not found with ID: " + poId));

        VendorBill vendorBill = new VendorBill();

        vendorBill.setPoId(purchaseOrder.getPoId());
        vendorBill.setAmount(purchaseOrder.getTotalAmount());
        vendorBill.setStatus(VendorBillStatus.POSTED);

        VendorBill savedBill = vendorBillRepository.save(vendorBill);

        // Automatic Accounting Integration: DR Weighbridge Maintenance Expenses / CR Maintenance Payables
        postVendorBillJournal(savedBill);

        return savedBill;
    }

    private void postVendorBillJournal(VendorBill bill) {
        if (journalRepository.existsByReferenceTypeAndReferenceIdAndJournalType(
                "VENDOR_BILL", bill.getBillId(), JournalType.PURCHASE)) {
            return;
        }

        Account expenseAccount = accountRepository.findByAccountCode("5001")
                .orElseGet(() -> accountRepository.findByAccountName("Weighbridge Maintenance Expenses")
                        .orElse(null));
        Account payableAccount = accountRepository.findByAccountCode("2001")
                .orElseGet(() -> accountRepository.findByAccountName("Maintenance Payables")
                        .orElse(null));

        if (expenseAccount == null || payableAccount == null) {
            return;
        }

        JournalRequest journalRequest = new JournalRequest();
        journalRequest.setJournalType("PURCHASE");
        journalRequest.setReferenceType("VENDOR_BILL");
        journalRequest.setReferenceId(bill.getBillId());
        journalRequest.setDescription("Weighbridge maintenance vendor bill for PO #" + bill.getPoId());

        List<JournalEntryRequest> entries = new ArrayList<>();

        // DR Weighbridge Maintenance Expenses
        JournalEntryRequest drExpense = new JournalEntryRequest();
        drExpense.setAccountId(expenseAccount.getAccountId());
        drExpense.setDebit(bill.getAmount());
        drExpense.setCredit(0.0);
        drExpense.setDescription("Weighbridge sensor calibration expense");
        entries.add(drExpense);

        // CR Maintenance Payables
        JournalEntryRequest crPayable = new JournalEntryRequest();
        crPayable.setAccountId(payableAccount.getAccountId());
        crPayable.setDebit(0.0);
        crPayable.setCredit(bill.getAmount());
        crPayable.setDescription("Amount payable to maintenance vendor");
        entries.add(crPayable);

        journalRequest.setEntries(entries);
        journalPostingService.createJournal(journalRequest);
    }

    public List<VendorBill> getAllVendorBills() {
        return vendorBillRepository.findAll();
    }

    public VendorBill getVendorBillById(Integer id) {

        return vendorBillRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Vendor bill not found with ID: " + id));
    }

    @Transactional
    public void deleteVendorBill(Integer id) {
        VendorBill bill = vendorBillRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Vendor bill not found with ID: " + id));
        vendorBillRepository.delete(bill);
    }
}
