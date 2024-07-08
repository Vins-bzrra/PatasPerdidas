package com.patasperdidas.prototype.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.patasperdidas.prototype.entities.Like;
import com.patasperdidas.prototype.entities.Publication;
import com.patasperdidas.prototype.entities.User;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
	boolean existsByUserAndPublication(User user, Publication publication);
	
	Like findByUserAndPublication(User user, Publication publication);
	
	List<Like> findByUser(User user);
}