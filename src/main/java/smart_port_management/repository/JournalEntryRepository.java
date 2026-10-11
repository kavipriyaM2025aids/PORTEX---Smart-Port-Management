package smart_port_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import smart_port_management.entity.JournalEntry;

public interface JournalEntryRepository
        extends JpaRepository<JournalEntry, Integer> {

    List<JournalEntry> findByJournalId(Integer journalId);
    void deleteByJournalId(Integer journalId);
}