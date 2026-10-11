package smart_port_management.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import smart_port_management.entity.SalesOrderItem;
import smart_port_management.service.SalesOrderItemService;

import java.util.List;

@RestController
@RequestMapping("/api/port/sales-order-items")
public class SalesOrderItemController {

    private final SalesOrderItemService salesOrderItemService;

    public SalesOrderItemController(
            SalesOrderItemService salesOrderItemService) {
        this.salesOrderItemService = salesOrderItemService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SalesOrderItem createSalesOrderItem(
            @RequestBody SalesOrderItem item) {

        return salesOrderItemService.createSalesOrderItem(item);
    }

    @GetMapping
    public List<SalesOrderItem> getAllSalesOrderItems() {
        return salesOrderItemService.getAllSalesOrderItems();
    }

    @GetMapping("/{id}")
    public SalesOrderItem getSalesOrderItemById(
            @PathVariable Integer id) {

        return salesOrderItemService.getSalesOrderItemById(id);
    }
}