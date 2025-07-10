package com.blogapp.repository;

import com.blogapp.entity.Blog;
import com.blogapp.entity.Reaction;
import com.blogapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    Optional<Reaction> findByUserAndBlog(User user, Blog blog);
}
