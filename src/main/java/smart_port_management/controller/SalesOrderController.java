package smart_port_management.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import smart_port_management.dto.SalesOrderRequest;
import smart_port_management.entity.SalesOrder;
import smart_port_management.service.SalesOrderService;

@RestController
@RequestMapping("/api/port/sales-orders")
public class SalesOrderController {

    private final SalesOrderService salesOrderService;

    public SalesOrderController(SalesOrderService salesOrderService) {
        this.salesOrderService = salesOrderService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SalesOrder createSalesOrder(
            @RequestBody SalesOrderRequest request) {

        return salesOrderService.createSalesOrder(request);
    }

    @GetMapping
    public List<SalesOrder> getAllSalesOrders() {
        return salesOrderService.getAllSalesOrders();
    }

    @GetMapping("/{id}")
    public SalesOrder getSalesOrderById(
            @PathVariable Integer id) {

        return salesOrderService.getSalesOrderById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteSalesOrder(@PathVariable Integer id) {
        salesOrderService.deleteSalesOrder(id);
        return ResponseEntity.ok(Map.of("message", "Record deleted successfully."));
    }
}
