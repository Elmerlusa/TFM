package cyberattacksPortal.backend.service;

import java.util.List;

import cyberattacksPortal.backend.model.Attack;
import cyberattacksPortal.backend.model.AttackDTO;
import cyberattacksPortal.backend.model.Cybercriminal;
import cyberattacksPortal.backend.model.CybercriminalDTO;
import cyberattacksPortal.backend.model.GlobalStats;

public interface ICyberattacksService {
	List<AttackDTO> getAttacks();
	List<CybercriminalDTO> getCybercriminals();
	Attack getAttack(final Integer incidentId);
	Cybercriminal getCybercriminal(final String name);
	GlobalStats getGlobalStats();
}
