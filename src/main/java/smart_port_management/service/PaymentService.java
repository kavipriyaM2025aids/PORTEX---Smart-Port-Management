package smart_port_management.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import smart_port_management.dto.JournalEntryRequest;
import smart_port_management.dto.JournalRequest;
import smart_port_management.entity.Account;
import smart_port_management.entity.CustomerInvoice;
import smart_port_management.entity.CustomerInvoiceStatus;
import smart_port_management.entity.JournalType;
import smart_port_management.entity.Payment;
import smart_port_management.entity.PaymentMethod;
import smart_port_management.entity.PaymentType;
import smart_port_management.entity.VendorBill;
import smart_port_management.entity.VendorBillStatus;
import smart_port_management.repository.AccountRepository;
import smart_port_management.repository.CustomerInvoiceRepository;
import smart_port_management.repository.JournalRepository;
import smart_port_management.repository.PaymentRepository;
import smart_port_management.repository.VendorBillRepository;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final CustomerInvoiceRepository customerInvoiceRepository;
    private final VendorBillRepository vendorBillRepository;
    private final JournalPostingService journalPostingService;
    private final JournalRepository journalRepository;
    private final AccountRepository accountRepository;

    public PaymentService(
            PaymentRepository paymentRepository,
            CustomerInvoiceRepository customerInvoiceRepository,
            VendorBillRepository vendorBillRepository,
            JournalPostingService journalPostingService,
            JournalRepository journalRepository,
            AccountRepository accountRepository) {

        this.paymentRepository = paymentRepository;
        this.customerInvoiceRepository = customerInvoiceRepository;
        this.vendorBillRepository = vendorBillRepository;
        this.journalPostingService = journalPostingService;
        this.journalRepository = journalRepository;
        this.accountRepository = accountRepository;
    }

    // CUSTOMER PAYMENT
    @Transactional
    public Payment createCustomerPayment(
            Integer invoiceId,
            Double amount,
            PaymentMethod paymentMethod,
            String referenceNumber) {

        CustomerInvoice invoice =
                customerInvoiceRepository.findById(invoiceId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invoice not found with ID: " + invoiceId));

        if (amount == null || amount <= 0) {
            throw new RuntimeException("Payment amount must be greater than 0");
        }

        if (amount > invoice.getTotalAmount()) {
            throw new RuntimeException(
                    "Payment amount cannot exceed invoice total");
        }

        Payment payment = new Payment();

        payment.setPaymentType(PaymentType.CUSTOMER_RECEIPT);
        payment.setInvoiceId(invoiceId);
        payment.setAmount(amount);
        payment.setPaymentMethod(paymentMethod);
        payment.setReferenceNumber(referenceNumber);

        if (amount.equals(invoice.getTotalAmount())) {
            invoice.setStatus(CustomerInvoiceStatus.PAID);
        } else {
            invoice.setStatus(CustomerInvoiceStatus.PARTIALLY_PAID);
        }

        customerInvoiceRepository.save(invoice);
        Payment savedPayment = paymentRepository.save(payment);

        // Automatic Accounting Integration: DR Cash/Bank / CR Customer Receivables
        postCustomerPaymentJournal(savedPayment, invoice);

        return savedPayment;
    }

    private void postCustomerPaymentJournal(Payment payment, CustomerInvoice invoice) {
        JournalType journalType = (payment.getPaymentMethod() == PaymentMethod.CASH) ? JournalType.CASH : JournalType.BANK;

        if (journalRepository.existsByReferenceTypeAndReferenceIdAndJournalType(
                "CUSTOMER_PAYMENT", payment.getPaymentId(), journalType)) {
            return;
        }

        Account cashBankAccount = accountRepository.findByAccountCode("1003")
                .orElseGet(() -> accountRepository.findByAccountName("Cash/Bank")
                        .orElse(null));
        Account receivableAccount = accountRepository.findByAccountCode("1010")
                .orElseGet(() -> accountRepository.findByAccountName("Customer Receivables")
                        .orElse(null));

        if (cashBankAccount == null || receivableAccount == null) {
            return;
        }

        JournalRequest journalRequest = new JournalRequest();
        journalRequest.setJournalType(journalType.name());
        journalRequest.setReferenceType("CUSTOMER_PAYMENT");
        journalRequest.setReferenceId(payment.getPaymentId());
        journalRequest.setDescription("Receipt for Customer Invoice #" + payment.getInvoiceId() + " (Ref: " + payment.getReferenceNumber() + ")");

        List<JournalEntryRequest> entries = new ArrayList<>();

        // DR Cash/Bank
        JournalEntryRequest drCash = new JournalEntryRequest();
        drCash.setAccountId(cashBankAccount.getAccountId());
        drCash.setDebit(payment.getAmount());
        drCash.setCredit(0.0);
        drCash.setDescription("Bank receipt from shipping line");
        entries.add(drCash);

        // CR Customer Receivables
        JournalEntryRequest crReceivable = new JournalEntryRequest();
        crReceivable.setAccountId(receivableAccount.getAccountId());
        crReceivable.setDebit(0.0);
        crReceivable.setCredit(payment.getAmount());
        crReceivable.setDescription("Customer receivable settled");
        entries.add(crReceivable);

        journalRequest.setEntries(entries);
        journalPostingService.createJournal(journalRequest);
    }

    // VENDOR PAYMENT
    @Transactional
    public Payment createVendorPayment(
            Integer billId,
            Double amount,
            PaymentMethod paymentMethod,
            String referenceNumber) {

        VendorBill bill =
                vendorBillRepository.findById(billId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Vendor bill not found with ID: " + billId));

        if (amount == null || amount <= 0) {
            throw new RuntimeException(
                    "Payment amount must be greater than 0");
        }

        if (amount > bill.getAmount()) {
            throw new RuntimeException(
                    "Payment amount cannot exceed vendor bill amount");
        }

        Payment payment = new Payment();

        payment.setPaymentType(PaymentType.VENDOR_PAYMENT);
        payment.setBillId(billId);
        payment.setAmount(amount);
        payment.setPaymentMethod(paymentMethod);
        payment.setReferenceNumber(referenceNumber);

        if (amount.equals(bill.getAmount())) {
            bill.setStatus(VendorBillStatus.PAID);
        }

        vendorBillRepository.save(bill);
        Payment savedPayment = paymentRepository.save(payment);

        // Automatic Accounting Integration: DR Maintenance Payables / CR Cash/Bank
        postVendorPaymentJournal(savedPayment, bill);

        return savedPayment;
    }

    private void postVendorPaymentJournal(Payment payment, VendorBill bill) {
        JournalType journalType = (payment.getPaymentMethod() == PaymentMethod.CASH) ? JournalType.CASH : JournalType.BANK;

        if (journalRepository.existsByReferenceTypeAndReferenceIdAndJournalType(
                "VENDOR_PAYMENT", payment.getPaymentId(), journalType)) {
            return;
        }

        Account payableAccount = accountRepository.findByAccountCode("2001")
                .orElseGet(() -> accountRepository.findByAccountName("Maintenance Payables")
                        .orElse(null));
        Account cashBankAccount = accountRepository.findByAccountCode("1003")
                .orElseGet(() -> accountRepository.findByAccountName("Cash/Bank")
                        .orElse(null));

        if (payableAccount == null || cashBankAccount == null) {
            return;
        }

        JournalRequest journalRequest = new JournalRequest();
        journalRequest.setJournalType(journalType.name());
        journalRequest.setReferenceType("VENDOR_PAYMENT");
        journalRequest.setReferenceId(payment.getPaymentId());
        journalRequest.setDescription("Vendor payment for Bill #" + payment.getBillId() + " (Ref: " + payment.getReferenceNumber() + ")");

        List<JournalEntryRequest> entries = new ArrayList<>();

        // DR Maintenance Payables
        JournalEntryRequest drPayable = new JournalEntryRequest();
        drPayable.setAccountId(payableAccount.getAccountId());
        drPayable.setDebit(payment.getAmount());
        drPayable.setCredit(0.0);
        drPayable.setDescription("Maintenance payable settled");
        entries.add(drPayable);

        // CR Cash/Bank
        JournalEntryRequest crCash = new JournalEntryRequest();
        crCash.setAccountId(cashBankAccount.getAccountId());
        crCash.setDebit(0.0);
        crCash.setCredit(payment.getAmount());
        crCash.setDescription("Bank payment to maintenance vendor");
        entries.add(crCash);

        journalRequest.setEntries(entries);
        journalPostingService.createJournal(journalRequest);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment getPaymentById(Integer id) {

        return paymentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found with ID: " + id));
    }

    @Transactional
    public void deletePayment(Integer id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found with ID: " + id));
        paymentRepository.delete(payment);
    }
}
