package smart_port_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import smart_port_management.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    Product findByProductName(String productName);

}