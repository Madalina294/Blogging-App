package com.blogging.blogServer.dto;

import jakarta.persistence.Column;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

@Data
public class PostDto {
    private Long id;

    private String name;

    private String content;

    private String postedBy;

    private MultipartFile file;

    private byte[] returnedFile;

    private String fileName;

    private Date date;

    private int likeCount;

    private int viewCount;

    private List<String> tags;
}
