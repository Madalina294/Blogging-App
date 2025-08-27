package com.blogging.blogServer.entity;

import com.blogging.blogServer.dto.CommentDto;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    private String postedBy;

    private Date postedOn;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public CommentDto getCommentDto() {
        CommentDto commentDto = new CommentDto();
        commentDto.setId(this.id);
        commentDto.setContent(this.content);
        commentDto.setPostedBy(this.postedBy);
        commentDto.setPostedOn(this.postedOn);
        commentDto.setUserId(this.user.getId());
        commentDto.setPostId(this.post.getId());
        return commentDto;
    }
}
