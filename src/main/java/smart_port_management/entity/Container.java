package smart_port_management.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "containers")
public class Container {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "container_id")
    private Integer containerId;

    @Column(name = "container_number", nullable = false, unique = true)
    private String containerNumber;

    @Column(name = "shipping_line_id", nullable = false)
    private Integer shippingLineId;

    @Column(name = "container_type")
    private String containerType;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Integer getContainerId() {
        return containerId;
    }

    public void setContainerId(Integer containerId) {
        this.containerId = containerId;
    }

    public String getContainerNumber() {
        return containerNumber;
    }

    public void setContainerNumber(String containerNumber) {
        this.containerNumber = containerNumber;
    }

    public Integer getShippingLineId() {
        return shippingLineId;
    }

    public void setShippingLineId(Integer shippingLineId) {
        this.shippingLineId = shippingLineId;
    }

    public String getContainerType() {
        return containerType;
    }

    public void setContainerType(String containerType) {
        this.containerType = containerType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}