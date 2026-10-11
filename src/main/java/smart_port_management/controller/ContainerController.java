package smart_port_management.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import smart_port_management.entity.Container;
import smart_port_management.service.ContainerService;

@RestController
@RequestMapping("/api/port/containers")
public class ContainerController {

    private final ContainerService containerService;

    public ContainerController(ContainerService containerService) {
        this.containerService = containerService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Container createContainer(@RequestBody Container container) {
        return containerService.createContainer(container);
    }

    @GetMapping
    public List<Container> getAllContainers() {
        return containerService.getAllContainers();
    }

    @GetMapping("/{id}")
    public Container getContainerById(@PathVariable Integer id) {
        return containerService.getContainerById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteContainer(@PathVariable Integer id) {
        containerService.deleteContainer(id);
        return ResponseEntity.ok(Map.of("message", "Record deleted successfully."));
    }
}
