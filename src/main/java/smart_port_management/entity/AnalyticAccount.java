package smart_port_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "analytic_accounts")
public class AnalyticAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "analytic_account_id")
    private Integer analyticAccountId;

    @Column(name = "analytic_code", nullable = false, unique = true)
    private String analyticCode;

    @Column(name = "analytic_name", nullable = false)
    private String analyticName;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private AnalyticAccountStatus status;

    @PrePersist
    public void prePersist() {
        if (status == null) {
            status = AnalyticAccountStatus.ACTIVE;
        }
    }

    public Integer getAnalyticAccountId() {
        return analyticAccountId;
    }

    public void setAnalyticAccountId(Integer analyticAccountId) {
        this.analyticAccountId = analyticAccountId;
    }

    public String getAnalyticCode() {
        return analyticCode;
    }

    public void setAnalyticCode(String analyticCode) {
        this.analyticCode = analyticCode;
    }

    public String getAnalyticName() {
        return analyticName;
    }

    public void setAnalyticName(String analyticName) {
        this.analyticName = analyticName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public AnalyticAccountStatus getStatus() {
        return status;
    }

    public void setStatus(AnalyticAccountStatus status) {
        this.status = status;
    }
}