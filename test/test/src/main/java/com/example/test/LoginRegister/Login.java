package com.example.test.LoginRegister;

import com.example.test.Dto.LoginDto;
import com.example.test.models.Users;
import com.example.test.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class Login {

    private final UserService userService;

    @Autowired
    public Login(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<Users> login(@Valid @RequestBody LoginDto loginDto) {
        return userService.loginUser(loginDto);
    }
}

