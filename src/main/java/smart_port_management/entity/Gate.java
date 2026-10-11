package smart_port_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "gates")
public class Gate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "gate_id")
    private Integer gateId;

    @Column(name = "gate_code", nullable = false, unique = true)
    private String gateCode;

    @Column(name = "gate_name", nullable = false)
    private String gateName;

    @Column(name = "location")
    private String location;

    @Column(name = "max_weight_limit", nullable = false)
    private Double maxWeightLimit;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private GateStatus status;

    public Integer getGateId() {
        return gateId;
    }

    public void setGateId(Integer gateId) {
        this.gateId = gateId;
    }

    public String getGateCode() {
        return gateCode;
    }

    public void setGateCode(String gateCode) {
        this.gateCode = gateCode;
    }

    public String getGateName() {
        return gateName;
    }

    public void setGateName(String gateName) {
        this.gateName = gateName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getMaxWeightLimit() {
        return maxWeightLimit;
    }

    public void setMaxWeightLimit(Double maxWeightLimit) {
        this.maxWeightLimit = maxWeightLimit;
    }

    public GateStatus getStatus() {
        return status;
    }

    public void setStatus(GateStatus status) {
        this.status = status;
    }
}