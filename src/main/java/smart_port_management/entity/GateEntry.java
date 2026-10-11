package smart_port_management.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "gate_entries")
public class GateEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "gate_entry_id")
    private Integer gateEntryId;

    @Column(name = "container_id", nullable = false)
    private Integer containerId;

    @Column(name = "gate_id", nullable = false)
    private Integer gateId;

    @Column(name = "entry_time")
    private LocalDateTime entryTime;

    @Column(name = "ocr_container_number")
    private String ocrContainerNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "ocr_status")
    private OCRStatus ocrStatus;

    @Column(name = "actual_weight")
    private Double actualWeight;

    @Column(name = "weight_limit")
    private Double weightLimit;

    @Column(name = "overweight")
    private Boolean overweight;

    @Column(name = "overweight_surcharge")
    private Double overweightSurcharge;

    @Enumerated(EnumType.STRING)
    @Column(name = "clearance_status")
    private ClearanceStatus clearanceStatus;


    @PrePersist
    public void prePersist() {
        if (entryTime == null) {
            entryTime = LocalDateTime.now();
        }
    }


    public Integer getGateEntryId() {
        return gateEntryId;
    }

    public void setGateEntryId(Integer gateEntryId) {
        this.gateEntryId = gateEntryId;
    }

    public Integer getContainerId() {
        return containerId;
    }

    public void setContainerId(Integer containerId) {
        this.containerId = containerId;
    }

    public Integer getGateId() {
        return gateId;
    }

    public void setGateId(Integer gateId) {
        this.gateId = gateId;
    }

    public LocalDateTime getEntryTime() {
        return entryTime;
    }

    public void setEntryTime(LocalDateTime entryTime) {
        this.entryTime = entryTime;
    }

    public String getOcrContainerNumber() {
        return ocrContainerNumber;
    }

    public void setOcrContainerNumber(String ocrContainerNumber) {
        this.ocrContainerNumber = ocrContainerNumber;
    }

    public OCRStatus getOcrStatus() {
        return ocrStatus;
    }

    public void setOcrStatus(OCRStatus ocrStatus) {
        this.ocrStatus = ocrStatus;
    }

    public Double getActualWeight() {
        return actualWeight;
    }

    public void setActualWeight(Double actualWeight) {
        this.actualWeight = actualWeight;
    }

    public Double getWeightLimit() {
        return weightLimit;
    }

    public void setWeightLimit(Double weightLimit) {
        this.weightLimit = weightLimit;
    }

    public Boolean getOverweight() {
        return overweight;
    }

    public void setOverweight(Boolean overweight) {
        this.overweight = overweight;
    }

    public Double getOverweightSurcharge() {
        return overweightSurcharge;
    }

    public void setOverweightSurcharge(Double overweightSurcharge) {
        this.overweightSurcharge = overweightSurcharge;
    }

    public ClearanceStatus getClearanceStatus() {
        return clearanceStatus;
    }

    public void setClearanceStatus(ClearanceStatus clearanceStatus) {
        this.clearanceStatus = clearanceStatus;
    }
}