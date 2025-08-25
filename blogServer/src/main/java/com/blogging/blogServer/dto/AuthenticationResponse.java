package com.blogging.blogServer.dto;

import com.blogging.blogServer.enums.UserRole;
import lombok.Data;

@Data
public class AuthenticationResponse {
    private String jwt;
    private Long userId;
    private UserRole userRole;
    private String userName;
}
