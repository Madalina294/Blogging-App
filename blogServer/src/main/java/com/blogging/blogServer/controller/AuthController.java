package com.blogging.blogServer.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blogging.blogServer.dto.AuthenticationRequest;
import com.blogging.blogServer.dto.AuthenticationResponse;
import com.blogging.blogServer.dto.SignUpRequest;
import com.blogging.blogServer.dto.UserDto;
import com.blogging.blogServer.entity.User;
import com.blogging.blogServer.repository.UserRepository;
import com.blogging.blogServer.service.auth.AuthService;
import com.blogging.blogServer.service.jwt.UserService;
import com.blogging.blogServer.utils.JWTUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@CrossOrigin("*")

public class AuthController {
    private final AuthService authService;

    private final UserService userService;

    private final UserRepository userRepository;

    private final AuthenticationManager authenticationManager;

    private final JWTUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignUpRequest signUpRequest) {
        if(authService.hasUserWithEmail(signUpRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("User already exists");
        }
        UserDto userDto = authService.signUp(signUpRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(userDto);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest authenticationRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authenticationRequest.getEmail(),
                            authenticationRequest.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bad credentials");
        }

        final UserDetails userDetails = userService.userDetailsService()
                .loadUserByUsername(authenticationRequest.getEmail());
        Optional<User> optionalUser = userRepository.findFirstByEmail(authenticationRequest.getEmail());
        final String token = jwtUtil.generateToken(userDetails);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        AuthenticationResponse response = new AuthenticationResponse();
        response.setJwt(token);
        response.setUserId(optionalUser.get().getId());
        response.setUserRole(optionalUser.get().getUserRole());
        response.setUserName(optionalUser.get().getName());
        
        System.out.println("Sending authentication response:");
        System.out.println("JWT: " + response.getJwt());
        System.out.println("UserId: " + response.getUserId());
        System.out.println("UserRole: " + response.getUserRole());
        System.out.println("UserName: " + response.getUserName());
        
        return ResponseEntity.ok(response);
    }
}
