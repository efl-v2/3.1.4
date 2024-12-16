package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.validation.BindingResult;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.RoleServiceImpl;
import ru.kata.spring.boot_security.demo.service.UserService;
import ru.kata.spring.boot_security.demo.service.UserServiceImpl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public AdminController(UserServiceImpl userServiceImpl, RoleServiceImpl roleServiceImpl) {
        this.userService = userServiceImpl;
        this.roleService = roleServiceImpl;
    }

    @PostMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response) {

        SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();
        logoutHandler.logout(request, response, SecurityContextHolder.getContext().getAuthentication());

        return "redirect:/login";
    }


    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> showAllUsers(Principal principal) {

        Map<String, Object> responseMap = new HashMap<>();
        if (principal != null) {
            // Получение текущего пользователя
            User currentUser = userService.findUserByName(principal.getName());
            responseMap.put("currentUser", currentUser);
        }

        // Список всех пользователей
        List<User> users = userService.getAllUsers();
        responseMap.put("users", users);

        // Роли
        List<Role> roles = roleService.getRoles();
        responseMap.put("roles", roles);

        return new ResponseEntity<>(responseMap, HttpStatus.OK);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        return new ResponseEntity<>(userService.findUserById(userId), HttpStatus.OK);
    }

//    @PutMapping("/users/{id}")
//    public ResponseEntity<User> editUser(@PathVariable("id") long id, @RequestBody @Valid User user, BindingResult bindingResult) {
//
//        System.out.println("editUser");
//        if (bindingResult.hasErrors()) {
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//        }
//
//        Optional<User> existingUser = Optional.ofNullable(userService.findUserById(id));
//        if (existingUser.isEmpty()) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//
//        user.setId(id);
//        userService.editUser(user);
//        return new ResponseEntity<>(user, HttpStatus.OK);
//    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> editUser(@PathVariable long id, @RequestBody User userDTO) {
        User user = userService.findUserById(id);

        user.setId(id);

        Set<Role> roles = userDTO.getRoles().stream()
                .map(roleId -> {
                    Role role = new Role();
                    role.setId(roleId.getId());
                    return role;
                }).collect(Collectors.toSet());

        user.setRoles(roles);

        userService.editUser(user);

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") long id) {

        userService.deleteUser(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody @Valid User user,
                                           @RequestParam("roles") Set<Role> roles,
                                           BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return new ResponseEntity<>(user, HttpStatus.BAD_REQUEST);
        }

        user.setRoles(roles);
        userService.saveUser(user);

        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

}