package com.blogging.blogServer.repository;

import com.blogging.blogServer.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {

}
