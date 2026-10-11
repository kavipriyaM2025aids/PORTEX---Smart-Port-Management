package smart_port_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import smart_port_management.entity.AnalyticAccount;

public interface AnalyticAccountRepository
        extends JpaRepository<AnalyticAccount, Integer> {
}