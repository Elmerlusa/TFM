package cyberattacksPortal.backend.model.DTO;

import java.util.List;

public record CybercriminalDetailDTO (
	CybercriminalInfoDTO info,
	StatsDTO stats,
	List<AttackDTO> attacks
) {}
