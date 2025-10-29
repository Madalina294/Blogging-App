package com.blogging.blogServer.service.auth;

import com.blogging.blogServer.dto.SignUpRequest;
import com.blogging.blogServer.dto.UserDto;
import com.blogging.blogServer.entity.User;
import com.blogging.blogServer.enums.UserRole;
import com.blogging.blogServer.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;

    @PostConstruct
    public void createAdminAccount(){
        Optional<User> optionalAdmin = userRepository.findByUserRole(UserRole.ADMIN);
        if(optionalAdmin.isEmpty()){
            User admin = new User();
            admin.setName("admin");
            admin.setEmail("admin@gmail.com");
            admin.setUserRole(UserRole.ADMIN);
            admin.setPassword(new BCryptPasswordEncoder().encode("Adminul_0"));
            userRepository.save(admin);
            System.out.println("Admin created successfully!");
        }
        else{
            System.out.println("Admin already exists!");
        }
    }

    @Override
    public boolean hasUserWithEmail(String email){
        return userRepository.findFirstByEmail(email).isPresent();
    }

    @Override
    public UserDto signUp(SignUpRequest signUpRequest) {
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(new BCryptPasswordEncoder().encode(signUpRequest.getPassword()));
        user.setUserRole(UserRole.USER);
        return userRepository.save(user).getUserDto();
    }
}
