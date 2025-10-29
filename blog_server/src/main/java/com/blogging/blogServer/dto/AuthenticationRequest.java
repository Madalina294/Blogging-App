package com.blogging.blogServer.dto;

import lombok.Data;

@Data
public class AuthenticationRequest {
    private String email;
    private String password;
}

