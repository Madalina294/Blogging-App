package com.blogging.blogServer.service.user;

import com.blogging.blogServer.dto.PostDto;
import com.blogging.blogServer.entity.Post;

import java.io.IOException;
import java.util.List;

public interface SimpleUserService {
    public boolean savePost(PostDto postDto) throws IOException;
    public List<PostDto> getAllPosts();
}
