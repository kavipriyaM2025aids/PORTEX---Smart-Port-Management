package smart_port_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import smart_port_management.entity.Payment;

public interface PaymentRepository
        extends JpaRepository<Payment, Integer> {
}