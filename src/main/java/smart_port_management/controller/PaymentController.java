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

import smart_port_management.entity.Payment;
import smart_port_management.entity.PaymentMethod;
import smart_port_management.service.PaymentService;

@RestController
@RequestMapping("/api/port/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Customer payment
    @PostMapping("/customer")
    public ResponseEntity<Payment> createCustomerPayment(
            @RequestParam Integer invoiceId,
            @RequestParam Double amount,
            @RequestParam PaymentMethod paymentMethod,
            @RequestParam String referenceNumber) {

        Payment payment = paymentService.createCustomerPayment(
                invoiceId,
                amount,
                paymentMethod,
                referenceNumber);

        return new ResponseEntity<>(
                payment,
                HttpStatus.CREATED);
    }

    // Vendor payment
    @PostMapping("/vendor")
    public ResponseEntity<Payment> createVendorPayment(
            @RequestParam Integer billId,
            @RequestParam Double amount,
            @RequestParam PaymentMethod paymentMethod,
            @RequestParam String referenceNumber) {

        Payment payment = paymentService.createVendorPayment(
                billId,
                amount,
                paymentMethod,
                referenceNumber);

        return new ResponseEntity<>(
                payment,
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {

        return ResponseEntity.ok(
                paymentService.getAllPayments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                paymentService.getPaymentById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePayment(@PathVariable Integer id) {
        paymentService.deletePayment(id);
        return ResponseEntity.ok(Map.of("message", "Record deleted successfully."));
    }
}
