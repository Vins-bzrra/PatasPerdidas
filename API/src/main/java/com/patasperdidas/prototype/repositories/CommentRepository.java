package com.patasperdidas.prototype.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.patasperdidas.prototype.entities.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

}
