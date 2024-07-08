package com.patasperdidas.prototype.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.patasperdidas.prototype.entities.Publication;

@Repository
public interface PublicationRepository extends JpaRepository<Publication, Long> {
	
	Optional<Publication> findById(Long id);
	
	List<Publication> findAllByOrderByDateDesc();
}
