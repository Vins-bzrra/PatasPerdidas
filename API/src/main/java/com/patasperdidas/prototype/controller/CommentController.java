package com.patasperdidas.prototype.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.patasperdidas.prototype.entities.Comment;
import com.patasperdidas.prototype.entities.Publication;
import com.patasperdidas.prototype.entities.User;
import com.patasperdidas.prototype.services.CommentService;
import com.patasperdidas.prototype.services.PublicationService;
import com.patasperdidas.prototype.services.UserService;

@RestController
@RequestMapping("/api/posts/comment")
public class CommentController {

	@Autowired
	 private UserService userService;
	
	@Autowired
	private CommentService commentService;
	
	@Autowired
	private PublicationService publicationService;
	
	 @PostMapping
	    public ResponseEntity<?> createComment(@RequestBody Comment comment, @RequestHeader("Authorization") String token, @RequestHeader("Publication-Id") Long publicationId) {
	    	try {
	    		
	    		User user = userService.getUserFromToken(token);
	            if (user == null) {
	            	return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado!");
	            }
	    		
	            Publication publication = publicationService.findById(publicationId);
	            if (publication == null) {
	            	return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Publicação não encontrado!");
	            }
	            
		        Comment newcomment = commentService.createComment(comment, user, publication);
		        
		        return ResponseEntity.ok(newcomment);
	    	}catch (Exception e) {
	            return ResponseEntity.badRequest().body("Falha ao criar o comentário");
			}
	    	
	    	
	    }
}
