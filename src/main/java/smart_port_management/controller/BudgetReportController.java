package smart_port_management.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import smart_port_management.service.BudgetReportService;

@RestController
@RequestMapping("/api/port/reports")
public class BudgetReportController {

    private final BudgetReportService budgetReportService;

    public BudgetReportController(
            BudgetReportService budgetReportService) {
        this.budgetReportService = budgetReportService;
    }

    @GetMapping("/budget")
    public ResponseEntity<List<Map<String, Object>>> getBudgetReport() {
        return ResponseEntity.ok(
                budgetReportService.getBudgetReport());
    }
}