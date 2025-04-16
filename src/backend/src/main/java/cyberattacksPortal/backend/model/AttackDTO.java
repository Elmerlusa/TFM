package cyberattacksPortal.backend.model;

import java.time.LocalDateTime;

public record AttackDTO (
	Integer incidentId,
	LocalDateTime detectedAt,
	String type,
	String targetName,
	String cybercriminalName
) {}
