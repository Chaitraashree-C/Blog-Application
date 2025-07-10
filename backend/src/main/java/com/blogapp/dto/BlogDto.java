package com.blogapp.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class BlogDto {
    private Long id;
    private String title;
    private String category;
    private String fullContent;
    private LocalDateTime createdAt;
    private String author;
    private List<String> imageUrls;
    private long likes;
    private long dislikes;
    private Boolean userReaction;
}
