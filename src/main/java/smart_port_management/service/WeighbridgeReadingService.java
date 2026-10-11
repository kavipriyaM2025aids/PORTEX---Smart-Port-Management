package smart_port_management.service;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import smart_port_management.entity.GateEntry;
import smart_port_management.entity.ReadingStatus;
import smart_port_management.entity.WeighbridgeReading;
import smart_port_management.repository.GateEntryRepository;
import smart_port_management.repository.WeighbridgeReadingRepository;

@Service
public class WeighbridgeReadingService {

    private final WeighbridgeReadingRepository weighbridgeReadingRepository;
    private final GateEntryRepository gateEntryRepository;

    public WeighbridgeReadingService(
            WeighbridgeReadingRepository weighbridgeReadingRepository,
            GateEntryRepository gateEntryRepository) {

        this.weighbridgeReadingRepository = weighbridgeReadingRepository;
        this.gateEntryRepository = gateEntryRepository;
    }

    public WeighbridgeReading createReading(
            Integer gateEntryId,
            String deviceId,
            Double weight) {

        GateEntry gateEntry =
                gateEntryRepository.findById(gateEntryId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Gate entry not found with ID: "
                                                + gateEntryId));

        if (weight == null || weight <= 0) {
            throw new RuntimeException(
                    "Weight must be greater than 0");
        }

        WeighbridgeReading reading = new WeighbridgeReading();

        reading.setGateEntryId(gateEntry.getGateEntryId());
        reading.setDeviceId(deviceId);
        reading.setWeight(weight);
        reading.setReadingStatus(ReadingStatus.VALID);

        return weighbridgeReadingRepository.save(reading);
    }

    public List<WeighbridgeReading> getAllReadings() {
        return weighbridgeReadingRepository.findAll();
    }

    public WeighbridgeReading getReadingById(Integer id) {

        return weighbridgeReadingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Weighbridge reading not found with ID: "
                                        + id));
    }

    @Transactional
    public void deleteReading(Integer id) {
        WeighbridgeReading reading = weighbridgeReadingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Weighbridge reading not found with ID: " + id));
        weighbridgeReadingRepository.delete(reading);
    }
}
