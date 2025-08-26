package com.blogging.blogServer.controller;

import com.blogging.blogServer.dto.PostDto;
import com.blogging.blogServer.entity.Post;
import com.blogging.blogServer.service.user.SimpleUserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private SimpleUserService simpleUserService;

    @PostMapping("/post")
    public ResponseEntity<?> createPost(@ModelAttribute PostDto postDto) throws IOException {

        boolean success = simpleUserService.savePost(postDto);
        if(success){return ResponseEntity.status(HttpStatus.CREATED).build();}
        else return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @GetMapping("/all-posts")
    public ResponseEntity<List<PostDto>> getAllPosts() {
        try{
            return ResponseEntity.status(HttpStatus.OK).body(simpleUserService.getAllPosts());
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getPostById(@PathVariable Long postId) {
        try {
            Post post = simpleUserService.getPostById(postId);
            return ResponseEntity.ok(post);
        } catch (EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
