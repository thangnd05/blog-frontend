package com.example.test.Dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginDto {
    private String username;
    private String password;
    private String role; // Có thể null nếu không truyền

    public LoginDto(String username, String password,String role) {
        this.username = username;
        this.password = password;
        this.role=role;
    }
}
