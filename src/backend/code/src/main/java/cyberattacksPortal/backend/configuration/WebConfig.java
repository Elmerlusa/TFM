package cyberattacksPortal.backend.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class WebConfig implements WebMvcConfigurer {
	@Value("${cors.origins.allowed}")
	private String allowedOrigin;

	@Override
	public void addCorsMappings(final CorsRegistry corsRegistry) {
		log.info("Allowed origins: {}", allowedOrigin);
		corsRegistry.addMapping("/**")
			.allowedOrigins(allowedOrigin)
			.allowedMethods("GET");
	}
}
