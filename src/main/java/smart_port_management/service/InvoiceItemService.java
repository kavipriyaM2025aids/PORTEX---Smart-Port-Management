package smart_port_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import smart_port_management.entity.CustomerInvoice;
import smart_port_management.entity.InvoiceItem;
import smart_port_management.entity.Product;
import smart_port_management.repository.CustomerInvoiceRepository;
import smart_port_management.repository.InvoiceItemRepository;
import smart_port_management.repository.ProductRepository;

@Service
public class InvoiceItemService {

    private final InvoiceItemRepository invoiceItemRepository;
    private final CustomerInvoiceRepository customerInvoiceRepository;
    private final ProductRepository productRepository;

    public InvoiceItemService(
            InvoiceItemRepository invoiceItemRepository,
            CustomerInvoiceRepository customerInvoiceRepository,
            ProductRepository productRepository) {

        this.invoiceItemRepository = invoiceItemRepository;
        this.customerInvoiceRepository = customerInvoiceRepository;
        this.productRepository = productRepository;
    }

    public InvoiceItem createInvoiceItem(
            Integer invoiceId,
            Integer productId) {

        CustomerInvoice invoice = customerInvoiceRepository
                .findById(invoiceId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invoice not found with ID: "
                                        + invoiceId));

        Product product = productRepository
                .findById(productId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found with ID: "
                                        + productId));

        InvoiceItem item = new InvoiceItem();

        item.setInvoiceId(invoice.getInvoiceId());
        item.setProductId(product.getProductId());
        item.setQuantity(1.0);
        item.setUnitPrice(product.getUnitPrice());
        item.setAmount(product.getUnitPrice());

        return invoiceItemRepository.save(item);
    }

    public List<InvoiceItem> getAllInvoiceItems() {
        return invoiceItemRepository.findAll();
    }

    public InvoiceItem getInvoiceItemById(Integer id) {

        return invoiceItemRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invoice item not found with ID: "
                                        + id));
    }
}