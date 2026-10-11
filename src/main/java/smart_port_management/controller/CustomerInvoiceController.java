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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import smart_port_management.entity.CustomerInvoice;
import smart_port_management.service.CustomerInvoiceService;

@RestController
@RequestMapping("/api/port/invoices")
public class CustomerInvoiceController {

    private final CustomerInvoiceService customerInvoiceService;

    public CustomerInvoiceController(
            CustomerInvoiceService customerInvoiceService) {
        this.customerInvoiceService = customerInvoiceService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerInvoice createInvoice(
            @RequestParam Integer salesOrderId) {

        return customerInvoiceService.createInvoice(salesOrderId);
    }

    @GetMapping
    public List<CustomerInvoice> getAllInvoices() {
        return customerInvoiceService.getAllInvoices();
    }

    @GetMapping("/{id}")
    public CustomerInvoice getInvoiceById(
            @PathVariable Integer id) {

        return customerInvoiceService.getInvoiceById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteInvoice(@PathVariable Integer id) {
        customerInvoiceService.deleteInvoice(id);
        return ResponseEntity.ok(Map.of("message", "Record deleted successfully."));
    }
}
