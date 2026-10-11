package smart_port_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import smart_port_management.entity.JournalEntry;
import smart_port_management.repository.JournalEntryRepository;

@Service
public class JournalEntryService {

    private final JournalEntryRepository journalEntryRepository;

    public JournalEntryService(
            JournalEntryRepository journalEntryRepository) {
        this.journalEntryRepository = journalEntryRepository;
    }

    public List<JournalEntry> getAllEntries() {
        return journalEntryRepository.findAll();
    }

    public List<JournalEntry> getEntriesByJournalId(Integer journalId) {
        return journalEntryRepository.findByJournalId(journalId);
    }

    public JournalEntry getEntryById(Integer id) {
        return journalEntryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Journal entry not found with ID: " + id));
    }
}