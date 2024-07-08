package com.patasperdidas.prototype.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.patasperdidas.prototype.entities.Comment;
import com.patasperdidas.prototype.entities.Like;
import com.patasperdidas.prototype.entities.Publication;
import com.patasperdidas.prototype.entities.User;
import com.patasperdidas.prototype.repositories.CommentRepository;
import com.patasperdidas.prototype.repositories.PublicationRepository;
import com.patasperdidas.prototype.repositories.UserRepository;
import com.patasperdidas.prototype.security.AuthenticateFilter;

@Service
public class UserService {

	public static final String ATRIBUTO_PREFIXO = "Bearer ";
	public static final String TOKEN_SENHA = "463408a1-54c9-4307-bb1c-6cced559f5a7";

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private PublicationRepository publicationRepository;

	@Autowired
	private CommentRepository commentRepository;

	public String registerUser(MultipartHttpServletRequest request) {
		try {
			String nome = request.getParameter("name");
			String sobrenome = request.getParameter("lastName");
			String email = request.getParameter("email");
			String senha = request.getParameter("password");
			String username = request.getParameter("nameUser");
			String arroba = request.getParameter("arroba");

			MultipartFile profileImage = request.getFile("profileImage");
			String encodedPassword = passwordEncoder.encode(senha);
			User user = new User();
			user.setName(nome);
			user.setLastName(sobrenome);
			user.setPassword(encodedPassword);
			user.setNameUser(username);
			user.setVerified(false);

			if (profileImage != null && !profileImage.isEmpty()) {
				String profileImageUrl = saveProfileImage(profileImage);
				user.setProfileImage(profileImageUrl);
			}
			
			List<User> usersWithArroba = userRepository.findByArrobaContainingIgnoreCase(arroba);
		    if (!usersWithArroba.isEmpty()) {
		        throw new RuntimeException("Arroba já está em uso");
		    }
		    
		    List<User> usersWithEmail = userRepository.findByEmailContainingIgnoreCase(email);
		    if (!usersWithEmail.isEmpty()) {
		        throw new RuntimeException("Email já está em uso");
		    }
		    
		    user.setArroba(arroba);
		    user.setEmail(email);
			
			userRepository.save(user);

			String token = JWT.create().withSubject(user.getId().toString())
					.withExpiresAt(new Date(System.currentTimeMillis() + AuthenticateFilter.TOKEN_EXPIRACAO))
					.sign(Algorithm.HMAC512(AuthenticateFilter.TOKEN_SENHA));
			return token;
		} catch(RuntimeException e) {
			throw e;
		} catch (Exception e) {
			throw new RuntimeException("Falha ao registrar o usuário", e);
		}
	}

	public String loginUser(String email, String password) throws Exception {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new Exception("Usuário não encontrado"));

		if (!passwordEncoder.matches(password, user.getPassword())) {
			throw new Exception("Senha inválida");
		}

		String token = JWT.create().withSubject(user.getId().toString())
				.withExpiresAt(new Date(System.currentTimeMillis() + AuthenticateFilter.TOKEN_EXPIRACAO))
				.sign(Algorithm.HMAC512(AuthenticateFilter.TOKEN_SENHA));

		return token;
	}

	public User getUserFromToken(String token) throws JWTVerificationException {
		try {
			token = token.replace(ATRIBUTO_PREFIXO, "");
			Algorithm algorithm = Algorithm.HMAC512(TOKEN_SENHA);
			JWTVerifier verifier = JWT.require(algorithm).build();
			DecodedJWT jwt = verifier.verify(token);
			Long userId = Long.parseLong(jwt.getSubject());
			User user = userRepository.findById(userId).orElse(null);
			return user;
		} catch (JWTVerificationException e) {
			throw new IllegalArgumentException("Token inválido");
		}
	}

	public List<User> searchUserByArroba(String arroba) {
		return userRepository.findByArrobaContainingIgnoreCase(arroba);
	}

	public HttpStatus updateInfosUser(MultipartHttpServletRequest request, User user) {
		try {
			if (!request.getParameter("nameUser").isEmpty()) {
				String nameUser = request.getParameter("nameUser");
				user.setNameUser(nameUser);
			}
			if (!request.getParameter("arroba").isEmpty()) {
				String arroba = request.getParameter("arroba");
				List<User> usersWithArroba = userRepository.findByArrobaContainingIgnoreCase(arroba);
				if (!usersWithArroba.isEmpty()) {
					return HttpStatus.SERVICE_UNAVAILABLE;
				}

				user.setArroba(arroba);
			}
			if (!request.getParameter("bio").isEmpty()) {
				String bio = request.getParameter("bio");
				user.setBio(bio);
			}
			if (request.getFile("profileImage") != null && !request.getFile("profileImage").isEmpty()) {
				MultipartFile profileImage = request.getFile("profileImage");
				String profileImageUrl = saveProfileImage(profileImage);
				user.setProfileImage(profileImageUrl);
			}
			userRepository.save(user);
			return HttpStatus.CREATED;
		} catch (Exception e) {
			return HttpStatus.NOT_IMPLEMENTED;
		}
	}

	public HttpStatus updateDataUser(String email, String password, User user) {
		try {
			if (!email.isEmpty()) {
				user.setEmail(email);
			}
			if (!password.isEmpty()) {
				String encodedPassword = passwordEncoder.encode(password);
				user.setPassword(encodedPassword);
			}

			userRepository.save(user);
			return HttpStatus.CREATED;
		} catch (Exception e) {
			return HttpStatus.NOT_IMPLEMENTED;
		}
	}
	
	@Transactional
	public HttpStatus userDelete(User user) {
		try {
			List<Publication> publications = user.getPublication();
			List<Comment> comments = user.getComment();
			List<Like> userLikes = user.getLikes();

			for (Publication publication : publications) {
				publicationRepository.delete(publication);
			}

			for (Comment comment : comments) {
				commentRepository.delete(comment);
			}

			for (Like like : userLikes) {
				Publication publication = like.getPublication();

				publication.getLikesList().remove(like);
				publication.setLikesCount(publication.getLikesCount() - 1);
				publicationRepository.save(publication);
			}

			userRepository.delete(user);
			return HttpStatus.OK;
		} catch (Exception e) {
			return HttpStatus.INTERNAL_SERVER_ERROR;
		}

	}

	public User getUserById(Long userId) {
		return userRepository.findById(userId).orElse(null);

	}
	
	public String resetPasswordUser(String email, String lastName) {
		try {
			User user = userRepository.findByEmail(email).orElseThrow(() -> new Exception("Usuário não encontrado"));
			String newPassword = "";

			if (user != null && user.getLastName().equals(lastName)) {
				Random random = new Random();

				for (int i = 0; i < 8; i++) {
					int randomNumber = random.nextInt(9) + 1;
					newPassword += randomNumber;
				}
				String encodedPassword = passwordEncoder.encode(newPassword);
				user.setPassword(encodedPassword);
				userRepository.save(user);
			}
			return newPassword;
		} catch (Exception e) {
			throw new IllegalArgumentException("Não foi possivel resetar a senha");
		}
	}

	private String saveProfileImage(MultipartFile profileImage) throws IOException {
		if (!profileImage.isEmpty()) {
			String nomeArquivo = UUID.randomUUID().toString() + "-" + profileImage.getOriginalFilename();
			Path filePath = Paths.get("uploads/Profiles", nomeArquivo);
			Files.copy(profileImage.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
			return filePath.toString();
		}
		return null;
	}

}
