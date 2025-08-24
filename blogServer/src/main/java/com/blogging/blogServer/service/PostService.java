package com.blogging.blogServer.service;

import com.blogging.blogServer.dto.PostDto;
import com.blogging.blogServer.entity.Post;

import java.util.List;

public interface PostService {
    public Post savePost(PostDto postDto) throws Exception;
    public List<PostDto> getAllPosts();
}
