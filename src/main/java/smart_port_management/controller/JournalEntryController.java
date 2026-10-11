package smart_port_management.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import smart_port_management.entity.JournalEntry;
import smart_port_management.service.JournalEntryService;

@RestController
@RequestMapping("/api/port/journal-entries")
public class JournalEntryController {

    private final JournalEntryService journalEntryService;

    public JournalEntryController(
            JournalEntryService journalEntryService) {
        this.journalEntryService = journalEntryService;
    }

    @GetMapping
    public ResponseEntity<List<JournalEntry>> getAllEntries() {
        return ResponseEntity.ok(
                journalEntryService.getAllEntries());
    }

    @GetMapping("/journal/{journalId}")
    public ResponseEntity<List<JournalEntry>> getEntriesByJournalId(
            @PathVariable Integer journalId) {

        return ResponseEntity.ok(
                journalEntryService.getEntriesByJournalId(journalId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JournalEntry> getEntryById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                journalEntryService.getEntryById(id));
    }
}