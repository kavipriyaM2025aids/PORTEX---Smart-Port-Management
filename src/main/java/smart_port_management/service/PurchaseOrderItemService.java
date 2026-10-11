package smart_port_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import smart_port_management.entity.Product;
import smart_port_management.entity.PurchaseOrder;
import smart_port_management.entity.PurchaseOrderItem;
import smart_port_management.repository.ProductRepository;
import smart_port_management.repository.PurchaseOrderItemRepository;
import smart_port_management.repository.PurchaseOrderRepository;

@Service
public class PurchaseOrderItemService {

    private final PurchaseOrderItemRepository purchaseOrderItemRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ProductRepository productRepository;

    public PurchaseOrderItemService(
            PurchaseOrderItemRepository purchaseOrderItemRepository,
            PurchaseOrderRepository purchaseOrderRepository,
            ProductRepository productRepository) {

        this.purchaseOrderItemRepository = purchaseOrderItemRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.productRepository = productRepository;
    }

    public PurchaseOrderItem createPurchaseOrderItem(
            Integer poId,
            Integer productId,
            Double quantity) {

        PurchaseOrder purchaseOrder =
                purchaseOrderRepository.findById(poId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Purchase order not found with ID: " + poId));

        Product product =
                productRepository.findById(productId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found with ID: " + productId));

        if (quantity == null || quantity <= 0) {
            quantity = 1.0;
        }

        PurchaseOrderItem item = new PurchaseOrderItem();

        item.setPoId(purchaseOrder.getPoId());
        item.setProductId(product.getProductId());
        item.setQuantity(quantity);
        item.setUnitPrice(product.getUnitPrice());
        item.setAmount(quantity * product.getUnitPrice());

        return purchaseOrderItemRepository.save(item);
    }

    public List<PurchaseOrderItem> getAllPurchaseOrderItems() {
        return purchaseOrderItemRepository.findAll();
    }

    public PurchaseOrderItem getPurchaseOrderItemById(Integer id) {

        return purchaseOrderItemRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Purchase order item not found with ID: " + id));
    }
}