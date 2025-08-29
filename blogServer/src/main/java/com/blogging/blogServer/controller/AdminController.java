package com.blogging.blogServer.controller;


import com.blogging.blogServer.dto.PostDto;
import com.blogging.blogServer.entity.Post;
import com.blogging.blogServer.service.admin.AdminService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/all-posts")
    public ResponseEntity<List<PostDto>> getAllPosts() {
        try{
            return ResponseEntity.status(HttpStatus.OK).body(adminService.getAllPosts());
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getPostById(@PathVariable Long postId) {
        try {
            Post post = adminService.getPostById(postId);
            PostDto postDto = post.getPostDto();
            return ResponseEntity.ok(postDto);
        } catch (EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/comment")
    public ResponseEntity<?> createComment(@RequestParam Long postId, @RequestParam String content){

        boolean success = adminService.createComment(postId, content);
        if(success){return ResponseEntity.status(HttpStatus.CREATED).build();}
        else return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @GetMapping("/post/{id}/comments")
    public ResponseEntity<?> getComments(@PathVariable("id") Long postId){
        try{
            return ResponseEntity.ok(adminService.getCommentsByPostId(postId));
        } catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/post/search/{searchTerm}")
    public ResponseEntity<?> searchPostsExtended(@PathVariable("searchTerm") String searchTerm){
        try{
            return ResponseEntity.ok(adminService.searchPosts(searchTerm));
        } catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/post/delete/{id}")
    public ResponseEntity<?> deletePost(@PathVariable("id") Long postId){
        adminService.deletePost(postId);
        return ResponseEntity.ok(null);
    }

}
