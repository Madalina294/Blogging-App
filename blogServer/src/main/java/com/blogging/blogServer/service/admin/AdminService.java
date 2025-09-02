package com.blogging.blogServer.service.admin;

import com.blogging.blogServer.dto.CommentDto;
import com.blogging.blogServer.dto.PostDto;
import com.blogging.blogServer.dto.UpdateProfileRequest;
import com.blogging.blogServer.dto.UserDto;
import com.blogging.blogServer.entity.Post;

import java.util.List;

public interface AdminService {
    public List<PostDto> getAllPosts();
    public Post getPostById(Long id);
    public boolean createComment(Long postId, String content);
    public List<CommentDto> getCommentsByPostId(Long postId);
    public List<PostDto> searchPosts(String searchTerm);
    public void deletePost(Long postId);
    public UserDto updateProfile(Long userId, UpdateProfileRequest updateProfileRequest);
}
