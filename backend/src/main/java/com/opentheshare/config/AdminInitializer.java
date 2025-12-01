package com.opentheshare.config;

import com.opentheshare.entity.User;
import com.opentheshare.entity.User.Role;
import com.opentheshare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner createAdminUser() {
        return args -> {
            String adminEmail = "admin@opentheshare.com";
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setCompanyName("Open The Share");
                admin.setPhoneNumber("010-0000-0000");
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
                System.out.println("Admin user created with email: " + adminEmail + " and password: admin123");
            } else {
                System.out.println("Admin user already exists.");
            }
        };
    }
}
