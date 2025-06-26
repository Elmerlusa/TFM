package cyberattacksPortal.backend.model.DTO;

import java.util.Map;

import cyberattacksPortal.backend.model.ValueUnit;

public record CybercriminalStatsDTO (
	long attackCount,
	int totalDisclosures,
	ValueUnit totalLeakSize,
	long totalLeakFiles,
	Map<String, Long> targetCounts
) {}
