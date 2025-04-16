package cyberattacksPortal.backend.model;

import java.util.LinkedHashMap;

import lombok.Data;

@Data
public class CybercriminalStats {
	private LinkedHashMap<String, Integer> attacksByRegion;
	private LinkedHashMap<String, Integer> attacksBySector;
	private LinkedHashMap<String, Integer> attacksByTarget;
	private LinkedHashMap<String, Integer> attacksByType;
	private Integer totalAttacks;
}
