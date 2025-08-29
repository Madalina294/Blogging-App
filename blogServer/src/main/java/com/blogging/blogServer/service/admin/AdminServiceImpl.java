package com.blogging.blogServer.service.admin;

import com.blogging.blogServer.dto.CommentDto;
import com.blogging.blogServer.dto.PostDto;
import com.blogging.blogServer.entity.Comment;
import com.blogging.blogServer.entity.Post;
import com.blogging.blogServer.entity.User;
import com.blogging.blogServer.repository.CommentRepository;
import com.blogging.blogServer.repository.PostRepository;
import com.blogging.blogServer.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service

public class AdminServiceImpl implements AdminService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Override
    public List<PostDto> getAllPosts() {
        return postRepository.findAll().stream().map(Post::getPostDto).collect(Collectors.toList());
    }

    @Override
    public Post getPostById(Long id) {
        Optional<Post> optionalPost = postRepository.findById(id);
        if(optionalPost.isPresent()) {
            Post post = optionalPost.get();
            post.setViewCount(post.getViewCount() + 1);
            postRepository.save(post);
            return post;
        }
        else throw new EntityNotFoundException("Post not found");
    }

    @Override
    public boolean createComment(Long postId, String content) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        Optional<User> optionalUser = userRepository.findFirstByEmail(userEmail);

        if(optionalPost.isPresent() && optionalUser.isPresent()) {
            Comment comment = new Comment();
            comment.setContent(content);
            comment.setPost(optionalPost.get());
            comment.setUser(optionalUser.get());
            comment.setPostedOn(new Date());
            comment.setPostedBy(optionalUser.get().getName());
            commentRepository.save(comment);
            return true;
        }
        return false;
    }

    @Override
    public List<CommentDto> getCommentsByPostId(Long postId) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        if(optionalPost.isPresent()) {
            List<CommentDto> comments = commentRepository.findByPostId(optionalPost.get().getId())
                    .stream().map(Comment::getCommentDto).toList();
            return comments;
        }
        else throw new EntityNotFoundException("Post not found");
    }

    @Override
    public List<PostDto> searchPosts(String searchTerm) {
        return postRepository.searchPostsByTerm(searchTerm).stream().map(Post::getPostDto).collect(Collectors.toList());
    }

    @Override
    public void deletePost(Long postId) {
        Optional<Post> post = postRepository.findById(postId);
        if(post.isPresent()) {
            postRepository.delete(post.get());
        }
        else throw new EntityNotFoundException("Post not found");
    }
}
