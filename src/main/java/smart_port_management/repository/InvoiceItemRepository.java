package smart_port_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import smart_port_management.entity.InvoiceItem;

public interface InvoiceItemRepository
        extends JpaRepository<InvoiceItem, Integer> {
    void deleteByInvoiceId(Integer invoiceId);
}