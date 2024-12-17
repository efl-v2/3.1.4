package ru.kata.spring.boot_security.demo.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.reposotorie.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, @Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public User findUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return user.orElse(null);
        } else {
            throw new UsernameNotFoundException("User with not found");
        }
    }

    @Override
    @Transactional
    public void editUser(User updateUser) {
        User user = userRepository.findById(updateUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Обновляем общие поля
        user.setFirstName(updateUser.getFirstName());
        user.setLastName(updateUser.getLastName());
        user.setEmail(updateUser.getEmail());
        user.setAge(updateUser.getAge());
        user.setRoles(updateUser.getRoles());

        // Проверяем, был ли передан новый пароль
        String newPassword = updateUser.getPassword();
        if (newPassword != null && !newPassword.isEmpty()) {
            // Кодируем новый пароль и сохраняем его
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        userRepository.save(user);
    }

    @Override
    public User findUserByName(String name) {
        return userRepository.findByFirstName(name);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
        User user = userRepository.findByFirstName(name);
        if (user == null)
            throw new UsernameNotFoundException(String.format(" User '%s' not found", name));
        return user;
    }
}
