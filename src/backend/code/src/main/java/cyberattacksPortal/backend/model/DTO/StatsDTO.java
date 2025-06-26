package cyberattacksPortal.backend.model.DTO;

import java.time.LocalDate;
import java.util.LinkedHashMap;

import cyberattacksPortal.backend.model.ValueUnit;

public record StatsDTO (
	long attackCount,
	int totalDisclosures,
	ValueUnit totalLeakSize,
	long totalLeakFiles,
	LinkedHashMap<String, Long> targetCounts,
	LinkedHashMap<String, Long> sectorCounts,
	LinkedHashMap<String, Long> regionCounts,
	LinkedHashMap<String, Long> cybercriminalCounts,
	LinkedHashMap<LocalDate, Long> detectedAtCounts
) {}
