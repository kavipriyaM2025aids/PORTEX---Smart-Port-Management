package smart_port_management.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "sales_orders")
public class SalesOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sales_order_id")
    private Integer salesOrderId;

    @Column(name = "shipping_line_id", nullable = false)
    private Integer shippingLineId;

    @Column(name = "gate_entry_id", nullable = false)
    private Integer gateEntryId;

    @Column(name = "order_date", nullable = false)
    private LocalDate orderDate;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private SalesOrderStatus status;

    @PrePersist
    public void prePersist() {

        if (orderDate == null) {
            orderDate = LocalDate.now();
        }

        if (totalAmount == null) {
            totalAmount = 0.0;
        }

        if (status == null) {
            status = SalesOrderStatus.DRAFT;
        }
    }

    public Integer getSalesOrderId() {
        return salesOrderId;
    }

    public void setSalesOrderId(Integer salesOrderId) {
        this.salesOrderId = salesOrderId;
    }

    public Integer getShippingLineId() {
        return shippingLineId;
    }

    public void setShippingLineId(Integer shippingLineId) {
        this.shippingLineId = shippingLineId;
    }

    public Integer getGateEntryId() {
        return gateEntryId;
    }

    public void setGateEntryId(Integer gateEntryId) {
        this.gateEntryId = gateEntryId;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public SalesOrderStatus getStatus() {
        return status;
    }

    public void setStatus(SalesOrderStatus status) {
        this.status = status;
    }
}