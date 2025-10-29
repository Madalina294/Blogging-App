package com.blogging.blogServer.dto;

import com.blogging.blogServer.enums.UserRole;

import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private UserRole role;
    private String token; // Pentru actualizarea profilului
}
