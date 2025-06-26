package cyberattacksPortal.backend.model.DTO;

import java.util.List;

public record CybercriminalDetailDTO (
	CybercriminalStatsDTO stats,
	List<AttackDTO> attacks
) {}
