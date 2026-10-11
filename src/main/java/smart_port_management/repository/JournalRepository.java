package smart_port_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import smart_port_management.entity.Journal;
import smart_port_management.entity.JournalType;

public interface JournalRepository
        extends JpaRepository<Journal, Integer> {

    boolean existsByReferenceTypeAndReferenceIdAndJournalType(
            String referenceType,
            Integer referenceId,
            JournalType journalType);
}