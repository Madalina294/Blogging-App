package com.blogging.blogServer.service.auth;

import com.blogging.blogServer.dto.SignUpRequest;
import com.blogging.blogServer.dto.UserDto;

public interface AuthService {
    public boolean hasUserWithEmail(String email);
    public UserDto signUp(SignUpRequest signUpRequest);
}
