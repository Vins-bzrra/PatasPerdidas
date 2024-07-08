package com.patasperdidas.prototype.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageService {

	@Value("file:uploads/")
	private Resource uploadDir;

	public String salvarImagem(MultipartFile imagem) throws IOException {
		String nomeArquivo = imagem.getOriginalFilename();
		Path filePath = uploadDir.getFile().toPath().resolve(nomeArquivo);
		Files.copy(imagem.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
		return nomeArquivo;
	}
}