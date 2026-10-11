package smart_port_management.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import smart_port_management.entity.Account;
import smart_port_management.entity.AccountType;
import smart_port_management.entity.JournalEntry;
import smart_port_management.repository.AccountRepository;
import smart_port_management.repository.JournalEntryRepository;

@Service
public class BalanceSheetService {

    private final AccountRepository accountRepository;
    private final JournalEntryRepository journalEntryRepository;

    public BalanceSheetService(
            AccountRepository accountRepository,
            JournalEntryRepository journalEntryRepository) {

        this.accountRepository = accountRepository;
        this.journalEntryRepository = journalEntryRepository;
    }

    public Map<String, Object> getBalanceSheet() {

        List<Account> accounts = accountRepository.findAll();
        List<JournalEntry> entries = journalEntryRepository.findAll();

        double totalAssets = 0.0;
        double totalLiabilities = 0.0;
        double totalEquity = 0.0;

        for (JournalEntry entry : entries) {

            Account account = accountRepository
                    .findById(entry.getAccountId())
                    .orElse(null);

            if (account == null) {
                continue;
            }

            double debit = entry.getDebit() == null ? 0.0 : entry.getDebit();
            double credit = entry.getCredit() == null ? 0.0 : entry.getCredit();

            if (account.getAccountType() == AccountType.ASSET) {
                totalAssets += debit - credit;
            }

            else if (account.getAccountType() == AccountType.LIABILITY) {
                totalLiabilities += credit - debit;
            }

            else if (account.getAccountType() == AccountType.EQUITY) {
                totalEquity += credit - debit;
            }
        }

        Map<String, Object> report = new HashMap<>();

        report.put("totalAssets", totalAssets);
        report.put("totalLiabilities", totalLiabilities);
        report.put("totalEquity", totalEquity);

        return report;
    }
}