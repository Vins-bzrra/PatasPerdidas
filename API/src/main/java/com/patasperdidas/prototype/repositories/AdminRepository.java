package com.patasperdidas.prototype.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.patasperdidas.prototype.entities.Administrator;

@Repository
public interface AdminRepository extends JpaRepository<Administrator, Long> {

	Optional<Administrator> findByEmail(String email);

	Optional<Administrator> findById(Long id);
}
