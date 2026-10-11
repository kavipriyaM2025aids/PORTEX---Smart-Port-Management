package smart_port_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import smart_port_management.entity.WeighbridgeReading;

public interface WeighbridgeReadingRepository
        extends JpaRepository<WeighbridgeReading, Integer> {
}