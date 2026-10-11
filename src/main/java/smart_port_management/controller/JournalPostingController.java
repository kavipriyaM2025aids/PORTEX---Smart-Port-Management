package smart_port_management.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import smart_port_management.dto.JournalRequest;
import smart_port_management.entity.Journal;
import smart_port_management.service.JournalPostingService;

@RestController
@RequestMapping("/api/port/journal-posting")
public class JournalPostingController {

    private final JournalPostingService journalPostingService;

    public JournalPostingController(
            JournalPostingService journalPostingService) {
        this.journalPostingService = journalPostingService;
    }

    @PostMapping
    public ResponseEntity<Journal> createJournal(
            @RequestBody JournalRequest request) {

        return ResponseEntity.ok(
                journalPostingService.createJournal(request));
    }
}