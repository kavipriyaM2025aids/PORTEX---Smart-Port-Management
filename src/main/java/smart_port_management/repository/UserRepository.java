package smart_port_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import smart_port_management.entity.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
