package smart_port_management.dto;

import java.util.List;

public class JournalRequest {

    private String journalType;
    private String referenceType;
    private Integer referenceId;
    private String description;
    private List<JournalEntryRequest> entries;

    public String getJournalType() {
        return journalType;
    }

    public void setJournalType(String journalType) {
        this.journalType = journalType;
    }

    public String getReferenceType() {
        return referenceType;
    }

    public void setReferenceType(String referenceType) {
        this.referenceType = referenceType;
    }

    public Integer getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(Integer referenceId) {
        this.referenceId = referenceId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<JournalEntryRequest> getEntries() {
        return entries;
    }

    public void setEntries(List<JournalEntryRequest> entries) {
        this.entries = entries;
    }
}