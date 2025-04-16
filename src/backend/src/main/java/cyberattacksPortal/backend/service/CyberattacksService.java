package cyberattacksPortal.backend.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import cyberattacksPortal.backend.model.Attack;
import cyberattacksPortal.backend.model.AttackDTO;
import cyberattacksPortal.backend.model.Cybercriminal;
import cyberattacksPortal.backend.model.CybercriminalDTO;
import cyberattacksPortal.backend.model.GlobalStats;
import cyberattacksPortal.backend.repository.IAttackRepository;
import cyberattacksPortal.backend.repository.ICybercriminalRepository;
import cyberattacksPortal.backend.repository.IGlobalStatsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CyberattacksService implements ICyberattacksService {
	private final IAttackRepository attackRepository;
	private final ICybercriminalRepository cybercriminalRepository;
	private final IGlobalStatsRepository globalStatsRepository;

	@Override
	public List<AttackDTO> getAttacks() {
		final List<Attack> attacks = this.attackRepository.findAll();

		if (attacks.isEmpty()) {
			log.error("no existen datos sobre ciberataques");
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "error");
		}
		return attacks.stream().map(a -> {
				return new AttackDTO(
					a.getIncidentId(),
					a.getDetectedAt(),
					a.getType(),
					a.getTarget().getName(),
					a.getCybercriminalName()
				);
			}).toList();
	}

	@Override
	public List<CybercriminalDTO> getCybercriminals() {
		final List<Cybercriminal> cybercriminals = this.cybercriminalRepository.findAll();

		if (cybercriminals.isEmpty()) {
			log.error("no existen datos sobre cibercriminales");
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "error");
		}
		return cybercriminals.stream().map(c -> {
				return new CybercriminalDTO(
					c.getName(),
					c.getLastAttackAt(),
					c.getStats().getTotalAttacks()
				);
			}).toList();
	}
	@Override
	public Attack getAttack(final Integer incidentId) {
		final Attack attack = this.attackRepository.findByIncidentId(incidentId);

		if (attack == null) {
			log.warn("ciberataque con id {} no encontrado", incidentId);
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "incidente no encontrado");
		}
		return attack;
	}

	@Override
	public Cybercriminal getCybercriminal(final String name) {
		final Cybercriminal cybercriminal = this.cybercriminalRepository.findByName(name);
		
		if (cybercriminal == null) {
			log.warn("ciberdelincuente {} no encontrado", name);
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ciberdelincuente no encontrado");
		}
		return cybercriminal;
	}

	@Override
	public GlobalStats getGlobalStats() {
		List<GlobalStats> globalStats = this.globalStatsRepository.findAll();

		if (globalStats.isEmpty()) {
			log.error("no existen datos sobre estadísticas globales");
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "error");
		}
		return globalStats.get(0);
	}
}
