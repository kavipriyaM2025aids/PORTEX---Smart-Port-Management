package smart_port_management.dto;

public class GateInRequest {

    private Integer containerId;
    private Integer gateId;
    private String ocrContainerNumber;
    private Double actualWeight;

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

    public String getOcrContainerNumber() {
        return ocrContainerNumber;
    }

    public void setOcrContainerNumber(String ocrContainerNumber) {
        this.ocrContainerNumber = ocrContainerNumber;
    }

    public Double getActualWeight() {
        return actualWeight;
    }

    public void setActualWeight(Double actualWeight) {
        this.actualWeight = actualWeight;
    }
}