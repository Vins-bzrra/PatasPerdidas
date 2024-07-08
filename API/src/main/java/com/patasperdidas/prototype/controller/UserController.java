package com.patasperdidas.prototype.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.patasperdidas.prototype.entities.Publication;
import com.patasperdidas.prototype.entities.User;
import com.patasperdidas.prototype.security.TokenBlacklist;
import com.patasperdidas.prototype.services.AdminService;
import com.patasperdidas.prototype.services.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserService userService;

	@Autowired
	private AdminService adminService;

	@Autowired
	private TokenBlacklist tokenBlacklist;

	@PostMapping("/register")
	public ResponseEntity<?> registerUser(MultipartHttpServletRequest request) {
		try {
	        String token = userService.registerUser(request);
	        return ResponseEntity.ok(token);
	    } catch (RuntimeException e) {
	        return ResponseEntity.badRequest().body("Cadastro não concluído: " + e.getMessage());
	    }
	}

	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@RequestBody UserData userLoginRequest) {
		try {
			String token = userService.loginUser(userLoginRequest.getEmail(), userLoginRequest.getPassword());
			return ResponseEntity.ok(token);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Email ou senha inválidos");
		}
	}

	@GetMapping("/user")
	public ResponseEntity<?> getUser(@RequestHeader("Authorization") String token) {

		User user = userService.getUserFromToken(token);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado!");
		}
		List<Publication> publications = user.getPublication();
		Map<String, Object> response = new HashMap<>();
		response.put("user", user);
		response.put("publications", publications);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/user/{id}")
	public ResponseEntity<?> getAnotherUser(@PathVariable long id) {

		User user = userService.getUserById(id);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado!");
		}
		List<Publication> publications = user.getPublication();
		Map<String, Object> response = new HashMap<>();
		response.put("user", user);
		response.put("publications", publications);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/search/{arroba}")
	public ResponseEntity<List<User>> searchUsersByArroba(@PathVariable String arroba) {
		try {
			List<User> users = userService.searchUserByArroba(arroba);
			return ResponseEntity.ok(users);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(null);
		}
	}

	@PutMapping("/update")
	public ResponseEntity<?> updateInfos(MultipartHttpServletRequest request,
			@RequestHeader("Authorization") String token) {
		try {
			User user = userService.getUserFromToken(token);
			HttpStatus status = userService.updateInfosUser(request, user);

			if (status == HttpStatus.CREATED) {
				return ResponseEntity.status(HttpStatus.OK).body("Dado atualizado com sucesso");
			} else if (status == HttpStatus.SERVICE_UNAVAILABLE) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("O arroba informado não está disponível");
			} else {
				return ResponseEntity.internalServerError().build();
			}
		} catch (Exception e) {
			return ResponseEntity.internalServerError().build();
		}
	}

	@PutMapping("/update/data")
	public ResponseEntity<?> updateData(@RequestBody UserData userData, @RequestHeader("Authorization") String token) {
		try {
			User user = userService.getUserFromToken(token);

			HttpStatus status = userService.updateDataUser(userData.getEmail(), userData.getPassword(), user);

			if (status == HttpStatus.CREATED) {
				return ResponseEntity.status(HttpStatus.OK).body("Dado atualizado com sucesso");
			} else {
				return ResponseEntity.internalServerError().build();
			}
		} catch (Exception e) {
			return ResponseEntity.internalServerError().build();
		}
	}

	@PostMapping("/logout")
	public ResponseEntity<String> logoutUser(@RequestHeader("Authorization") String token) {
		try {
			tokenBlacklist.invalidateToken(token);
			boolean tokensInva = tokenBlacklist.isTokenInvalidated(token);
			return ResponseEntity.ok("Logout realizado com sucesso");
		} catch (Exception e) {
			return ResponseEntity.internalServerError().build();
		}
	}

	@DeleteMapping("/delete")
	public ResponseEntity<?> deleteUser(@RequestHeader("Authorization") String token) {
		try {
			User user = userService.getUserFromToken(token);

			HttpStatus status = userService.userDelete(user);

			if (status == HttpStatus.OK) {
				tokenBlacklist.invalidateToken(token);
				return ResponseEntity.status(HttpStatus.OK).body("Usuário deletado com sucesso");
			} else {
				return ResponseEntity.internalServerError().build();
			}
		} catch (Exception e) {
			return ResponseEntity.internalServerError().build();
		}
	}

	@PostMapping("/admin/register")
	public ResponseEntity<?> registerOng(MultipartHttpServletRequest request) {

		try {
			HttpStatus status = adminService.register(request);
			return ResponseEntity.status(status).body("Usuário cadastrado com sucesso");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Ocorreu um erro ao cadastrar o usuário");
		}

	}

	@PostMapping("/admin/login")
	public ResponseEntity<?> loginAdmin(@RequestBody UserData userData) {
		try {
			String token = adminService.login(userData.getEmail(), userData.getPassword());
			return ResponseEntity.ok(token);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Email ou senha inválidos");
		}
	}

	@PostMapping("/reset")
	public ResponseEntity<?> resetPassword(@RequestBody ResetPassword resetPassword) {
		try {
			String email = resetPassword.getEmail();
			String lastName = resetPassword.getLastName();
			
			String newPassword = userService.resetPasswordUser(email, lastName);
			return ResponseEntity.ok(newPassword);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}

	}

	private static class ResetPassword {

		private String email;
		private String lastName;

		public String getEmail() {
			return email;
		}

		public String getLastName() {
			return lastName;
		}
	}

	private static class UserData {

		private String email;
		private String password;

		public String getEmail() {
			return email;
		}

		public String getPassword() {
			return password;
		}

	}
}
