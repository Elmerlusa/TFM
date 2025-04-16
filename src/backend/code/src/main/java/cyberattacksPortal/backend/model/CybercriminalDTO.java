package cyberattacksPortal.backend.model;

import java.time.LocalDateTime;

public record CybercriminalDTO (
	String name,
	LocalDateTime lastAttackAt,
	Integer totalAttacks
) {}
