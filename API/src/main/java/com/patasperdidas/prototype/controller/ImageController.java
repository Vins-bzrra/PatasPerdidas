package com.patasperdidas.prototype.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/imagens")
public class ImageController {

	@Value("file:uploads/")
	private Resource uploadDir;
	
	@Value("file:uploads/Profiles/")
	private Resource uploadProfile;

	@GetMapping("/{nomeArquivo:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String nomeArquivo) {
        try {
            Resource resource = uploadDir.createRelative(nomeArquivo);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, "image/*")
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
	
	@GetMapping("/profile/{nomeArquivo:.+}")
    public ResponseEntity<Resource> getProfileImage(@PathVariable String nomeArquivo) {
        try {
            Resource resource = uploadProfile.createRelative(nomeArquivo);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, "image/*")
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
}