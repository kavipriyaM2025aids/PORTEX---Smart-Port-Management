package smart_port_management.service;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import smart_port_management.entity.GateEntry;
import smart_port_management.repository.GateEntryRepository;

@Service
public class GateEntryService {

    private final GateEntryRepository gateEntryRepository;

    public GateEntryService(GateEntryRepository gateEntryRepository) {
        this.gateEntryRepository = gateEntryRepository;
    }

    public GateEntry createGateEntry(GateEntry gateEntry) {
        return gateEntryRepository.save(gateEntry);
    }

    public List<GateEntry> getAllGateEntries() {
        return gateEntryRepository.findAll();
    }

    public GateEntry getGateEntryById(Integer id) {
        return gateEntryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Gate entry not found with ID: " + id));
    }

    @Transactional
    public void deleteGateEntry(Integer id) {
        GateEntry gateEntry = gateEntryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Gate entry not found with ID: " + id));
        gateEntryRepository.delete(gateEntry);
    }
}
