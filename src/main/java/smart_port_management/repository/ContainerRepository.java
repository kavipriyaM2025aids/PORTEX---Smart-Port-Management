package smart_port_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import smart_port_management.entity.Container;

public interface ContainerRepository extends JpaRepository<Container, Integer> {

}