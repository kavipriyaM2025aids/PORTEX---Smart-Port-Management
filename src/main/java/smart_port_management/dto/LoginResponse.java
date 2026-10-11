package smart_port_management.dto;

public class LoginResponse {
    private boolean success;
    private String username;
    private String role;
    private String message;
    
    public LoginResponse(boolean success, String username, String role, String message) {
        this.success = success;
        this.username = username;
        this.role = role;
        this.message = message;
    }
    
    public boolean isSuccess() { return success; }
    public String getUsername() { return username; }
    public String getRole() { return role; }
    public String getMessage() { return message; }
}
