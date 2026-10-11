package smart_port_management.service;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import smart_port_management.entity.Contact;
import smart_port_management.repository.ContactRepository;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    public Contact createContact(Contact contact) {
        return contactRepository.save(contact);
    }

    public Contact getContactById(Integer id) {
        return contactRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Contact not found with ID: " + id));
    }

    @Transactional
    public void deleteContact(Integer id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Contact not found with ID: " + id));
        contactRepository.delete(contact);
    }
}
