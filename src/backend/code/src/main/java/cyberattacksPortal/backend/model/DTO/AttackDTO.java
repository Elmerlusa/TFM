package cyberattacksPortal.backend.model.DTO;

import java.time.LocalDate;

import cyberattacksPortal.backend.model.ValueUnit;

public record AttackDTO(
	String id,
	String cybercriminalName,
	String targetName,
	ValueUnit leakSize,
	LocalDate detectedAt
) {}
