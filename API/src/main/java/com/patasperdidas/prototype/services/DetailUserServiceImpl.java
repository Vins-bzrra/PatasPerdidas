package com.patasperdidas.prototype.services;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.patasperdidas.prototype.data.DetailUserData;
import com.patasperdidas.prototype.entities.User;
import com.patasperdidas.prototype.repositories.UserRepository;

@Component
public class DetailUserServiceImpl implements UserDetailsService{

	private final UserRepository repository;
	
	public DetailUserServiceImpl(UserRepository repository) {
		this.repository = repository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<User> usuario = repository.findByEmail(username);
		if(usuario.isEmpty()) {
			throw new UsernameNotFoundException("Usuário com o email[ " + username + "] não encontrado");
		}
		return new DetailUserData(usuario);
	}

}
