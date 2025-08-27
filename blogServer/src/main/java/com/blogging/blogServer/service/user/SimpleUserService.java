package com.blogging.blogServer.service.user;

import java.io.IOException;
import java.util.List;

import com.blogging.blogServer.dto.CommentDto;
import com.blogging.blogServer.dto.PostDto;
import com.blogging.blogServer.entity.Comment;
import com.blogging.blogServer.entity.Post;

public interface SimpleUserService {
    public boolean savePost(PostDto postDto) throws IOException;
    public List<PostDto> getAllPosts();
    public Post getPostById(Long id);
    public void likePost(Long id);
    public boolean createComment(Long id, String content);
    public List<CommentDto> getCommentsByPostId(Long postId);
}
