package smart_port_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import smart_port_management.entity.Budget;

public interface BudgetRepository extends JpaRepository<Budget, Integer> {
}