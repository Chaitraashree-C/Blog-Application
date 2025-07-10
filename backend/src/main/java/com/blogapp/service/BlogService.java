package com.blogapp.service;

import com.blogapp.dto.BlogDto;
import com.blogapp.entity.*;
import com.blogapp.repository.*;
import jakarta.annotation.PostConstruct;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BlogService {

    @Autowired private BlogRepository blogRepo;
    @Autowired private ImageRepository imageRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private ReactionRepository reactionRepo;

    private final String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "images";
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "gif", "webp");

    @PostConstruct
    public void ensureUploadFolderExists() {
        File folder = new File(uploadDir);
        if (!folder.exists()) folder.mkdirs();
    }

    public BlogDto createBlog(String username, String title, String category, String fullContent, List<MultipartFile> images) throws IOException {
        User user = userRepo.findByUsername(username).orElseThrow();
        Blog blog = new Blog();
        blog.setTitle(title);
        blog.setCategory(category);
        blog.setFullContent(fullContent);
        blog.setCreatedAt(LocalDateTime.now());
        blog.setAuthor(user);
        Blog saved = blogRepo.save(blog);
        saveImages(saved, images);
        return toDto(saved, username);
    }

    public BlogDto editBlog(Long blogId, String username, String title, String category, String fullContent,
                             List<MultipartFile> newImages, List<String> existingImageUrls) throws IOException {

        Blog blog = blogRepo.findById(blogId).orElseThrow();
        if (!blog.getAuthor().getUsername().equals(username)) throw new RuntimeException("Forbidden");

        blog.setTitle(title);
        blog.setCategory(category);
        blog.setFullContent(fullContent);

        List<Image> currentImages = blog.getImages();
        List<String> existing = existingImageUrls != null ? existingImageUrls : List.of();

        List<Image> keep = currentImages.stream().filter(img -> existing.contains(img.getUrl())).toList();
        List<Image> remove = currentImages.stream().filter(img -> !existing.contains(img.getUrl())).toList();

        for (Image img : remove) {
            File file = new File(uploadDir, Paths.get(img.getUrl()).getFileName().toString());
            if (file.exists()) file.delete();
        }

        imageRepo.deleteAll(remove);
        blog.getImages().clear();
        blog.getImages().addAll(keep);

        if (blog.getImages().size() + (newImages != null ? newImages.size() : 0) > 5)
            throw new IllegalArgumentException("Max 5 images allowed");

        saveImages(blog, newImages);
        Blog updated = blogRepo.save(blog);
        return toDto(updated, username);
    }

    public void deleteBlog(Long id, String username) {
        Blog blog = blogRepo.findById(id).orElseThrow();
        if (!blog.getAuthor().getUsername().equals(username)) throw new RuntimeException("Forbidden");
        for (Image img : blog.getImages()) {
            File file = new File(uploadDir, Paths.get(img.getUrl()).getFileName().toString());
            if (file.exists()) file.delete();
        }
        blogRepo.delete(blog);
    }

    public Page<BlogDto> getPublicBlogs(int page, int size, String username) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return blogRepo.findAll(pageable).map(blog -> toDto(blog, username));
    }

    public Page<BlogDto> getBlogsByCategory(String category, int page, int size, String username) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return blogRepo.findByCategory(category, pageable).map(blog -> toDto(blog, username));
    }

    public List<BlogDto> getBlogsByAuthor(String username) {
        User user = userRepo.findByUsername(username).orElseThrow();
        return blogRepo.findByAuthor(user).stream().map(blog -> toDto(blog, username)).toList();
    }

    public BlogDto getBlogDtoById(Long id, String username) {
        return toDto(blogRepo.findById(id).orElseThrow(), username);
    }

    public void reactToBlog(String username, Long blogId, boolean liked) {
        User user = userRepo.findByUsername(username).orElseThrow();
        Blog blog = blogRepo.findById(blogId).orElseThrow();
        Optional<Reaction> existing = reactionRepo.findByUserAndBlog(user, blog);
        if (existing.isPresent()) {
            Reaction r = existing.get();
            r.setLiked(liked);
            reactionRepo.save(r);
        } else {
            Reaction r = new Reaction();
            r.setUser(user);
            r.setBlog(blog);
            r.setLiked(liked);
            reactionRepo.save(r);
        }
    }

    public void removeReaction(String username, Long blogId) {
        User user = userRepo.findByUsername(username).orElseThrow();
        Blog blog = blogRepo.findById(blogId).orElseThrow();
        reactionRepo.findByUserAndBlog(user, blog).ifPresent(reactionRepo::delete);
    }

    private BlogDto toDto(Blog blog, String currentUser) {
        BlogDto dto = new BlogDto();
        dto.setId(blog.getId());
        dto.setTitle(blog.getTitle());
        dto.setCategory(blog.getCategory());
        dto.setFullContent(blog.getFullContent());
        dto.setCreatedAt(blog.getCreatedAt());
        dto.setAuthor(blog.getAuthor().getUsername());
        dto.setImageUrls(blog.getImages() != null ? blog.getImages().stream().map(Image::getUrl).toList() : List.of());
        dto.setLikes(blog.getReactions() != null ? blog.getReactions().stream().filter(Reaction::isLiked).count() : 0);
        dto.setDislikes(blog.getReactions() != null ? blog.getReactions().stream().filter(r -> !r.isLiked()).count() : 0);
        if (currentUser != null && blog.getReactions() != null) {
            blog.getReactions().stream()
                .filter(r -> r.getUser().getUsername().equals(currentUser))
                .findFirst()
                .ifPresent(r -> dto.setUserReaction(r.isLiked()));
        }
        return dto;
    }

    private void saveImages(Blog blog, List<MultipartFile> images) {
        if (images != null && !images.isEmpty()) {
            for (MultipartFile img : images) {
                String ext = FilenameUtils.getExtension(img.getOriginalFilename());
                if (!ALLOWED_EXTENSIONS.contains(ext.toLowerCase())) continue;
                String name = UUID.randomUUID() + "." + ext;
                File file = new File(uploadDir, name);
                try {
                    img.transferTo(file);
                    Image image = new Image();
                    image.setUrl("/images/" + name);
                    image.setBlog(blog);
                    imageRepo.save(image);
                } catch (Exception e) {
                    throw new RuntimeException("Failed to save image: " + img.getOriginalFilename());
                }
            }
        }
    }
}
