package smart_port_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import smart_port_management.entity.SalesOrderItem;
import smart_port_management.repository.SalesOrderItemRepository;

@Service
public class SalesOrderItemService {

    private final SalesOrderItemRepository salesOrderItemRepository;

    public SalesOrderItemService(
            SalesOrderItemRepository salesOrderItemRepository) {
        this.salesOrderItemRepository = salesOrderItemRepository;
    }

    public SalesOrderItem createSalesOrderItem(SalesOrderItem item) {
        return salesOrderItemRepository.save(item);
    }

    public List<SalesOrderItem> getAllSalesOrderItems() {
        return salesOrderItemRepository.findAll();
    }

    public SalesOrderItem getSalesOrderItemById(Integer id) {
        return salesOrderItemRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Sales order item not found with ID: " + id));
    }
}