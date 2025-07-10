package com.blogapp.controller;

import com.blogapp.dto.BlogDto;
import com.blogapp.service.BlogService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/blogs")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BlogController {

    @Autowired
    private BlogService blogService;

    private String getUsername(UserDetails userDetails) {
        return userDetails != null ? userDetails.getUsername() : null;
    }

    @PostMapping
    public ResponseEntity<BlogDto> createBlog(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @NotBlank String title,
            @RequestParam @NotBlank String category,
            @RequestParam("fullContent") String fullContent,
            @RequestParam(value = "images", required = false) List<MultipartFile> images
    ) throws Exception {
        BlogDto dto = blogService.createBlog(getUsername(userDetails), title, category, fullContent, images);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogDto> updateBlog(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @NotBlank String title,
            @RequestParam @NotBlank String category,
            @RequestParam("fullContent") String fullContent,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam(value = "existingImages", required = false) List<String> existingImageUrls
    ) throws Exception {
        BlogDto dto = blogService.editBlog(id, getUsername(userDetails), title, category, fullContent, images, existingImageUrls);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        blogService.deleteBlog(id, getUsername(userDetails));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my")
    public ResponseEntity<List<BlogDto>> getMyBlogs(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<BlogDto> blogs = blogService.getBlogsByAuthor(getUsername(userDetails));
        return ResponseEntity.ok(blogs);
    }

    @GetMapping("/public")
    public ResponseEntity<?> getAllPublicBlogs(
            @RequestParam int page,
            @RequestParam int size,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(blogService.getPublicBlogs(page, size, getUsername(userDetails)));
    }

    @GetMapping("/filter")
    public ResponseEntity<?> getBlogsByCategory(
            @RequestParam String category,
            @RequestParam int page,
            @RequestParam int size,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(blogService.getBlogsByCategory(category, page, size, getUsername(userDetails)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogDto> getBlogDetails(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(blogService.getBlogDtoById(id, getUsername(userDetails)));
    }

    @PostMapping("/{id}/react")
    public ResponseEntity<?> reactToBlog(
            @PathVariable Long id,
            @RequestParam boolean liked,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        blogService.reactToBlog(getUsername(userDetails), id, liked);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/react")
    public ResponseEntity<?> removeReaction(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        blogService.removeReaction(getUsername(userDetails), id);
        return ResponseEntity.noContent().build();
    }
}
