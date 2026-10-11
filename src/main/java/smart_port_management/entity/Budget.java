package smart_port_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "budget_id")
    private Integer budgetId;

    @Column(name = "analytic_account_id", nullable = false)
    private Integer analyticAccountId;

    @Column(name = "budget_name", nullable = false)
    private String budgetName;

    @Column(name = "financial_year", nullable = false)
    private String financialYear;

    @Column(name = "planned_revenue")
    private Double plannedRevenue;

    @Column(name = "planned_expense")
    private Double plannedExpense;

    @Column(name = "actual_revenue")
    private Double actualRevenue;

    @Column(name = "actual_expense")
    private Double actualExpense;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private BudgetStatus status;

    @PrePersist
    public void prePersist() {
        if (plannedRevenue == null) plannedRevenue = 0.0;
        if (plannedExpense == null) plannedExpense = 0.0;
        if (actualRevenue == null) actualRevenue = 0.0;
        if (actualExpense == null) actualExpense = 0.0;
        if (status == null) status = BudgetStatus.DRAFT;
    }

    public Integer getBudgetId() {
        return budgetId;
    }

    public void setBudgetId(Integer budgetId) {
        this.budgetId = budgetId;
    }

    public Integer getAnalyticAccountId() {
        return analyticAccountId;
    }

    public void setAnalyticAccountId(Integer analyticAccountId) {
        this.analyticAccountId = analyticAccountId;
    }

    public String getBudgetName() {
        return budgetName;
    }

    public void setBudgetName(String budgetName) {
        this.budgetName = budgetName;
    }

    public String getFinancialYear() {
        return financialYear;
    }

    public void setFinancialYear(String financialYear) {
        this.financialYear = financialYear;
    }

    public Double getPlannedRevenue() {
        return plannedRevenue;
    }

    public void setPlannedRevenue(Double plannedRevenue) {
        this.plannedRevenue = plannedRevenue;
    }

    public Double getPlannedExpense() {
        return plannedExpense;
    }

    public void setPlannedExpense(Double plannedExpense) {
        this.plannedExpense = plannedExpense;
    }

    public Double getActualRevenue() {
        return actualRevenue;
    }

    public void setActualRevenue(Double actualRevenue) {
        this.actualRevenue = actualRevenue;
    }

    public Double getActualExpense() {
        return actualExpense;
    }

    public void setActualExpense(Double actualExpense) {
        this.actualExpense = actualExpense;
    }

    public BudgetStatus getStatus() {
        return status;
    }

    public void setStatus(BudgetStatus status) {
        this.status = status;
    }
}