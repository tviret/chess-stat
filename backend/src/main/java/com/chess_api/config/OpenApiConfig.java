package com.chess_api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI chessApiOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Chess Stats API")
                        .description("API REST pour la gestion et les statistiques d'échecs : joueurs, tournois, parties, participations, ouvertures.")
                        .version("1.0.0"));
    }
}
