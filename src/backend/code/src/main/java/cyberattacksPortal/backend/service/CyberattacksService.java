package cyberattacksPortal.backend.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import cyberattacksPortal.backend.model.Attack;
import cyberattacksPortal.backend.model.ValueUnit;
import cyberattacksPortal.backend.model.DTO.AttackDTO;
import cyberattacksPortal.backend.model.DTO.CybercriminalDTO;
import cyberattacksPortal.backend.model.DTO.CybercriminalDetailDTO;
import cyberattacksPortal.backend.model.DTO.CybercriminalStatsDTO;
import cyberattacksPortal.backend.repository.IAttackRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CyberattacksService implements ICyberattacksService {
	private final IAttackRepository attackRepository;

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
		final List<Attack> attacks = this.attackRepository.findCybercriminalNames();

		if (attacks.isEmpty()) {
			log.error("no existen datos sobre cibercriminales");
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "error");
		}
		final Map<String, Long> grouped = attacks.stream()
			.collect(Collectors.groupingBy(attack -> attack.getCybercriminal().getName(), Collectors.counting()));
		return grouped.entrySet().stream()
			.map(entry -> new CybercriminalDTO(entry.getKey(), entry.getValue()))
			.toList();
	}

	@Override
	public Attack getAttack(final String id) {
		final Optional<Attack> attack = this.attackRepository.findById(id);

		if (attack.isEmpty()) {
			log.warn("ciberataque con id {} no encontrado", id);
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "incidente no encontrado");
		}
		return attack.get();
	}

	@Override
	public CybercriminalDetailDTO getCybercriminalDetails(final String name) {
		final List<Attack> attacks = this.attackRepository.findAllByCybercriminalName(name);
		
		if (attacks.isEmpty()) {
			log.warn("ciberdelincuente {} no encontrado", name);
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ciberdelincuente no encontrado");
		}
		return new CybercriminalDetailDTO(
			this.computeStats(attacks),
			attacks.stream().map(this::attackToDTO).toList()
		);
	}

	// @Override
	// public GlobalStats getGlobalStats() {
	// 	final List<GlobalStats> globalStatsList = this.globalStatsRepository.findAll();
	// 	LocalDate threeMonthsAgo = LocalDate.now().minusMonths(3);
	// 	GlobalStats globalStats;
	// 	Long totalAttacksThreeMonths;

	// 	if (globalStatsList.isEmpty()) {
	// 		log.error("no existen datos sobre estadísticas globales");
	// 		throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "error");
	// 	}
	// 	globalStats = globalStatsList.get(0);
	// 	totalAttacksThreeMonths = globalStats.getAttacksByDate().entrySet().stream()
	// 		.filter(e -> threeMonthsAgo.isBefore(e.getKey())).count();
	// 	globalStats.setTotalAttacksThreeMonths(totalAttacksThreeMonths);
	// 	sortStatsMaps(globalStats);
	// 	return globalStats;
	// }

	// private void sortStatsMaps(final GlobalStats globalStats) {
	// 	globalStats.setAttacksByGroup(
	// 		globalStats.getAttacksByGroup().entrySet().stream()
	// 		.sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
	// 		.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new))
	// 	);
	// 	globalStats.setAttacksByType(
	// 		globalStats.getAttacksByType().entrySet().stream()
	// 		.sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
	// 		.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new))
	// 	);
	// 	globalStats.setAttacksByRegion(
	// 		globalStats.getAttacksByRegion().entrySet().stream()
	// 		.sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
	// 		.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new))
	// 	);
	// 	globalStats.setAttacksBySector(
	// 		globalStats.getAttacksBySector().entrySet().stream()
	// 		.sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
	// 		.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new))
	// 	);
	// 	globalStats.setAttacksByTarget(
	// 		globalStats.getAttacksByTarget().entrySet().stream()
	// 		.sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
	// 		.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new))
	// 	);
	// 	globalStats.setAttacksByDate(
	// 		globalStats.getAttacksByDate().entrySet().stream()
	// 		.sorted(Map.Entry.comparingByKey())
	// 		.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new))
	// 	);
	// }

	private CybercriminalStatsDTO computeStats(final List<Attack> attacks) {
		final int totalDisclosures = attacks.stream()
			.mapToInt(a -> a.getDisclosures() != null ? a.getDisclosures().getTotal() : 0)
			.sum();
		final long totalLeakFiles = attacks.stream()
			.mapToLong(a -> a.getLeakFiles() != null ? a.getLeakFiles() : 0)
			.sum();
		final double totalLeakSize = attacks.stream()
			.filter(a -> a.getLeakSize() != null)
			.mapToDouble(a -> this.normalizeLeakSize(a.getLeakSize()))
			.sum();
		final ValueUnit leakSize = this.numberToLeakSize(totalLeakSize);
		final Map<String, Long> targetCounts = attacks.stream()
			.filter(a -> a.getTarget() != null && a.getTarget().getName() != null)
			.collect(Collectors.groupingBy(a -> a.getTarget().getName(), Collectors.counting()));
		
		return new CybercriminalStatsDTO(
			attacks.size(),
			totalDisclosures,
			leakSize,
			totalLeakFiles,
			targetCounts
		);
	}

	private double normalizeLeakSize(final ValueUnit leakSize) {
		switch (leakSize.getUnit().toLowerCase()) {
			case "mb":
				return leakSize.getValue() / 1024;
			case "gb":
				return leakSize.getValue();
			case "tb":
				return leakSize.getValue() * 1024;
			case "pb":
				return leakSize.getValue() * 1024 * 1024;
			default:
				return leakSize.getValue();
		}
	}

	private ValueUnit numberToLeakSize(final Double value) {
		if (value < 1)
			return new ValueUnit(value * 1024, "MB");
		else if (value < 1024)
			return new ValueUnit(value, "GB");
		else if (value < 1024 * 1024)
			return new ValueUnit(value / 1024, "TB");
		else if (value < 1024 * 1024 * 1024)
			return  new ValueUnit(value / (1024 * 1024), "PB");
		else
			return new ValueUnit(value, "GB");
	}

	private AttackDTO attackToDTO(final Attack attack) {
		return new AttackDTO(
			attack.getId(),
			attack.getCybercriminal().getName(),
			attack.getTarget().getName(),
			attack.getLeakSize(),
			attack.getDetectedAt()
		);
	}
}
