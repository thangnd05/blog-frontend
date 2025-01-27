package com.example.test.Loader;

import com.example.test.models.Users;
import com.example.test.respositories.UserRespo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Optional;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRespo usersRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public DataLoader(UserRespo usersRepository, BCryptPasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        Optional<Users> user = usersRepository.findByUsername("Admin");

        if (user.isEmpty()) {
            Users admin = new Users();
            admin.setFullname("Admin");
            admin.setUsername("Admin");
            admin.setPassword(passwordEncoder.encode("password456"));
            admin.setEmail("Thang@gmail.com");
            admin.setCreated_at(LocalDate.now());
            admin.setRole(Users.Role.ADMIN);
            usersRepository.save(admin);
        }
    }
}
