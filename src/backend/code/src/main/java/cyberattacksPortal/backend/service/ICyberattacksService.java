package cyberattacksPortal.backend.service;

import java.util.List;

import cyberattacksPortal.backend.model.Attack;
import cyberattacksPortal.backend.model.DTO.AttackDTO;
import cyberattacksPortal.backend.model.DTO.CybercriminalDTO;
import cyberattacksPortal.backend.model.DTO.CybercriminalDetailDTO;

public interface ICyberattacksService {
	List<AttackDTO> getAttacks();
	List<CybercriminalDTO> getCybercriminals();
	Attack getAttack(final String incidentId);
	CybercriminalDetailDTO getCybercriminalDetails(final String name);
	// GlobalStats getGlobalStats();
}
