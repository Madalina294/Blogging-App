package com.blogging.blogServer.repository;

import com.blogging.blogServer.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByNameContaining(String name);
}
