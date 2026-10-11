package smart_port_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import smart_port_management.entity.Gate;

public interface GateRepository extends JpaRepository<Gate, Integer> {

}