package smart_port_management.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "weighbridge_readings")
public class WeighbridgeReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reading_id")
    private Integer readingId;

    @Column(name = "gate_entry_id", nullable = false)
    private Integer gateEntryId;

    @Column(name = "device_id")
    private String deviceId;

    @Column(name = "reading_time")
    private LocalDateTime readingTime;

    @Column(name = "weight", nullable = false)
    private Double weight;

    @Column(name = "unit")
    private String unit;

    @Enumerated(EnumType.STRING)
    @Column(name = "reading_status")
    private ReadingStatus readingStatus;

    @PrePersist
    public void prePersist() {
        if (readingTime == null) {
            readingTime = LocalDateTime.now();
        }

        if (unit == null) {
            unit = "KG";
        }

        if (readingStatus == null) {
            readingStatus = ReadingStatus.VALID;
        }
    }

    public Integer getReadingId() {
        return readingId;
    }

    public void setReadingId(Integer readingId) {
        this.readingId = readingId;
    }

    public Integer getGateEntryId() {
        return gateEntryId;
    }

    public void setGateEntryId(Integer gateEntryId) {
        this.gateEntryId = gateEntryId;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public LocalDateTime getReadingTime() {
        return readingTime;
    }

    public void setReadingTime(LocalDateTime readingTime) {
        this.readingTime = readingTime;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public ReadingStatus getReadingStatus() {
        return readingStatus;
    }

    public void setReadingStatus(ReadingStatus readingStatus) {
        this.readingStatus = readingStatus;
    }
}