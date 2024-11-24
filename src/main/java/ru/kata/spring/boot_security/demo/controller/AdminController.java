package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.RoleServiceImpl;
import ru.kata.spring.boot_security.demo.service.UserService;
import ru.kata.spring.boot_security.demo.service.UserServiceImpl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.util.Set;
import jakarta.validation.Valid;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final String redirect = "redirect:/admin";
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
    @GetMapping("")
    public String adminPage(Model model, Principal principal) {
        User user = userService.findUserByEmail(principal.getName());
        model.addAttribute("user", user);
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("roles", roleService.getRoles());
        return "/admin";
    }

    @PostMapping("/edit_user/{id}")
    public String showFormForEditUser(@Valid @ModelAttribute("editUser") User user, BindingResult bindingResult,
                                      @RequestParam("roles") Set<Role> roles,
                                      @PathVariable("id") Long id, Model model) {
        model.addAttribute("editUser", userService.findUserById(id));
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("roles", roleService.getRoles());
        if (bindingResult.hasErrors()) {
            return "redirect:/admin/"; // Предположительно, должно быть имя представления
        } else {
            user.setRoles(roles); // Используем полученные роли напрямую
            user.setId(id);
            userService.editUser(user);
            return "redirect:/admin/";
        }
    }

    @PostMapping("/delete_user/{id}")
    public String deleteUser(@PathVariable("id") long id,
                             @ModelAttribute("deleteUser") User deleteUser, Model model) {
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("user", userService.findUserById(id));
        userService.deleteUser(id);
        return "redirect:/admin/";
    }

    @GetMapping("/add_user")
    public String showFormForAddUser(@ModelAttribute("addUser") User User, Model model) {
        model.addAttribute("addUser", new User());
        return "/admin";
    }

    @PostMapping("/add_user")
    public String addUser(@ModelAttribute("addUser") @Valid User user, BindingResult bindingResult, Model model,
                          @RequestParam("roles") Set<Role> roles) {
        if (bindingResult.hasErrors()) {
            return "redirect:/admin/"; // Предположительно, должно быть имя представления
        } else {
            user.setRoles(roles); // Используем полученные роли напрямую
            userService.saveUser(user);
            model.addAttribute("addUser", user);
            return "redirect:/admin/";
        }
    }
}