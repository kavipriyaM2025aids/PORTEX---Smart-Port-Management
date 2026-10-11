package smart_port_management.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import smart_port_management.dto.JournalEntryRequest;
import smart_port_management.dto.JournalRequest;
import smart_port_management.entity.Journal;
import smart_port_management.entity.JournalEntry;
import smart_port_management.entity.JournalType;
import smart_port_management.repository.AccountRepository;
import smart_port_management.repository.JournalEntryRepository;
import smart_port_management.repository.JournalRepository;

@Service
public class JournalPostingService {

    private final JournalRepository journalRepository;
    private final JournalEntryRepository journalEntryRepository;
    private final AccountRepository accountRepository;

    public JournalPostingService(
            JournalRepository journalRepository,
            JournalEntryRepository journalEntryRepository,
            AccountRepository accountRepository) {

        this.journalRepository = journalRepository;
        this.journalEntryRepository = journalEntryRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional
    public Journal createJournal(JournalRequest request) {

        if (request.getEntries() == null ||
                request.getEntries().isEmpty()) {
            throw new RuntimeException("Journal entries are required");
        }

        double totalDebit = 0.0;
        double totalCredit = 0.0;

        for (JournalEntryRequest entry : request.getEntries()) {

            if (entry.getAccountId() == null) {
                throw new RuntimeException("Account ID is required");
            }

            accountRepository.findById(entry.getAccountId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Account not found: "
                                            + entry.getAccountId()));

            double debit = entry.getDebit() == null
                    ? 0.0 : entry.getDebit();

            double credit = entry.getCredit() == null
                    ? 0.0 : entry.getCredit();

            if (debit > 0 && credit > 0) {
                throw new RuntimeException(
                        "An entry cannot have both debit and credit");
            }

            if (debit <= 0 && credit <= 0) {
                throw new RuntimeException(
                        "Debit or credit amount is required");
            }

            totalDebit += debit;
            totalCredit += credit;
        }

        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            throw new RuntimeException(
                    "Journal is not balanced. Debit = "
                            + totalDebit
                            + ", Credit = "
                            + totalCredit);
        }

        Journal journal = new Journal();

        journal.setJournalType(
                JournalType.valueOf(request.getJournalType()));

        journal.setReferenceType(request.getReferenceType());
        journal.setReferenceId(request.getReferenceId());
        journal.setDescription(request.getDescription());

        Journal savedJournal = journalRepository.save(journal);

        for (JournalEntryRequest entry : request.getEntries()) {

            JournalEntry journalEntry = new JournalEntry();

            journalEntry.setJournalId(
                    savedJournal.getJournalId());

            journalEntry.setAccountId(
                    entry.getAccountId());

            journalEntry.setDebit(
                    entry.getDebit() == null
                            ? 0.0 : entry.getDebit());

            journalEntry.setCredit(
                    entry.getCredit() == null
                            ? 0.0 : entry.getCredit());

            journalEntry.setDescription(
                    entry.getDescription());

            journalEntryRepository.save(journalEntry);
        }

        return savedJournal;
    }
}