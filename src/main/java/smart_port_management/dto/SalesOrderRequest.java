package smart_port_management.dto;

public class SalesOrderRequest {

    private Integer shippingLineId;
    private Integer gateEntryId;

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
}