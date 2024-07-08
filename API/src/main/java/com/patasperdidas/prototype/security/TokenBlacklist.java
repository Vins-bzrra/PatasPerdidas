package com.patasperdidas.prototype.security;

import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Component;

@Component
public class TokenBlacklist {
	private Set<String> invalidatedTokens = new HashSet<>();

	public void invalidateToken(String token) {
		invalidatedTokens.add(token);
	}

	public boolean isTokenInvalidated(String token) {
		return invalidatedTokens.contains(token);
	}
}
