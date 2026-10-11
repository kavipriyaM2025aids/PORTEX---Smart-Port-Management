package smart_port_management.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import smart_port_management.entity.Gate;
import smart_port_management.service.GateService;

@RestController
@RequestMapping("/api/port/gates")
public class GateController {

    private final GateService gateService;

    public GateController(GateService gateService) {
        this.gateService = gateService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Gate createGate(@RequestBody Gate gate) {
        return gateService.createGate(gate);
    }

    @GetMapping
    public List<Gate> getAllGates() {
        return gateService.getAllGates();
    }

    @GetMapping("/{id}")
    public Gate getGateById(@PathVariable Integer id) {
        return gateService.getGateById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteGate(@PathVariable Integer id) {
        gateService.deleteGate(id);
        return ResponseEntity.ok(Map.of("message", "Record deleted successfully."));
    }
}
