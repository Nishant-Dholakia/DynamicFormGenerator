package org.project;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public UserDetailsManager userDetailsManager(DataSource dataSource) {
        JdbcUserDetailsManager manager = new JdbcUserDetailsManager(dataSource);
        manager.setUsersByUsernameQuery("SELECT username, password, enabled FROM user WHERE username = ?");
        manager.setAuthoritiesByUsernameQuery("SELECT username, role FROM user WHERE username = ?");
        return manager;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(configurer ->
                configurer
                        .requestMatchers(HttpMethod.POST, "/user/save").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/user/update").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/user/get/{id}").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/user/all").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/user/toggle/{id}").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/user/delete/{id}").hasAuthority("ROLE_ADMIN")

                        .requestMatchers(HttpMethod.POST,"/form/save").hasAnyAuthority("ROLE_ADMIN","ROLE_USER")
                        .requestMatchers(HttpMethod.GET,"/form/get/{id}").hasAnyAuthority("ROLE_ADMIN","ROLE_USER")
                        .requestMatchers(HttpMethod.GET,"/form/all").hasAnyAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT,"/form/update").hasAnyAuthority("ROLE_ADMIN","ROLE_USER")
                        .requestMatchers(HttpMethod.PUT,"/form/toggle/{id}").hasAnyAuthority("ROLE_ADMIN","ROLE_USER")
                        .requestMatchers(HttpMethod.DELETE,"/form/delete/{id}").hasAnyAuthority("ROLE_ADMIN")

                        .requestMatchers(HttpMethod.POST,"/submission/save").hasAnyAuthority("ROLE_ADMIN","ROLE_USER")
                        .requestMatchers(HttpMethod.GET,"/submission/all").hasAnyAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET,"/submission/get/{id}").hasAnyAuthority("ROLE_ADMIN","ROLE_USER")
                        .requestMatchers(HttpMethod.POST,"/submission/form/{id}").hasAnyAuthority("ROLE_ADMIN","ROLE_USER")
                        .requestMatchers(HttpMethod.PUT,"/submission/update").hasAnyAuthority("ROLE_ADMIN","ROLE_USER")
                        .requestMatchers(HttpMethod.POST,"/submission/delete/{id}").hasAnyAuthority("ROLE_ADMIN")

                        .anyRequest().authenticated()
                        );

        http.httpBasic(Customizer.withDefaults());
        http.csrf(csrf -> csrf.disable());
        http.cors(Customizer.withDefaults());
        return http.build();
    }



    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
