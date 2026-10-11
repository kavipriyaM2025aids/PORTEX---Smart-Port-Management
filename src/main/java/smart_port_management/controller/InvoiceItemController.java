package smart_port_management.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import smart_port_management.entity.InvoiceItem;
import smart_port_management.service.InvoiceItemService;

@RestController
@RequestMapping("/api/port/invoice-items")
public class InvoiceItemController {

    private final InvoiceItemService invoiceItemService;

    public InvoiceItemController(
            InvoiceItemService invoiceItemService) {
        this.invoiceItemService = invoiceItemService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InvoiceItem createInvoiceItem(
            @RequestParam Integer invoiceId,
            @RequestParam Integer productId) {

        return invoiceItemService.createInvoiceItem(
                invoiceId,
                productId);
    }

    @GetMapping
    public List<InvoiceItem> getAllInvoiceItems() {
        return invoiceItemService.getAllInvoiceItems();
    }

    @GetMapping("/{id}")
    public InvoiceItem getInvoiceItemById(
            @PathVariable Integer id) {

        return invoiceItemService.getInvoiceItemById(id);
    }
}