package com.patasperdidas.prototype.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.patasperdidas.prototype.entities.Like;
import com.patasperdidas.prototype.entities.Publication;
import com.patasperdidas.prototype.entities.User;
import com.patasperdidas.prototype.repositories.LikeRepository;
import com.patasperdidas.prototype.repositories.PublicationRepository;
import com.patasperdidas.prototype.util.Location;

@Service
public class PublicationService {
	private static final int MAX_IMAGES = 4;
	private static final int MAX_TEXT_LENGTH = 280;

	@Autowired
	private PublicationRepository publicationRepository;

	@Autowired
	private LikeRepository likeRepository;

	public Publication createPublication(MultipartHttpServletRequest request, User user) throws Exception {
		System.out.println("Entrou no createPubli");
		Publication publication = new Publication();
		Location location = new Location();

		publication.setText(request.getParameter("text"));

		List<MultipartFile> images = request.getFiles("images");
		if (images != null && !images.isEmpty()) {
			List<String> imageUrls = saveImages(images);
			publication.setImg(imageUrls);
		}

		if (publication.getText() == null || publication.getText().isEmpty()
				|| publication.getText().length() > MAX_TEXT_LENGTH) {
			throw new IllegalArgumentException(
					"O texto da publicação deve ser fornecido e ter no máximo " + MAX_TEXT_LENGTH + " caracteres.");
		}

		if (publication.getImg() != null && publication.getImg().size() > MAX_IMAGES) {
			throw new IllegalArgumentException("O número máximo de imagens permitido é " + MAX_IMAGES + ".");
		}

//		if ((request.getParameter("latitude") != null || !request.getParameter("latitude").isBlank())
//				&& (request.getParameter("longitude") != null || !request.getParameter("longitude").isBlank())) {
//			
//			
//			location.setLatitude(Double.parseDouble(request.getParameter("latitude")));
//			location.setLongitude(Double.parseDouble(request.getParameter("longitude")));
//			publication.setLocation(location);
//		}

		publication.setLikesCount(0);
		publication.setUser(user);
		publication.setDate(LocalDateTime.now());
		System.out.println("Vai adicionar o location");
		location.setLatitude(Double.parseDouble(request.getParameter("latitude")));
		location.setLongitude(Double.parseDouble(request.getParameter("longitude")));
		System.out.println("location: " + location.getLatitude() + "/" + location.getLongitude());
		publication.setLocation(location);
		publicationRepository.save(publication);
		System.out.println("Salvou Publi");
		return publication;
	}

	public Publication findById(Long id) {
		return publicationRepository.findById(id).orElse(null);
	}

	public List<Publication> getLatestPublications() {
		return publicationRepository.findAllByOrderByDateDesc();
	}

	public int likePublication(Long publicationId, User user) throws Exception {
		try {
			Publication publication = publicationRepository.findById(publicationId).orElse(null);

			if (publication == null) {
				throw new IllegalArgumentException("Publicação não encontrada.");
			}

			Like existingLike = likeRepository.findByUserAndPublication(user, publication);

			if (existingLike != null) {
				likeRepository.delete(existingLike);
				publication.getLikesList().remove(existingLike);

				publication.setLikesCount(publication.getLikesCount() - 1);
			} else {
				Like newLike = new Like();
				newLike.setUser(user);
				newLike.setPublication(publication);
				likeRepository.save(newLike);

				publication.getLikesList().add(newLike);

				publication.setLikesCount(publication.getLikesCount() + 1);
			}

			publicationRepository.save(publication);

			int likes = publication.getLikesCount();
			return likes;
		} catch (Exception e) {
			throw new RuntimeException("Falha ao curtir a publicação ", e);
		}

	}

	public List<Publication> likedPublications(User user) {
		List<Like> likes = likeRepository.findByUser(user);
		return likes.stream().map(Like::getPublication).collect(Collectors.toList());
	}

	public void updateText(Long publicationId, String newText, String lat, String lon) {
		try {
			Publication publication = publicationRepository.findById(publicationId).orElse(null);
			Location location = new Location();
			if (publication == null) {
				throw new IllegalArgumentException("Publicação não encontrada.");
			}
			if (newText.length() > MAX_TEXT_LENGTH) {
				throw new IllegalArgumentException(
						"O texto da publicação deve ser fornecido e ter no máximo " + MAX_TEXT_LENGTH + " caracteres.");
			}
			if(!(newText == null) && !(newText.isBlank())) {
				publication.setText(newText);
			}
			
			publication.setDate(LocalDateTime.now());
			location.setLatitude(Double.parseDouble(lat));
			location.setLongitude(Double.parseDouble(lon));
			publication.setLocation(location);
			publicationRepository.save(publication);
		} catch (Exception e) {
			throw new RuntimeException("Falha ao atualizar o texto da publicação ", e);
		}

	}
	
	 @Transactional
	    public void deletePublication(Long publicationId) {
	        try {
	            // Verifica se a publicação existe
	            Publication publication = publicationRepository.findById(publicationId).orElse(null);
	            if (publication == null) {
	                throw new IllegalArgumentException("Publicação não encontrada.");
	            }

	            // Remove a publicação
	            publicationRepository.delete(publication);
	        } catch (Exception e) {
	            throw new RuntimeException("Falha ao excluir a publicação", e);
	        }
	    }

	private List<String> saveImages(List<MultipartFile> images) throws IOException {
		List<String> imageUrls = new ArrayList<>();
		for (MultipartFile image : images) {
			if (!image.isEmpty()) {
				String nomeArquivo = UUID.randomUUID().toString() + "-" + image.getOriginalFilename();
				Path filePath = Paths.get("uploads/", nomeArquivo);
				Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
				imageUrls.add(filePath.toString());
			}
		}
		return imageUrls;
	}

}
