package smart_port_management.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import smart_port_management.entity.Budget;
import smart_port_management.repository.BudgetRepository;

@Service
public class BudgetReportService {

    private final BudgetRepository budgetRepository;

    public BudgetReportService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    public List<Map<String, Object>> getBudgetReport() {

        List<Budget> budgets = budgetRepository.findAll();

        return budgets.stream().map(budget -> {

            Map<String, Object> report = new HashMap<>();

            double plannedRevenue = budget.getPlannedRevenue();
            double plannedExpense = budget.getPlannedExpense();
            double actualRevenue = budget.getActualRevenue();
            double actualExpense = budget.getActualExpense();

            report.put("budgetId", budget.getBudgetId());
            report.put("budgetName", budget.getBudgetName());
            report.put("financialYear", budget.getFinancialYear());

            report.put("plannedRevenue", plannedRevenue);
            report.put("actualRevenue", actualRevenue);

            report.put("plannedExpense", plannedExpense);
            report.put("actualExpense", actualExpense);

            report.put(
                    "revenueVariance",
                    actualRevenue - plannedRevenue);

            report.put(
                    "expenseVariance",
                    actualExpense - plannedExpense);

            report.put("status", budget.getStatus());

            return report;

        }).toList();
    }
}