package smart_port_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import smart_port_management.entity.VendorBill;

public interface VendorBillRepository
        extends JpaRepository<VendorBill, Integer> {
}