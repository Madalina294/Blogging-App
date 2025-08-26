package com.blogging.blogServer.service.admin;

import com.blogging.blogServer.dto.PostDto;
import com.blogging.blogServer.entity.Post;

import java.util.List;

public interface AdminService {
    public List<PostDto> getAllPosts();
    public Post getPostById(Long id);
}
