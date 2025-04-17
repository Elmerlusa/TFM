package cyberattacksPortal.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

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
		final List<Attack> attacks = this.attackRepository.findAbstractAll();

		if (attacks.isEmpty()) {
			log.error("no existen datos sobre ciberataques");
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "error");
		}
		return attacks.stream().map(this::attackToDTO).toList();
	}

	@Override
	public List<CybercriminalDTO> getCybercriminals() {
		final List<Cybercriminal> cybercriminals = this.cybercriminalRepository.findAbstractAll();

		if (cybercriminals.isEmpty()) {
			log.error("no existen datos sobre cibercriminales");
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "error");
		}
		return cybercriminals.stream().map(this::cybercriminalToDTO).toList();
	}

	@Override
	public Attack getAttack(final Integer incidentId) {
		final Attack attack = this.attackRepository.findByIncidentId(incidentId);
		Cybercriminal cybercriminal;

		if (attack == null) {
			log.warn("ciberataque con id {} no encontrado", incidentId);
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "incidente no encontrado");
		}
		cybercriminal = this.cybercriminalRepository.findByName(attack.getCybercriminalName());
		if (cybercriminal == null) {
			log.warn("ciberdelincuente {} no encontrado", attack.getCybercriminalName());
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ciberdelincuente no encontrado");
		}
		attack.setCybercriminal(cybercriminal);
		return attack;
	}

	@Override
	public Cybercriminal getCybercriminal(final String name) {
		final Cybercriminal cybercriminal = this.cybercriminalRepository.findByName(name);
		List<Attack> attacks;
		
		if (cybercriminal == null) {
			log.warn("ciberdelincuente {} no encontrado", name);
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ciberdelincuente no encontrado");
		}
		attacks = this.attackRepository.findAbstractAllByCybercriminalName(name);
		if (attacks.size() == 0) {
			log.warn("ciberdelincuente {} sin ataques", name);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "error");
		}
		cybercriminal.setAttacks(attacks.stream().map(this::attackToDTO).toList());
		return cybercriminal;
	}

	@Override
	public GlobalStats getGlobalStats() {
		final List<GlobalStats> globalStatsList = this.globalStatsRepository.findAll();
		final List<LocalDate> attackDates = this.attackRepository.findDetectedAtAll().stream()
			.map(a -> a.getDetectedAt().toLocalDate()).toList();
		LocalDate threeMonthsAgo = LocalDate.now().minusMonths(3);
		Long totalAttacksThreeMonths;
		LinkedHashMap<LocalDate, Integer> attacksByDate;
		GlobalStats globalStats;

		if (globalStatsList.isEmpty() || attackDates.isEmpty()) {
			log.error("no existen datos sobre estadísticas globales");
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "error");
		}
		globalStats = globalStatsList.get(0);
		totalAttacksThreeMonths = attackDates.stream()
			.filter(d -> threeMonthsAgo.isBefore(d))
			.count();
		globalStats.setTotalAttacksThreeMonths(totalAttacksThreeMonths);
		attacksByDate = attackDates.stream()
			.collect(Collectors.toMap(d -> d, d -> 1, Integer::sum, LinkedHashMap::new));
		globalStats.setAttacksByDate(attacksByDate);
		return globalStats;
	}

	private AttackDTO attackToDTO(final Attack attack) {
		return new AttackDTO(
			attack.getIncidentId(),
			attack.getDetectedAt(),
			attack.getType(),
			attack.getTarget().getName(),
			attack.getCybercriminalName()
		);
	}

	private CybercriminalDTO cybercriminalToDTO(final Cybercriminal cybercriminal) {
		return new CybercriminalDTO(
			cybercriminal.getName(),
			cybercriminal.getLastAttackAt(),
			cybercriminal.getStats().getTotalAttacks()
		);
	}
}
