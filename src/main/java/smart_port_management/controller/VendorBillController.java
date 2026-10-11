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

import smart_port_management.entity.VendorBill;
import smart_port_management.service.VendorBillService;

@RestController
@RequestMapping("/api/port/vendor-bills")
public class VendorBillController {

    private final VendorBillService vendorBillService;

    public VendorBillController(VendorBillService vendorBillService) {
        this.vendorBillService = vendorBillService;
    }

    @PostMapping
    public ResponseEntity<VendorBill> createVendorBill(
            @RequestParam Integer poId) {

        VendorBill vendorBill =
                vendorBillService.createVendorBill(poId);

        return new ResponseEntity<>(
                vendorBill,
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<VendorBill>> getAllVendorBills() {

        return ResponseEntity.ok(
                vendorBillService.getAllVendorBills());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendorBill> getVendorBillById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                vendorBillService.getVendorBillById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteVendorBill(@PathVariable Integer id) {
        vendorBillService.deleteVendorBill(id);
        return ResponseEntity.ok(Map.of("message", "Record deleted successfully."));
    }
}
