package smart_port_management.service;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import smart_port_management.entity.Journal;
import smart_port_management.repository.JournalRepository;
import smart_port_management.repository.JournalEntryRepository;
import java.util.List;

@Service
public class JournalService {
    private final JournalRepository journalRepository;
    private final JournalEntryRepository journalEntryRepository;

    public JournalService(JournalRepository journalRepository, JournalEntryRepository journalEntryRepository) {
        this.journalRepository = journalRepository;
        this.journalEntryRepository = journalEntryRepository;
    }

    public List<Journal> getAllJournals() {
        return journalRepository.findAll();
    }

    public Journal getJournalById(Integer id) {
        return journalRepository.findById(id).orElseThrow(() -> new RuntimeException("Journal not found with ID: " + id));
    }

    @Transactional
    public void deleteJournal(Integer id) {
        Journal journal = journalRepository.findById(id).orElseThrow(() -> new RuntimeException("Journal not found with ID: " + id));
        journalEntryRepository.deleteByJournalId(id);
        journalRepository.delete(journal);
    }
}
