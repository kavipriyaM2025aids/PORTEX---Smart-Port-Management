package smart_port_management.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import smart_port_management.entity.AnalyticAccount;
import smart_port_management.service.AnalyticAccountService;

@RestController
@RequestMapping("/api/port/analytic-accounts")
public class AnalyticAccountController {

    private final AnalyticAccountService service;

    public AnalyticAccountController(
            AnalyticAccountService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<AnalyticAccount>> getAll() {
        return ResponseEntity.ok(
                service.getAllAnalyticAccounts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnalyticAccount> getById(
            @PathVariable Integer id) {
        return ResponseEntity.ok(
                service.getAnalyticAccountById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteAnalyticAccount(@PathVariable Integer id) {
        service.deleteAnalyticAccount(id);
        return ResponseEntity.ok(Map.of("message", "Record deleted successfully."));
    }
}
