package com.blogging.blogServer.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blogging.blogServer.entity.Comment;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostId(Long postId);
}
