package com.patasperdidas.prototype.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.patasperdidas.prototype.entities.Administrator;
import com.patasperdidas.prototype.entities.User;
import com.patasperdidas.prototype.repositories.AdminRepository;
import com.patasperdidas.prototype.repositories.UserRepository;
import com.patasperdidas.prototype.security.AuthenticateFilter;

@Service
public class AdminService {

	@Autowired
	private AdminRepository adminRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public String login(String email, String password) throws Exception {
		try {
			Administrator admin = adminRepository.findByEmail(email)
					.orElseThrow(() -> new Exception("Usuário não encontrado"));

			System.out.println("(AdminService) loginAdmin admin: " + admin.getEmail());
			if (!passwordEncoder.matches(password, admin.getPassword())) {
				throw new Exception("Senha inválida");
			}
			if (!"ADMIN".equals(admin.getRole()) || admin.getRole().isEmpty()) {
				throw new Exception("Usuário não autorizado");
			}

			String token = JWT.create().withSubject(admin.getEmail())
					.withExpiresAt(new Date(System.currentTimeMillis() + AuthenticateFilter.TOKEN_EXPIRACAO))
					.sign(Algorithm.HMAC512(AuthenticateFilter.TOKEN_SENHA));

			return token;
		} catch (Exception e) {
			throw new Exception("Erro ao fazer login");
		}

	}

	public HttpStatus register(MultipartHttpServletRequest request) {
		try {
			String nome = request.getParameter("name");
			String email = request.getParameter("email");
			String senha = request.getParameter("password");
			String username = request.getParameter("nameUser");
			String arroba = request.getParameter("arroba");

			MultipartFile profileImage = request.getFile("profileImage");
			String encodedPassword = passwordEncoder.encode(senha);
			User user = new User();
			user.setName(nome);
			// user.setEmail(email);
			user.setPassword(encodedPassword);
			user.setNameUser(username);
			// user.setArroba(arroba);
			user.setVerified(true);

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
				System.out.println("Entrou no if do email");
				throw new RuntimeException("Email já está em uso");
			}

			user.setArroba(arroba);
			user.setEmail(email);

			userRepository.save(user);

			return HttpStatus.OK;
		} catch (RuntimeException e) {
			throw e;
		} catch (Exception e) {
			throw new RuntimeException("Falha ao registrar o usuário", e);
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
