package com.patasperdidas.prototype.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.patasperdidas.prototype.entities.Comment;
import com.patasperdidas.prototype.entities.Publication;
import com.patasperdidas.prototype.entities.User;
import com.patasperdidas.prototype.services.PublicationService;
import com.patasperdidas.prototype.services.UserService;

@RestController
@RequestMapping("/api/posts")
public class PublicationController {

	@Autowired
	private PublicationService publicationService;

	@Autowired
	private UserService userService;

	@PostMapping("/new")
	public ResponseEntity<?> createPublication(MultipartHttpServletRequest request,
			@RequestHeader("Authorization") String token) {
		try {
			System.out.println("Entrou no createPubli (Controller)");
			User user = userService.getUserFromToken(token);
			if (user == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado!");
			}
			Publication novaPublicacao = publicationService.createPublication(request, user);
			System.out.println("Voltou do Service: " + novaPublicacao.getText());
			return ResponseEntity.status(HttpStatus.OK).body(
					"Publicação realizada com sucesso! Agora é só esperar a chuva de curtidas e comentários. 😄💥");

		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Falha ao criar a publicação");
		}

	}

	@GetMapping("/latest")
	public ResponseEntity<List<Publication>> getLatestPublications() {
		try {
			List<Publication> publications = publicationService.getLatestPublications();
			return ResponseEntity.ok(publications);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(null);
		}
	}

	@GetMapping("/id/{id}")
	public ResponseEntity<?> getPublicationById(@PathVariable Long id, @RequestHeader("Authorization") String token) {
		try {
			User user = userService.getUserFromToken(token);
			Publication publication = publicationService.findById(id);
			if (publication == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Publicação não encontrado!");
			}

			List<Comment> comments = publication.getComment();

			Map<String, Object> response = new HashMap<>();
			response.put("publication", publication);
			response.put("comments", comments);
			response.put("user", user);

			return ResponseEntity.ok(response);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Falha ao obter a publicação");
		}
	}

	@PostMapping("/{publicationId}/like")
	public ResponseEntity<?> publicationLike(@PathVariable Long publicationId,
			@RequestHeader("Authorization") String token) {
		try {
			User user = userService.getUserFromToken(token);
			int likes = publicationService.likePublication(publicationId, user);
			return ResponseEntity.ok(likes);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Falha ao curtir a publicação.");
		}
	}

	@GetMapping("/liked")
	public ResponseEntity<?> getPublicationsLiked(@RequestHeader("Authorization") String token) {
		User user = userService.getUserFromToken(token);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado!");
		}
		List<Publication> likedPublications = publicationService.likedPublications(user);
		return ResponseEntity.ok(likedPublications);
	}

	/*
	 * @PutMapping("/update/{publicationId}") public ResponseEntity<?>
	 * updatePublicationText(@PathVariable Long publicationId, @RequestBody
	 * Map<String, String> request) { try { String newText = request.get("newText");
	 * String lat= request.get("latitude"); String lon= request.get("longitude");
	 * publicationService.updateText(publicationId, newText, lat, lon); return
	 * ResponseEntity.ok("A publicação foi atualizada com sucesso."); } catch
	 * (Exception e) { return ResponseEntity.internalServerError().build(); }
	 * 
	 * }
	 */

	@PutMapping("/update/{publicationId}")
	public ResponseEntity<?> updatePublicationText(@PathVariable Long publicationId,
			MultipartHttpServletRequest request) {
		try {
			System.out.println("Entrou no updatePubli (controller)");
			String newText = request.getParameter("newText");
			System.out.println("(controller) newtext: " + newText);
			String lat = request.getParameter("latitude");
			System.out.println("(controller) lat: " + lat);
			String lon = request.getParameter("longitude");
			System.out.println("(controller) lon: " + lon);
			publicationService.updateText(publicationId, newText, lat, lon);
			return ResponseEntity.ok("A publicação foi atualizada com sucesso.");
		} catch (Exception e) {
			return ResponseEntity.internalServerError().build();
		}

	}

	@DeleteMapping("/delete/{publicationId}")
	public ResponseEntity<?> deletePublication(@PathVariable Long publicationId, @RequestHeader("Authorization") String token) {
		try {
			User user = userService.getUserFromToken(token);

			publicationService.deletePublication(publicationId);

			return ResponseEntity.status(HttpStatus.OK).body("Postagem deletada com sucesso");
		} catch (Exception e) {
			return ResponseEntity.internalServerError().build();
		}

	}

}
