package com.blogging.blogServer.service.user;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.blogging.blogServer.dto.PostDto;
import com.blogging.blogServer.entity.Post;
import com.blogging.blogServer.entity.User;
import com.blogging.blogServer.repository.PostRepository;
import com.blogging.blogServer.repository.UserRepository;

@Service
public class SimpleUserServiceImpl implements SimpleUserService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public boolean savePost(PostDto postDto) throws IOException{
        // Obține utilizatorul curent din contextul de securitate
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        
        Optional<User> optionalUser = userRepository.findFirstByEmail(userEmail);
        if(optionalUser.isPresent()) {
            Post post = new Post();
            post.setName(postDto.getName());
            post.setContent(postDto.getContent());
            post.setPostedBy(optionalUser.get().getName());
            post.setTags(postDto.getTags());
            post.setFileName(postDto.getFileName());
            if (postDto.getFile() != null && !postDto.getFile().isEmpty()) {
                try {
                    // Convertire MultipartFile în byte[]
                    byte[] fileData = postDto.getFile().getBytes();
                    post.setFile(fileData);
                } catch (IOException e) {
                    throw new RuntimeException("Error at proccesing the file", e);
                }
            }
            post.setUser(optionalUser.get());
            post.setLikeCount(0);
            post.setViewCount(0);
            post.setDate(new Date());

            postRepository.save(post);
            return true;
        }
        return false;
    }

    @Override
    public List<PostDto> getAllPosts() {
        return postRepository.findAll().stream().map(Post::getPostDto).collect(Collectors.toList());
    }
}

