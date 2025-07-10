package com.blogapp.repository;

import com.blogapp.entity.Blog;
import com.blogapp.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogRepository extends JpaRepository<Blog, Long> {
    List<Blog> findByAuthor(User user);
    Page<Blog> findByCategory(String category, Pageable pageable);
}
