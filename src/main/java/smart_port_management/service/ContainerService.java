package smart_port_management.service;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import smart_port_management.entity.Container;
import smart_port_management.repository.ContainerRepository;

@Service
public class ContainerService {

    private final ContainerRepository containerRepository;

    public ContainerService(ContainerRepository containerRepository) {
        this.containerRepository = containerRepository;
    }

    public Container createContainer(Container container) {
        return containerRepository.save(container);
    }

    public List<Container> getAllContainers() {
        return containerRepository.findAll();
    }

    public Container getContainerById(Integer id) {
        return containerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Container not found with ID: " + id));
    }

    @Transactional
    public void deleteContainer(Integer id) {
        Container container = containerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Container not found with ID: " + id));
        containerRepository.delete(container);
    }
}
