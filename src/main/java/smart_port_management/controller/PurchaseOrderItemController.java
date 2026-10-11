package smart_port_management.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import smart_port_management.entity.PurchaseOrderItem;
import smart_port_management.service.PurchaseOrderItemService;

@RestController
@RequestMapping("/api/port/purchase-order-items")
public class PurchaseOrderItemController {

    private final PurchaseOrderItemService purchaseOrderItemService;

    public PurchaseOrderItemController(
            PurchaseOrderItemService purchaseOrderItemService) {
        this.purchaseOrderItemService = purchaseOrderItemService;
    }

    @PostMapping
    public ResponseEntity<PurchaseOrderItem> createPurchaseOrderItem(
            @RequestParam Integer poId,
            @RequestParam Integer productId,
            @RequestParam(required = false) Double quantity) {

        PurchaseOrderItem item =
                purchaseOrderItemService.createPurchaseOrderItem(
                        poId, productId, quantity);

        return new ResponseEntity<>(
                item,
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PurchaseOrderItem>> getAllPurchaseOrderItems() {

        return ResponseEntity.ok(
                purchaseOrderItemService.getAllPurchaseOrderItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrderItem> getPurchaseOrderItemById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                purchaseOrderItemService.getPurchaseOrderItemById(id));
    }
}