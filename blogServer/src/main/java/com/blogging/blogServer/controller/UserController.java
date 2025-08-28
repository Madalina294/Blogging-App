package com.blogging.blogServer.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.blogging.blogServer.dto.PostDto;
import com.blogging.blogServer.entity.Post;
import com.blogging.blogServer.service.user.SimpleUserService;

import jakarta.persistence.EntityNotFoundException;

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
            PostDto postDto = post.getPostDto();
           
            return ResponseEntity.ok(postDto);
        } catch (EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/post/like/{postId}")
    public ResponseEntity<?> likePost(@PathVariable Long postId) {
        try {
            simpleUserService.likePost(postId);
            return ResponseEntity.ok(Map.of("message", "Post liked successfully!"));
        } catch (EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.out.println("Error liking post with ID " + postId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error processing like request"));
        }
    }

    @PostMapping("/comment")
    public ResponseEntity<?> createComment(@RequestParam Long postId, @RequestParam String content){

        boolean success = simpleUserService.createComment(postId, content);
        if(success){return ResponseEntity.status(HttpStatus.CREATED).build();}
        else return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @GetMapping("/post/{id}/comments")
    public ResponseEntity<?> getComments(@PathVariable("id") Long postId){
        try{
            return ResponseEntity.ok(simpleUserService.getCommentsByPostId(postId));
        } catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    @GetMapping("/post/search/{searchTerm}")
    public ResponseEntity<?> searchPostsExtended(@PathVariable("searchTerm") String searchTerm){
        try{
            return ResponseEntity.ok(simpleUserService.searchPosts(searchTerm));
        } catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
