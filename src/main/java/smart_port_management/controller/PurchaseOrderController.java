package smart_port_management.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import smart_port_management.entity.PurchaseOrder;
import smart_port_management.service.PurchaseOrderService;

@RestController
@RequestMapping("/api/port/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(
            PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    @PostMapping
    public ResponseEntity<PurchaseOrder> createPurchaseOrder(
            @RequestParam Integer vendorId,
            @RequestParam Integer productId) {

        PurchaseOrder purchaseOrder =
                purchaseOrderService.createPurchaseOrder(
                        vendorId, productId);

        return new ResponseEntity<>(
                purchaseOrder,
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PurchaseOrder>> getAllPurchaseOrders() {

        return ResponseEntity.ok(
                purchaseOrderService.getAllPurchaseOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrder> getPurchaseOrderById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                purchaseOrderService.getPurchaseOrderById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePurchaseOrder(@PathVariable Integer id) {
        purchaseOrderService.deletePurchaseOrder(id);
        return ResponseEntity.ok(Map.of("message", "Record deleted successfully."));
    }
}
