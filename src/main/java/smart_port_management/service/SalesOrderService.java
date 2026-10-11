package smart_port_management.service;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import smart_port_management.dto.SalesOrderRequest;
import smart_port_management.entity.GateEntry;
import smart_port_management.entity.Product;
import smart_port_management.entity.SalesOrder;
import smart_port_management.entity.SalesOrderItem;
import smart_port_management.entity.SalesOrderStatus;
import smart_port_management.repository.GateEntryRepository;
import smart_port_management.repository.ProductRepository;
import smart_port_management.repository.SalesOrderItemRepository;
import smart_port_management.repository.SalesOrderRepository;

@Service
public class SalesOrderService {

    private final SalesOrderRepository salesOrderRepository;
    private final SalesOrderItemRepository salesOrderItemRepository;
    private final ProductRepository productRepository;
    private final GateEntryRepository gateEntryRepository;

    public SalesOrderService(
            SalesOrderRepository salesOrderRepository,
            SalesOrderItemRepository salesOrderItemRepository,
            ProductRepository productRepository,
            GateEntryRepository gateEntryRepository) {

        this.salesOrderRepository = salesOrderRepository;
        this.salesOrderItemRepository = salesOrderItemRepository;
        this.productRepository = productRepository;
        this.gateEntryRepository = gateEntryRepository;
    }

    public SalesOrder createSalesOrder(SalesOrderRequest request) {

        // 1. Find Gate Entry
        GateEntry gateEntry = gateEntryRepository
                .findById(request.getGateEntryId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Gate entry not found with ID: "
                                        + request.getGateEntryId()));

        // 2. Find Gate Clearance Product
        Product gateClearanceProduct = productRepository
                .findById(1)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Gate clearance product not found"));

        // 3. Create Sales Order
        SalesOrder salesOrder = new SalesOrder();

        salesOrder.setShippingLineId(request.getShippingLineId());
        salesOrder.setGateEntryId(request.getGateEntryId());
        salesOrder.setStatus(SalesOrderStatus.CONFIRMED);

        // 4. Gate Clearance Item
        SalesOrderItem gateClearanceItem = new SalesOrderItem();

        gateClearanceItem.setProductId(
                gateClearanceProduct.getProductId());

        gateClearanceItem.setQuantity(1.0);
        gateClearanceItem.setUnitPrice(
                gateClearanceProduct.getUnitPrice());

        gateClearanceItem.setAmount(
                gateClearanceProduct.getUnitPrice());

        // 5. Calculate total
        double totalAmount =
                gateClearanceProduct.getUnitPrice();

        // 6. Overweight Surcharge
        if (Boolean.TRUE.equals(gateEntry.getOverweight())) {

            Product surchargeProduct = productRepository
                    .findById(2)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Overweight surcharge product not found"));

            SalesOrderItem surchargeItem = new SalesOrderItem();

            surchargeItem.setProductId(
                    surchargeProduct.getProductId());

            surchargeItem.setQuantity(1.0);

            surchargeItem.setUnitPrice(
                    surchargeProduct.getUnitPrice());

            surchargeItem.setAmount(
                    surchargeProduct.getUnitPrice());

            totalAmount += surchargeProduct.getUnitPrice();

            // Save surcharge item after Sales Order is saved
            salesOrder.setTotalAmount(totalAmount);

            SalesOrder savedOrder =
                    salesOrderRepository.save(salesOrder);

            gateClearanceItem.setSalesOrderId(
                    savedOrder.getSalesOrderId());

            surchargeItem.setSalesOrderId(
                    savedOrder.getSalesOrderId());

            salesOrderItemRepository.save(gateClearanceItem);
            salesOrderItemRepository.save(surchargeItem);

            return savedOrder;
        }

        // 7. If not overweight
        salesOrder.setTotalAmount(totalAmount);

        SalesOrder savedOrder =
                salesOrderRepository.save(salesOrder);

        gateClearanceItem.setSalesOrderId(
                savedOrder.getSalesOrderId());

        salesOrderItemRepository.save(gateClearanceItem);

        return savedOrder;
    }

    public List<SalesOrder> getAllSalesOrders() {
        return salesOrderRepository.findAll();
    }

    public SalesOrder getSalesOrderById(Integer id) {
        return salesOrderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Sales order not found with ID: " + id));
    }

    @Transactional
    public void deleteSalesOrder(Integer id) {
        SalesOrder salesOrder = salesOrderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Sales order not found with ID: " + id));
        salesOrderItemRepository.deleteBySalesOrderId(id);
        salesOrderRepository.delete(salesOrder);
    }
}
