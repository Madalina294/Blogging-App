package com.blogging.blogServer.configurations;

import java.io.IOException;

import org.apache.commons.lang3.StringUtils;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.blogging.blogServer.service.jwt.UserService;
import com.blogging.blogServer.utils.JWTUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JWTUtil jwtUtil;

    private final UserService userService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        final String authorizationHeader = request.getHeader("Authorization");

        final String jwt;
        final String userEmail;

        if(StringUtils.isEmpty(authorizationHeader) || !StringUtils.startsWithIgnoreCase(authorizationHeader, "Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        jwt = authorizationHeader.substring(7);
        
        // Add validation for JWT token
        if(StringUtils.isEmpty(jwt)) {
            System.out.println("JWT token is empty or null");
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
            userEmail = jwtUtil.extractUsername(jwt);
        } catch (Exception e) {
            System.out.println("Error extracting username from JWT: " + e.getMessage());
            System.out.println("JWT token: " + jwt);
            filterChain.doFilter(request, response);
            return;
        }

        if(StringUtils.isNoneEmpty(userEmail) && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userService.userDetailsService().loadUserByUsername(userEmail);
                if(jwtUtil.isTokenValid(jwt, userDetails)) {
                    SecurityContext context = SecurityContextHolder.createEmptyContext();
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    context.setAuthentication(authentication);
                    SecurityContextHolder.setContext(context);
                }
            } catch (Exception e) {
                System.out.println("Error processing JWT authentication: " + e.getMessage());
            }
        }
        filterChain.doFilter(request, response);
    }
}
