package smart_port_management.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "vendor_bills")
public class VendorBill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bill_id")
    private Integer billId;

    @Column(name = "po_id", nullable = false)
    private Integer poId;

    @Column(name = "bill_date", nullable = false)
    private LocalDate billDate;

    @Column(name = "amount", nullable = false)
    private Double amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private VendorBillStatus status;

    @PrePersist
    public void prePersist() {
        if (billDate == null) {
            billDate = LocalDate.now();
        }

        if (amount == null) {
            amount = 0.0;
        }

        if (status == null) {
            status = VendorBillStatus.DRAFT;
        }
    }

    public Integer getBillId() {
        return billId;
    }

    public void setBillId(Integer billId) {
        this.billId = billId;
    }

    public Integer getPoId() {
        return poId;
    }

    public void setPoId(Integer poId) {
        this.poId = poId;
    }

    public LocalDate getBillDate() {
        return billDate;
    }

    public void setBillDate(LocalDate billDate) {
        this.billDate = billDate;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public VendorBillStatus getStatus() {
        return status;
    }

    public void setStatus(VendorBillStatus status) {
        this.status = status;
    }
}