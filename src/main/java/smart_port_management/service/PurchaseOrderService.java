package smart_port_management.service;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;

import smart_port_management.entity.Product;
import smart_port_management.entity.PurchaseOrder;
import smart_port_management.entity.PurchaseOrderItem;
import smart_port_management.entity.PurchaseOrderStatus;
import smart_port_management.repository.ProductRepository;
import smart_port_management.repository.PurchaseOrderItemRepository;
import smart_port_management.repository.PurchaseOrderRepository;

@Service
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseOrderItemRepository purchaseOrderItemRepository;
    private final ProductRepository productRepository;

    public PurchaseOrderService(
            PurchaseOrderRepository purchaseOrderRepository,
            PurchaseOrderItemRepository purchaseOrderItemRepository,
            ProductRepository productRepository) {

        this.purchaseOrderRepository = purchaseOrderRepository;
        this.purchaseOrderItemRepository = purchaseOrderItemRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public PurchaseOrder createPurchaseOrder(Integer vendorId, Integer productId) {
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        PurchaseOrder po = new PurchaseOrder();
        po.setVendorId(vendorId);
        po.setStatus(PurchaseOrderStatus.DRAFT);
        po.setTotalAmount(product.getUnitPrice());
        po.setServiceDescription("Purchased " + product.getProductName());
        
        PurchaseOrder savedPo = purchaseOrderRepository.save(po);

        PurchaseOrderItem item = new PurchaseOrderItem();
        item.setPoId(savedPo.getPoId());
        item.setProductId(product.getProductId());
        item.setQuantity(1.0);
        item.setUnitPrice(product.getUnitPrice());
        item.setAmount(product.getUnitPrice());
        
        purchaseOrderItemRepository.save(item);

        return savedPo;
    }

    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    public PurchaseOrder getPurchaseOrderById(Integer id) {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase order not found with ID: " + id));
    }

    @Transactional
    public void deletePurchaseOrder(Integer id) {
        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase order not found with ID: " + id));
        purchaseOrderItemRepository.deleteByPoId(id);
        purchaseOrderRepository.delete(purchaseOrder);
    }
}
