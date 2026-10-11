package smart_port_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import smart_port_management.entity.CustomerInvoice;

public interface CustomerInvoiceRepository
        extends JpaRepository<CustomerInvoice, Integer> {
}