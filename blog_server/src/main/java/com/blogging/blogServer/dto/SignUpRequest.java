package com.blogging.blogServer.dto;

import lombok.Data;

@Data
public class SignUpRequest {
    String email;
    String password;
    String name;
}
