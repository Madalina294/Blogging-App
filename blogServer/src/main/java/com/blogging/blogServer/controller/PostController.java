package com.blogging.blogServer.controller;

import com.blogging.blogServer.dto.PostDto;
import com.blogging.blogServer.entity.Post;
import com.blogging.blogServer.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin("*")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping
    public ResponseEntity<?> createPost(@ModelAttribute PostDto postDto) {
        try{

            Post createdPost = postService.savePost(postDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<PostDto>> getAllPosts() {
        try{
            return ResponseEntity.status(HttpStatus.OK).body(postService.getAllPosts());
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
