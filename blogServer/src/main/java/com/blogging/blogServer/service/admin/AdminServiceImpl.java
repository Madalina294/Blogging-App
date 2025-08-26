package com.blogging.blogServer.service.admin;

import com.blogging.blogServer.dto.PostDto;
import com.blogging.blogServer.entity.Post;
import com.blogging.blogServer.repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service

public class AdminServiceImpl implements AdminService {

    @Autowired
    private PostRepository postRepository;

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
}
