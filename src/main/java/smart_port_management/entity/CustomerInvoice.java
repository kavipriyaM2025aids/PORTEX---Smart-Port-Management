package smart_port_management.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "customer_invoices")
public class CustomerInvoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoice_id")
    private Integer invoiceId;

    @Column(name = "sales_order_id", nullable = false)
    private Integer salesOrderId;

    @Column(name = "invoice_date", nullable = false)
    private LocalDate invoiceDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "gate_charge")
    private Double gateCharge;

    @Column(name = "overweight_surcharge")
    private Double overweightSurcharge;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CustomerInvoiceStatus status;

    @PrePersist
    public void prePersist() {

        if (invoiceDate == null) {
            invoiceDate = LocalDate.now();
        }

        if (gateCharge == null) {
            gateCharge = 0.0;
        }

        if (overweightSurcharge == null) {
            overweightSurcharge = 0.0;
        }

        if (totalAmount == null) {
            totalAmount = gateCharge + overweightSurcharge;
        }

        if (status == null) {
            status = CustomerInvoiceStatus.DRAFT;
        }
    }

    public Integer getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(Integer invoiceId) {
        this.invoiceId = invoiceId;
    }

    public Integer getSalesOrderId() {
        return salesOrderId;
    }

    public void setSalesOrderId(Integer salesOrderId) {
        this.salesOrderId = salesOrderId;
    }

    public LocalDate getInvoiceDate() {
        return invoiceDate;
    }

    public void setInvoiceDate(LocalDate invoiceDate) {
        this.invoiceDate = invoiceDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Double getGateCharge() {
        return gateCharge;
    }

    public void setGateCharge(Double gateCharge) {
        this.gateCharge = gateCharge;
    }

    public Double getOverweightSurcharge() {
        return overweightSurcharge;
    }

    public void setOverweightSurcharge(Double overweightSurcharge) {
        this.overweightSurcharge = overweightSurcharge;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public CustomerInvoiceStatus getStatus() {
        return status;
    }

    public void setStatus(CustomerInvoiceStatus status) {
        this.status = status;
    }
}