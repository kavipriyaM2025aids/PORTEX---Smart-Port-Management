package smart_port_management.service;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import smart_port_management.entity.Gate;
import smart_port_management.repository.GateRepository;

@Service
public class GateService {

    private final GateRepository gateRepository;

    public GateService(GateRepository gateRepository) {
        this.gateRepository = gateRepository;
    }

    public Gate createGate(Gate gate) {
        return gateRepository.save(gate);
    }

    public List<Gate> getAllGates() {
        return gateRepository.findAll();
    }

    public Gate getGateById(Integer id) {
        return gateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gate not found with ID: " + id));
    }

    @Transactional
    public void deleteGate(Integer id) {
        Gate gate = gateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gate not found with ID: " + id));
        gateRepository.delete(gate);
    }
}
