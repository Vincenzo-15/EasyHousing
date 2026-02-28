package com.example.immobiliareClone.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Dice a Spring: "Quando qualcuno chiede un URL che inizia con /foto-immobili/,
        // vai a cercare il file nella cartella 'uploads' del computer"
        registry.addResourceHandler("/foto-immobili/**")
                .addResourceLocations("file:uploads/");
    }
}