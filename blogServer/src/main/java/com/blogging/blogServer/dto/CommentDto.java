package com.blogging.blogServer.dto;

import lombok.Data;

import java.util.Date;

@Data
public class CommentDto {
    private Long id;
    private String content;
    private String postedBy;
    private Date postedOn;
    private Long postId;
    private Long userId;
}
