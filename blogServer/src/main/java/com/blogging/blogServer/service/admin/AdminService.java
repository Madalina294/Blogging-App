package com.blogging.blogServer.service.admin;

import com.blogging.blogServer.dto.PostDto;

import java.util.List;

public interface AdminService {
    public List<PostDto> getAllPosts();
}
