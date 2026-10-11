package smart_port_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import smart_port_management.entity.SalesOrderItem;

public interface SalesOrderItemRepository extends JpaRepository<SalesOrderItem, Integer> {

    void deleteBySalesOrderId(Integer salesOrderId);
}