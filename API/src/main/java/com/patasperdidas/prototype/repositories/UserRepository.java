package com.patasperdidas.prototype.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.patasperdidas.prototype.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);

	Optional<User> findById(Long id);
	
	List<User> findByArrobaContainingIgnoreCase(String arroba);
	
	List<User> findByEmailContainingIgnoreCase(String email);

}

