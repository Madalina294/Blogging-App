package com.blogging.blogServer.service;

import com.blogging.blogServer.dto.PostDto;
import com.blogging.blogServer.entity.Post;
import com.blogging.blogServer.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {
    @Autowired
    private PostRepository postRepository;

    public Post savePost(PostDto postDto) throws IOException{
        Post post = new Post();
        post.setName(postDto.getName());
        post.setContent(postDto.getContent());
        post.setPostedBy(postDto.getPostedBy());
        post.setTags(postDto.getTags());
        if (postDto.getFile() != null && !postDto.getFile().isEmpty()) {
            try {
                // Convertire MultipartFile în byte[]
                byte[] fileData = postDto.getFile().getBytes();
                post.setFile(fileData);
            } catch (IOException e) {
                throw new RuntimeException("Eroare la procesarea fișierului", e);
            }
        }
        
        post.setLikeCount(0);
        post.setViewCount(0);
        post.setDate(new Date());

        return postRepository.save(post);
    }

    @Override
    public List<PostDto> getAllPosts() {
        return postRepository.findAll().stream().map(Post::getPostDto).collect(Collectors.toList());
    }
}

