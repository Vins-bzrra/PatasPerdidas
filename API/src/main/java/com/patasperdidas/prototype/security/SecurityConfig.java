package com.patasperdidas.prototype.security;

import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.patasperdidas.prototype.services.DetailUserServiceImpl;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	private final DetailUserServiceImpl usuarioService;
	private final PasswordEncoder passwordEncoder;
	private final TokenBlacklist tokenBlacklist;

	public SecurityConfig(DetailUserServiceImpl usuarioService, PasswordEncoder passwordEncoder, TokenBlacklist tokenBlacklist) {
		this.usuarioService = usuarioService;
		this.passwordEncoder = passwordEncoder;
		this.tokenBlacklist = tokenBlacklist;
	}

	protected void configure(HttpSecurity http) throws Exception {
		 http.authorizeRequests()
         .antMatchers(HttpMethod.POST, "/api/users/login").permitAll()
         .antMatchers(HttpMethod.POST, "/api/users/register").permitAll()
         .antMatchers(HttpMethod.POST, "/api/users/admin/login").permitAll()
         .antMatchers(HttpMethod.POST, "/api/users/reset").permitAll()
         .antMatchers(HttpMethod.GET, "/imagens/**").permitAll()
         .anyRequest().authenticated()
         .and().cors().and().csrf().disable()
         .addFilter(new AuthenticateFilter(authenticationManager()))
         .addFilter(new ValidateFilter(authenticationManager(), tokenBlacklist))
         .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
	}

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(usuarioService).passwordEncoder(passwordEncoder);
	}

}
