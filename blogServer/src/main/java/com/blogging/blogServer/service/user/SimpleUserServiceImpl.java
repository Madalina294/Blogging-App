package com.blogging.blogServer.service.user;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.blogging.blogServer.dto.CommentDto;
import com.blogging.blogServer.dto.PostDto;
import com.blogging.blogServer.dto.UpdateProfileRequest;
import com.blogging.blogServer.dto.UserDto;
import com.blogging.blogServer.entity.Comment;
import com.blogging.blogServer.entity.Post;
import com.blogging.blogServer.entity.User;
import com.blogging.blogServer.repository.CommentRepository;
import com.blogging.blogServer.repository.PostRepository;
import com.blogging.blogServer.repository.UserRepository;
import com.blogging.blogServer.utils.JWTUtil;

import jakarta.persistence.EntityNotFoundException;

@Service
public class SimpleUserServiceImpl implements SimpleUserService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTUtil jwtUtil;

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

    @Override
    public Post getPostById(Long id) {
        Optional<Post> optionalPost = postRepository.findById(id);
        if(optionalPost.isPresent()) {
            Post post = optionalPost.get();
            post.setViewCount(post.getViewCount() + 1);
            postRepository.save(post);
            return post;
        }
        else throw new EntityNotFoundException("Post not found");
    }
    @Override
    public void likePost(Long id) {
        Optional<Post> optionalPost = postRepository.findById(id);
        if(optionalPost.isPresent()) {
            Post post = optionalPost.get();
            post.setLikeCount(post.getLikeCount() + 1);
            postRepository.save(post);
        }
        else throw new EntityNotFoundException("Post not found");
    }

    @Override
    public boolean createComment(Long postId, String content) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        Optional<User> optionalUser = userRepository.findFirstByEmail(userEmail);

        if(optionalPost.isPresent() && optionalUser.isPresent()) {
            Comment comment = new Comment();
            comment.setContent(content);
            comment.setPost(optionalPost.get());
            comment.setUser(optionalUser.get());
            comment.setPostedOn(new Date());
            comment.setPostedBy(optionalUser.get().getName());
            commentRepository.save(comment);
            return true;
        }
        return false;
    }

    @Override
    public List<CommentDto> getCommentsByPostId(Long postId) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        if(optionalPost.isPresent()) {
           List<CommentDto> comments = commentRepository.findByPostId(optionalPost.get().getId())
                   .stream().map(Comment::getCommentDto).toList();
            return comments;
        }
        else throw new EntityNotFoundException("Post not found");
    }

    @Override
    public List<PostDto> searchPosts(String searchTerm) {
        return postRepository.searchPostsByTerm(searchTerm).stream().map(Post::getPostDto).collect(Collectors.toList());
    }

    @Override
    public void deletePost(Long id) {
       Optional<Post> post = postRepository.findById(id);
       if(post.isPresent()) {
           postRepository.delete(post.get());
       }
       else throw new EntityNotFoundException("Post not found");
    }

    @Override
    public List<PostDto> getPostsByUserId(Long userId) {

        Optional<User> optionalUser = userRepository.findById(userId);
        if(optionalUser.isPresent()) {
            return postRepository.getPostByUserId(userId).stream().map(Post::getPostDto).collect(Collectors.toList());
        }
        else throw new EntityNotFoundException("User not found");
    }

    @Override
    public UserDto updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Verifică dacă email-ul nou este deja folosit de alt utilizator
        if (!user.getEmail().equals(request.getEmail())) {
            Optional<User> existingUser = userRepository.findFirstByEmail(request.getEmail());
            if (existingUser.isPresent()) {
                throw new IllegalArgumentException("Email already exists");
            }
        }

        // Verifică dacă numele s-a schimbat
        boolean nameChanged = !user.getName().equals(request.getName());

        // Actualizează câmpurile
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // Actualizează password-ul doar dacă este furnizat și valid
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            // Verifică dacă confirmPassword este furnizat și se potrivește
            if (request.getConfirmPassword() == null || !request.getPassword().equals(request.getConfirmPassword())) {
                throw new IllegalArgumentException("Passwords do not match");
            }
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User savedUser = userRepository.save(user);

        // Dacă numele s-a schimbat, actualizează toate postările și comentariile utilizatorului
        if (nameChanged) {
            updateUserPostsAuthorName(userId, request.getName());
            updateUserCommentsAuthorName(userId, request.getName());
        }

        UserDto userDto = savedUser.getUserDto();
        
        // Generează un nou JWT token cu noile credențiale
        String newToken = jwtUtil.generateToken(savedUser);
        userDto.setToken(newToken);
        
        return userDto;
    }

    /**
     * Actualizează numele autorului în toate postările unui utilizator
     */
    private void updateUserPostsAuthorName(Long userId, String newAuthorName) {
        List<Post> userPosts = postRepository.getPostByUserId(userId);
        for (Post post : userPosts) {
            post.setPostedBy(newAuthorName);
        }
        postRepository.saveAll(userPosts);
    }

    /**
     * Actualizează numele autorului în toate comentariile unui utilizator
     */
    private void updateUserCommentsAuthorName(Long userId, String newAuthorName) {
        List<Comment> userComments = commentRepository.findByUserId(userId);
        for (Comment comment : userComments) {
            comment.setPostedBy(newAuthorName);
        }
        commentRepository.saveAll(userComments);
    }


}

