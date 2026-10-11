package smart_port_management.service;

import java.time.LocalDate;
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
import smart_port_management.entity.Product;
import smart_port_management.entity.SalesOrder;
import smart_port_management.repository.AccountRepository;
import smart_port_management.repository.CustomerInvoiceRepository;
import smart_port_management.repository.JournalRepository;
import smart_port_management.repository.ProductRepository;
import smart_port_management.repository.InvoiceItemRepository;
import smart_port_management.repository.SalesOrderRepository;

@Service
public class CustomerInvoiceService {

    private final CustomerInvoiceRepository customerInvoiceRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final ProductRepository productRepository;
    private final JournalPostingService journalPostingService;
    private final JournalRepository journalRepository;
    private final AccountRepository accountRepository;
    private final InvoiceItemRepository invoiceItemRepository;

    public CustomerInvoiceService(
            CustomerInvoiceRepository customerInvoiceRepository,
            SalesOrderRepository salesOrderRepository,
            ProductRepository productRepository,
            JournalPostingService journalPostingService,
            JournalRepository journalRepository,
            AccountRepository accountRepository, InvoiceItemRepository invoiceItemRepository) {

        this.customerInvoiceRepository = customerInvoiceRepository;
        this.salesOrderRepository = salesOrderRepository;
        this.productRepository = productRepository;
        this.journalPostingService = journalPostingService;
        this.journalRepository = journalRepository;
        this.accountRepository = accountRepository;
        this.invoiceItemRepository = invoiceItemRepository;
    }

    @Transactional
    public CustomerInvoice createInvoice(Integer salesOrderId) {

        SalesOrder salesOrder = salesOrderRepository
                .findById(salesOrderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Sales order not found with ID: "
                                        + salesOrderId));

        // Get Gate Clearance price from Product table
        Product gateClearanceProduct = productRepository
                .findByProductName("Container Gate Clearance");

        if (gateClearanceProduct == null) {
            throw new RuntimeException(
                    "Container Gate Clearance product not found");
        }

        double gateCharge = gateClearanceProduct.getUnitPrice();

        // Get Overweight Surcharge price from Product table
        Product surchargeProduct = productRepository
                .findByProductName("Overweight Surcharge");

        if (surchargeProduct == null) {
            throw new RuntimeException(
                    "Overweight Surcharge product not found");
        }

        double surchargePrice = surchargeProduct.getUnitPrice();

        CustomerInvoice invoice = new CustomerInvoice();

        invoice.setSalesOrderId(salesOrder.getSalesOrderId());
        invoice.setInvoiceDate(LocalDate.now());

        // Gate clearance charge comes from Product table
        invoice.setGateCharge(gateCharge);

        // Add surcharge only when Sales Order is greater than gate charge
        if (salesOrder.getTotalAmount() > gateCharge) {
            invoice.setOverweightSurcharge(surchargePrice);
        } else {
            invoice.setOverweightSurcharge(0.0);
        }

        invoice.setTotalAmount(
                invoice.getGateCharge()
                        + invoice.getOverweightSurcharge());

        invoice.setStatus(CustomerInvoiceStatus.ISSUED);

        CustomerInvoice savedInvoice = customerInvoiceRepository.save(invoice);

        // Automatic Accounting Integration: DR Customer Receivables / CR Gate Revenue & Surcharge Revenue
        postCustomerInvoiceJournal(savedInvoice);

        return savedInvoice;
    }

    private void postCustomerInvoiceJournal(CustomerInvoice invoice) {
        // Prevent duplicate journal posting
        if (journalRepository.existsByReferenceTypeAndReferenceIdAndJournalType(
                "CUSTOMER_INVOICE", invoice.getInvoiceId(), JournalType.SALES)) {
            return;
        }

        Account receivableAccount = accountRepository.findByAccountCode("1010")
                .orElseGet(() -> accountRepository.findByAccountName("Customer Receivables")
                        .orElse(null));
        Account revenueAccount = accountRepository.findByAccountCode("4001")
                .orElseGet(() -> accountRepository.findByAccountName("Terminal Gate Revenue")
                        .orElse(null));
        Account surchargeRevenueAccount = accountRepository.findByAccountCode("4002")
                .orElseGet(() -> accountRepository.findByAccountName("Overweight Surcharge Revenue")
                        .orElse(null));

        if (receivableAccount == null || revenueAccount == null) {
            return; // Accounts not found, skip journal creation
        }

        JournalRequest journalRequest = new JournalRequest();
        journalRequest.setJournalType("SALES");
        journalRequest.setReferenceType("CUSTOMER_INVOICE");
        journalRequest.setReferenceId(invoice.getInvoiceId());
        journalRequest.setDescription("Customer invoice for Sales Order #" + invoice.getSalesOrderId());

        List<JournalEntryRequest> entries = new ArrayList<>();

        // DR Customer Receivables
        JournalEntryRequest drReceivable = new JournalEntryRequest();
        drReceivable.setAccountId(receivableAccount.getAccountId());
        drReceivable.setDebit(invoice.getTotalAmount());
        drReceivable.setCredit(0.0);
        drReceivable.setDescription("Amount receivable for invoice #" + invoice.getInvoiceId());
        entries.add(drReceivable);

        // CR Terminal Gate Revenue
        JournalEntryRequest crGateRevenue = new JournalEntryRequest();
        crGateRevenue.setAccountId(revenueAccount.getAccountId());
        crGateRevenue.setDebit(0.0);
        crGateRevenue.setCredit(invoice.getGateCharge());
        crGateRevenue.setDescription("Container gate clearance revenue");
        entries.add(crGateRevenue);

        // CR Overweight Surcharge Revenue (if applicable)
        if (invoice.getOverweightSurcharge() != null && invoice.getOverweightSurcharge() > 0 && surchargeRevenueAccount != null) {
            JournalEntryRequest crSurcharge = new JournalEntryRequest();
            crSurcharge.setAccountId(surchargeRevenueAccount.getAccountId());
            crSurcharge.setDebit(0.0);
            crSurcharge.setCredit(invoice.getOverweightSurcharge());
            crSurcharge.setDescription("Overweight surcharge revenue");
            entries.add(crSurcharge);
        }

        journalRequest.setEntries(entries);
        journalPostingService.createJournal(journalRequest);
    }

    public List<CustomerInvoice> getAllInvoices() {
        return customerInvoiceRepository.findAll();
    }

    public CustomerInvoice getInvoiceById(Integer id) {
        return customerInvoiceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer invoice not found with ID: "
                                        + id));
    }

    @Transactional
    public void deleteInvoice(Integer id) {
        CustomerInvoice invoice = customerInvoiceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Customer invoice not found with ID: " + id));
        invoiceItemRepository.deleteByInvoiceId(id);
        customerInvoiceRepository.delete(invoice);
    }
}
