package smart_port_management.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import smart_port_management.entity.WeighbridgeReading;
import smart_port_management.service.WeighbridgeReadingService;

@RestController
@RequestMapping("/api/port/weighbridge-readings")
public class WeighbridgeReadingController {

    private final WeighbridgeReadingService weighbridgeReadingService;

    public WeighbridgeReadingController(
            WeighbridgeReadingService weighbridgeReadingService) {
        this.weighbridgeReadingService = weighbridgeReadingService;
    }

    @PostMapping
    public ResponseEntity<WeighbridgeReading> createReading(
            @RequestParam Integer gateEntryId,
            @RequestParam String deviceId,
            @RequestParam Double weight) {

        WeighbridgeReading reading =
                weighbridgeReadingService.createReading(
                        gateEntryId,
                        deviceId,
                        weight);

        return new ResponseEntity<>(
                reading,
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<WeighbridgeReading>> getAllReadings() {

        return ResponseEntity.ok(
                weighbridgeReadingService.getAllReadings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WeighbridgeReading> getReadingById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                weighbridgeReadingService.getReadingById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteReading(@PathVariable Integer id) {
        weighbridgeReadingService.deleteReading(id);
        return ResponseEntity.ok(Map.of("message", "Record deleted successfully."));
    }
}
