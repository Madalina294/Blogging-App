package com.blogging.blogServer.entity;

import com.blogging.blogServer.dto.PostDto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

@Entity
@Data
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(length = 5000)
    private String content;

    private String postedBy;


    private byte[] file;

    private String fileName;

    private Date date;

    private int likeCount;

    private int viewCount;

    private List<String> tags;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private User user;

    public PostDto getPostDto() {
        PostDto postDto = new PostDto();
        postDto.setId(id);
        postDto.setName(name);
        postDto.setContent(content);
        postDto.setPostedBy(postedBy);
        postDto.setDate(date);
        postDto.setLikeCount(likeCount);
        postDto.setViewCount(viewCount);
        postDto.setTags(tags);
        postDto.setFileName(fileName);
        postDto.setReturnedFile(file);
        return postDto;
    }
 }
