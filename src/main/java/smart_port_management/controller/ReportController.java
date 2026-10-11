package smart_port_management.controller; 
 
import java.util.Map; 
 
import org.springframework.web.bind.annotation.GetMapping; 
import org.springframework.web.bind.annotation.RequestMapping; 
import org.springframework.web.bind.annotation.RestController; 
 
import smart_port_management.service.ReportService; 
 
@RestController 
@RequestMapping("/api/port/reports") 
public class ReportController { 
 
    private final ReportService reportService; 
 
    public ReportController(ReportService reportService) { 
        this.reportService = reportService; 
    } 
 
    @GetMapping("/profit-loss") 
    public Map<String, Object> getProfitAndLoss() { 
        return reportService.getProfitAndLoss(); 
    } 
}
