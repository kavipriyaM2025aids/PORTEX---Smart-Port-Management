package smart_port_management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smart_port_management.dto.LoginRequest;
import smart_port_management.dto.LoginResponse;
import smart_port_management.entity.User;
import smart_port_management.repository.UserRepository;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Or configure properly based on existing setup
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        Optional<User> opt = userRepository.findByUsername(req.getUsername());
        if (opt.isPresent()) {
            User user = opt.get();
            if (user.getPassword().equals(req.getPassword())) {
                return ResponseEntity.ok(new LoginResponse(true, user.getUsername(), user.getRole(), "Login successful"));
            }
        }
        return ResponseEntity.status(401).body(new LoginResponse(false, null, null, "Invalid credentials"));
    }
}
