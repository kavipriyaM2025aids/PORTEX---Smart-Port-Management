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
public class ReportService {

    private final AccountRepository accountRepository;
    private final JournalEntryRepository journalEntryRepository;

    public ReportService(
            AccountRepository accountRepository,
            JournalEntryRepository journalEntryRepository) {

        this.accountRepository = accountRepository;
        this.journalEntryRepository = journalEntryRepository;
    }

    public Map<String, Object> getProfitAndLoss() {

        List<Account> accounts = accountRepository.findAll();
        List<JournalEntry> entries = journalEntryRepository.findAll();

        double totalRevenue = 0.0;
        double totalExpense = 0.0;

        for (JournalEntry entry : entries) {

            Account account = accountRepository
                    .findById(entry.getAccountId())
                    .orElse(null);

            if (account == null) {
                continue;
            }

            double debit = entry.getDebit() == null ? 0.0 : entry.getDebit();
            double credit = entry.getCredit() == null ? 0.0 : entry.getCredit();

            if (account.getAccountType() == AccountType.INCOME) {
                totalRevenue += credit - debit;
            }

            if (account.getAccountType() == AccountType.EXPENSE) {
                totalExpense += debit - credit;
            }
        }

        double netProfitOrLoss = totalRevenue - totalExpense;

        Map<String, Object> report = new HashMap<>();

        report.put("totalRevenue", totalRevenue);
        report.put("totalExpense", totalExpense);
        report.put("netProfitOrLoss", netProfitOrLoss);

        return report;
    }
}