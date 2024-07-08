package com.patasperdidas.prototype.entities;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import javax.persistence.CascadeType;
import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.patasperdidas.prototype.util.Location;

@Entity
@Table(name = "tb_publi")
public class Publication {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String text;

	@ElementCollection
	@CollectionTable(name = "tb_publi_image", joinColumns = @JoinColumn(name = "publication_id"))
	@Column(name = "image_url")
	private List<String> img;

	@Column(nullable = false)
	private LocalDateTime date;

	@Column
	private int likesCount;

	@Column
	@Embedded
	private Location location;

	@ManyToOne
	@JoinColumn(name = "id_user", referencedColumnName = "id")
	private User user;

	@OneToMany(mappedBy = "publication", cascade = { CascadeType.ALL, CascadeType.REMOVE })
	@JsonIgnore
	private List<Comment> comment;

	@OneToMany(mappedBy = "publication", cascade = { CascadeType.ALL, CascadeType.REMOVE })
	@JsonIgnore
	private List<Like> likesList;

	public Publication() {
		super();
	}

	public Publication(Long id, String text, LocalDateTime date) {
		super();
		this.id = id;
		this.text = text;
		this.date = date;
	}

	public Publication(Long id, String text, List<String> img, LocalDateTime date) {
		super();
		this.id = id;
		this.text = text;
		this.img = img;
		this.date = date;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public List<String> getImg() {
		return img;
	}

	public void setImg(List<String> img) {
		this.img = img;
	}

	public LocalDateTime getDate() {
		return date;
	}

	public void setDate(LocalDateTime date) {
		this.date = date;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public List<Comment> getComment() {
		return comment;
	}

	public void setComment(List<Comment> comment) {
		this.comment = comment;
	}

	public int getLikesCount() {
		return likesCount;
	}

	public void setLikesCount(int likesCount) {
		this.likesCount = likesCount;
	}

	public Location getLocation() {
		return location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

	public List<Like> getLikesList() {
		return likesList;
	}

	public void setLikesList(List<Like> likesList) {
		this.likesList = likesList;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Publication other = (Publication) obj;
		return Objects.equals(id, other.id);
	}

	@Override
	public String toString() {
		return "Publication [id=" + id + ", text=" + text + ", date=" + date + "]";
	}

}
