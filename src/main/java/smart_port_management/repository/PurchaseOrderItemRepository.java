package smart_port_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import smart_port_management.entity.PurchaseOrderItem;

public interface PurchaseOrderItemRepository
        extends JpaRepository<PurchaseOrderItem, Integer> {
    void deleteByPoId(Integer poId);
}