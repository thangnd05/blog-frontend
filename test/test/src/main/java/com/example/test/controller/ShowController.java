package com.example.test.controller;
import com.example.test.models.Users;
import com.example.test.respositories.UserRespo;
import com.example.test.services.PostService;
import com.example.test.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.web.bind.annotation.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:3001") // Cho phép frontend truy cập
@RequestMapping("/api")
@AllArgsConstructor
public class ShowController {
    @Autowired
    private PostService postService;
    private UserService userService;
    private UserRespo userRespo;

    @Autowired
    private JavaMailSender mailSender;


    @DeleteMapping("/user/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable Long id) {
        Optional<Users> user = userService.getUserId(id);
        if (user.isPresent()) {
           userService.deleteUserById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/users")
    public ResponseEntity<Users> getUseByUserName(@RequestParam String username) {
        Optional<Users> user = userService.getUserByUsername(username);
//        if (user.isPresent()) {
            return new ResponseEntity<>(user.get(), HttpStatus.OK);
//        } else {
//            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//        }

    }

    @GetMapping("/user/{id}")
    public ResponseEntity<Users> getUserByUserName( @PathVariable(required = false) Long id) {
        Optional<Users> users = userService.getUserId(id);
            return new ResponseEntity<>(users.get(), HttpStatus.OK);
    }
    @PutMapping("/user/{id}")
    public ResponseEntity<Users> UpdateUsers(@PathVariable Long id, @RequestBody Users user) {
        try {
            Users updatedUser = userService.update(id, user);
            return ResponseEntity.ok(updatedUser); // 200 OK với người dùng đã cập nhật
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 404 nếu người dùng không tồn tại
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 500 cho lỗi khác
        }
    }

    @GetMapping("/role/{username}")
    public String getRole(@PathVariable String username) {
        return userService.getRoleByUsername(username).name();  // Trả về role dưới dạng chuỗi
    }

    @GetMapping("/username/email")
    public String getEmail(@RequestParam String username) {
        return userService.getEmailByUsername(username);
    }

    @GetMapping("/role")
    public ResponseEntity<String> getRoleByEmail(@RequestParam String email) {
        try {
            String role = userService.getRoleByEmail(email);
            return new ResponseEntity<>(role, HttpStatus.OK); // Trả về role và mã trạng thái 200 OK
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND); // Trả về lỗi 404 nếu không tìm thấy người dùng
        }
    }

    @GetMapping("/mail/{email}")
    public ResponseEntity<Users> getUserByEmail(@PathVariable String email) {
        Optional<Users> userEmail = userService.getUserByEmail(email);

            return new ResponseEntity<>(userEmail.get(), HttpStatus.OK);

    }




}



