package cyberattacksPortal.backend.model;

import java.time.LocalDateTime;

public record AttackDTO (
	Integer id,
	LocalDateTime detectedAt,
	String type,
	String targetName,
	String cybercriminalName
) {}
