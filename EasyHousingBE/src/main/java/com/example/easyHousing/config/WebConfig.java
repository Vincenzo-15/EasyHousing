package com.example.easyHousing.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Collega l'URL "/foto-immobili/" alla cartella fisica "uploads" del tuo PC
        String uploadPath = "file:" + System.getProperty("user.dir") + "/uploads/";

        registry.addResourceHandler("/foto-immobili/**")
                .addResourceLocations(uploadPath);
    }
}