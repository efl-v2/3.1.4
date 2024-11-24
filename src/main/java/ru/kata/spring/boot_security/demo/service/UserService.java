package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserService {
    void saveUser(User user);

    List<User> getAllUsers();

    void deleteUser(Long userId);

    User findUserById(Long userId);

    void editUser(User user);

    User findUserByEmail(String email);
}