package smart_port_management.service;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import smart_port_management.entity.AnalyticAccount;
import smart_port_management.repository.AnalyticAccountRepository;

@Service
public class AnalyticAccountService {

    private final AnalyticAccountRepository repository;

    public AnalyticAccountService(
            AnalyticAccountRepository repository) {
        this.repository = repository;
    }

    public List<AnalyticAccount> getAllAnalyticAccounts() {
        return repository.findAll();
    }

    public AnalyticAccount getAnalyticAccountById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Analytic Account not found with ID: " + id));
    }

    @Transactional
    public void deleteAnalyticAccount(Integer id) {
        AnalyticAccount analyticAccount = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Analytic Account not found with ID: " + id));
        repository.delete(analyticAccount);
    }
}
