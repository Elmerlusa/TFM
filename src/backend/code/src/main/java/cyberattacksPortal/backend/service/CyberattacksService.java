package cyberattacksPortal.backend.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

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
	public Attack getAttack(final Integer id) {
		final Optional<Attack> attack = this.attackRepository.findById(id);
		Optional<Cybercriminal> cybercriminal;

		if (attack.isEmpty()) {
			log.warn("ciberataque con id {} no encontrado", id);
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "incidente no encontrado");
		}
		cybercriminal = this.cybercriminalRepository.findByName(attack.get().getCybercriminalName());
		if (cybercriminal.isEmpty()) {
			log.warn("ciberdelincuente {} no encontrado", attack.get().getCybercriminalName());
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ciberdelincuente no encontrado");
		}
		attack.get().setCybercriminal(cybercriminal.get());
		return attack.get();
	}

	@Override
	public Cybercriminal getCybercriminal(final String name) {
		final Optional<Cybercriminal> cybercriminal = this.cybercriminalRepository.findByName(name);
		List<Attack> attacks;
		
		if (cybercriminal.isEmpty()) {
			log.warn("ciberdelincuente {} no encontrado", name);
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ciberdelincuente no encontrado");
		}
		attacks = this.attackRepository.findAbstractAllByCybercriminalName(name);
		if (attacks.size() == 0) {
			log.warn("ciberdelincuente {} sin ataques", name);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "error");
		}
		cybercriminal.get().setAttacks(attacks.stream().map(this::attackToDTO).toList());
		return cybercriminal.get();
	}

	@Override
	public GlobalStats getGlobalStats() {
		final List<GlobalStats> globalStatsList = this.globalStatsRepository.findAll();
		LocalDate threeMonthsAgo = LocalDate.now().minusMonths(3);
		GlobalStats globalStats;
		Long totalAttacksThreeMonths;

		if (globalStatsList.isEmpty()) {
			log.error("no existen datos sobre estadísticas globales");
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "error");
		}
		globalStats = globalStatsList.get(0);
		totalAttacksThreeMonths = globalStats.getAttacksByDate().entrySet().stream()
			.filter(e -> threeMonthsAgo.isAfter(e.getKey())).count();
		globalStats.setTotalAttacksThreeMonths(totalAttacksThreeMonths);
		return globalStats;
	}

	private AttackDTO attackToDTO(final Attack attack) {
		return new AttackDTO(
			attack.getId(),
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
