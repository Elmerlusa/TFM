package cyberattacksPortal.backend.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import cyberattacksPortal.backend.model.Attack;
import cyberattacksPortal.backend.model.Cybercriminal;
import cyberattacksPortal.backend.model.ValueUnit;
import cyberattacksPortal.backend.model.DTO.AttackDTO;
import cyberattacksPortal.backend.model.DTO.CybercriminalDTO;
import cyberattacksPortal.backend.model.DTO.CybercriminalDetailDTO;
import cyberattacksPortal.backend.model.DTO.CybercriminalInfoDTO;
import cyberattacksPortal.backend.model.DTO.StatsDTO;
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
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "no hay ciberataques registrados");
		}
		return attacks.stream().map(this::attackToDTO).toList();
	}

	@Override
	public List<CybercriminalDTO> getCybercriminals() {
		final List<Attack> attacks = this.attackRepository.findCybercriminalNames();

		if (attacks.isEmpty()) {
			log.error("no existen datos sobre cibercriminales");
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "no hay cibercriminales registrados");
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
			this.getCybercriminalInfo(name, attacks),
			this.computeStats(attacks, false),
			attacks.stream().map(this::attackToDTO).toList()
		);
	}

	@Override
	public StatsDTO getGlobalStats() {
		final List<Attack> attacks = this.attackRepository.findAll();
		
		if (attacks.isEmpty()) {
			log.warn("no existen datos sobre ciberataques");
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "no hay ciberataques registrados");
		}
		return this.computeStats(attacks, true);
	}

	private StatsDTO computeStats(final List<Attack> attacks, final boolean computeCybercriminalCounts) {
		// totals
		int totalDisclosures = 0;
		long totalLeakFiles = 0;
		double totalLeakSize = 0;

		for (Attack a : attacks) {
			if (a.getDisclosures() != null)
				totalDisclosures += a.getDisclosures().getTotal();
			if (a.getLeakFiles() != null)
				totalLeakFiles += a.getLeakFiles();
			if (a.getLeakSize() != null)
				totalLeakSize += this.normalizeLeakSize(a.getLeakSize());
		}
		final ValueUnit leakSize = this.numberToLeakSize(totalLeakSize);

		// counts
		final Map<String, Long> targetCounts = attacks.stream()
			.filter(a -> a.getTarget() != null && a.getTarget().getName() != null)
			.collect(Collectors.groupingBy(a -> a.getTarget().getName(), Collectors.counting()));
		final Map<String, Long> sectorCounts = attacks.stream()
			.filter(a -> a.getTarget() != null && a.getTarget().getSector() != null)
			.collect(Collectors.groupingBy(a -> a.getTarget().getSector(), Collectors.counting()));
		final Map<String, Long> regionCounts = attacks.stream()
			.filter(a -> a.getTarget() != null && a.getTarget().getRegion() != null)
			.collect(Collectors.groupingBy(a -> a.getTarget().getRegion(), Collectors.counting()));
		final Map<LocalDate, Long> detectedAtCounts = attacks.stream()
			.filter(a -> a.getDetectedAt() != null)
			.collect(Collectors.groupingBy(a -> a.getDetectedAt(), Collectors.counting()));

		Map<String, Long> cybercriminalCounts = new HashMap<String, Long>();
		if (computeCybercriminalCounts) {
			cybercriminalCounts = attacks.stream()
				.filter(a -> a.getCybercriminal() != null && a.getCybercriminal().getName() != null)
				.collect(Collectors.groupingBy(a -> a.getCybercriminal().getName(), Collectors.counting()));
		}

		return new StatsDTO(
			attacks.size(),
			totalDisclosures,
			leakSize,
			totalLeakFiles,
			this.sortCategoryCountMap(targetCounts),
			this.sortCategoryCountMap(sectorCounts),
			this.sortCategoryCountMap(regionCounts),
			this.sortCategoryCountMap(cybercriminalCounts),
			this.sortDateCountMap(detectedAtCounts)
		);
	}

	private CybercriminalInfoDTO getCybercriminalInfo(final String name, final List<Attack> attacks) {
		final Set<String> telegrams = new HashSet<>();
		final Set<String> wallets = new HashSet<>();
		final Set<String> emails = new HashSet<>();
		final Set<String> onions = new HashSet<>();

		attacks.forEach(a -> {
			final Cybercriminal cybercriminal = a.getCybercriminal();
			
			if (cybercriminal.getTelegram() != null)
				telegrams.add(cybercriminal.getTelegram());
			if (cybercriminal.getWallet() != null)
				wallets.add(cybercriminal.getWallet());
			if (cybercriminal.getEmail() != null)
				emails.add(cybercriminal.getEmail());
			if (cybercriminal.getOnion() != null)
				onions.add(cybercriminal.getOnion());
		});
		return new CybercriminalInfoDTO(name, telegrams, wallets, emails, onions);
	}

	private LinkedHashMap<LocalDate, Long> sortDateCountMap(final Map<LocalDate, Long> map) {
		return map.entrySet().stream()
			.sorted(Map.Entry.comparingByKey())
			.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));
	}

	private LinkedHashMap<String, Long> sortCategoryCountMap(final Map<String, Long> map) {
		return map.entrySet().stream()
			.sorted(Map.Entry.<String, Long>comparingByValue().reversed())
			.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));
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
