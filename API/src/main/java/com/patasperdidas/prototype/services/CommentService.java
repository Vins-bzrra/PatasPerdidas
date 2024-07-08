package com.patasperdidas.prototype.services;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.patasperdidas.prototype.entities.Comment;
import com.patasperdidas.prototype.entities.Publication;
import com.patasperdidas.prototype.entities.User;
import com.patasperdidas.prototype.repositories.CommentRepository;

@Service
public class CommentService {

	private static final int MAX_TEXT_LENGTH = 280;
	
	@Autowired
	private CommentRepository commentRepository;
	
	public Comment createComment(Comment comment, User user, Publication publication) throws Exception {

		if (comment.getText() == null || comment.getText().isEmpty()
				|| comment.getText().length() > MAX_TEXT_LENGTH) {
			throw new IllegalArgumentException(
					"O texto da publicação deve ser fornecido e ter no máximo " + MAX_TEXT_LENGTH + " caracteres.");
		}
		
		comment.setUser(user);
		comment.setPublication(publication);
		comment.setDate(LocalDateTime.now());
		
		commentRepository.save(comment);
		return comment;
	}
}
