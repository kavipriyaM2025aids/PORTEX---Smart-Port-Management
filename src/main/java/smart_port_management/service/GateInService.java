package smart_port_management.service;

import org.springframework.stereotype.Service;

import smart_port_management.dto.GateInRequest;
import smart_port_management.entity.ClearanceStatus;
import smart_port_management.entity.Container;
import smart_port_management.entity.Gate;
import smart_port_management.entity.GateEntry;
import smart_port_management.entity.OCRStatus;
import smart_port_management.entity.Product;
import smart_port_management.repository.ContainerRepository;
import smart_port_management.repository.GateEntryRepository;
import smart_port_management.repository.GateRepository;
import smart_port_management.repository.ProductRepository;

@Service
public class GateInService {

    private final GateEntryRepository gateEntryRepository;
    private final ContainerRepository containerRepository;
    private final GateRepository gateRepository;
    private final ProductRepository productRepository;

    public GateInService(
            GateEntryRepository gateEntryRepository,
            ContainerRepository containerRepository,
            GateRepository gateRepository,
            ProductRepository productRepository) {

        this.gateEntryRepository = gateEntryRepository;
        this.containerRepository = containerRepository;
        this.gateRepository = gateRepository;
        this.productRepository = productRepository;
    }

    public GateEntry processGateIn(GateInRequest request) {

        // 1. Find container
        Container container = containerRepository
                .findById(request.getContainerId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Container not found with ID: "
                                        + request.getContainerId()));

        // 2. Find gate
        Gate gate = gateRepository
                .findById(request.getGateId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Gate not found with ID: "
                                        + request.getGateId()));

        // 3. OCR verification
        boolean ocrMatched = container.getContainerNumber()
                .equalsIgnoreCase(request.getOcrContainerNumber());

        // 4. Create gate entry
        GateEntry gateEntry = new GateEntry();

        gateEntry.setContainerId(container.getContainerId());
        gateEntry.setGateId(gate.getGateId());
        gateEntry.setOcrContainerNumber(
                request.getOcrContainerNumber());

        // 5. Set OCR status
        if (ocrMatched) {
            gateEntry.setOcrStatus(OCRStatus.SUCCESS);
        } else {
            gateEntry.setOcrStatus(OCRStatus.FAILED);
        }

        // 6. Set actual weight and gate limit
        gateEntry.setActualWeight(request.getActualWeight());
        gateEntry.setWeightLimit(gate.getMaxWeightLimit());

        // 7. Check overweight
        boolean overweight =
                request.getActualWeight() > gate.getMaxWeightLimit();

        gateEntry.setOverweight(overweight);

        // 8. Get surcharge from Product Master
        double surcharge = 0.0;

        if (overweight) {

            Product surchargeProduct = productRepository
                    .findById(2)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Overweight surcharge product not found"));

            surcharge = surchargeProduct.getUnitPrice();
        }

        gateEntry.setOverweightSurcharge(surcharge);

        // 9. Clearance decision
        if (ocrMatched) {
            gateEntry.setClearanceStatus(ClearanceStatus.CLEARED);
        } else {
            gateEntry.setClearanceStatus(ClearanceStatus.REJECTED);
        }

        // 10. Save gate entry
        return gateEntryRepository.save(gateEntry);
    }
}