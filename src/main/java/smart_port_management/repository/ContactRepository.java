package smart_port_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import smart_port_management.entity.Contact;

public interface ContactRepository extends JpaRepository<Contact, Integer> {
}