package smart_port_management.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import smart_port_management.entity.User;
import smart_port_management.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create users table if it doesn't exist
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS users (" +
                "id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                "username VARCHAR(50) UNIQUE NOT NULL, " +
                "password VARCHAR(100) NOT NULL, " +
                "role VARCHAR(50) NOT NULL" +
                ")");

        // Insert admin user if not exists
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("admin123");
            admin.setRole("ADMIN");
            userRepository.save(admin);
        }

        // Insert accountant user if not exists
        if (userRepository.findByUsername("accountant").isEmpty()) {
            User acc = new User();
            acc.setUsername("accountant");
            acc.setPassword("accountant123");
            acc.setRole("ACCOUNTANT");
            userRepository.save(acc);
        }
    }
}
