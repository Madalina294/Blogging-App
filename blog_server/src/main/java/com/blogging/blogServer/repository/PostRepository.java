package com.blogging.blogServer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.blogging.blogServer.entity.Post;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(p.content) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(p.postedBy) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Post> searchPostsByTerm(@Param("searchTerm") String searchTerm);

    List<Post> getPostByUserId(Long userId);
}
