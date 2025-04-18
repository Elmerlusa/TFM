package cyberattacksPortal.backend.model;

import java.time.LocalDate;
import java.util.LinkedHashMap;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "globalStats")
@Data
public class GlobalStats {
	@Id
	private String id;
	private LinkedHashMap<String, Integer> attacksByGroup;
	private LinkedHashMap<String, Integer> attacksByRegion;
	private LinkedHashMap<String, Integer> attacksBySector;
	private LinkedHashMap<String, Integer> attacksByTarget;
	private LinkedHashMap<String, Integer> attacksByType;
	private LinkedHashMap<LocalDate, Integer> attacksByDate;
	private Long numGroups;
	private Long totalAttacks;

	// Calculados
	private Long totalAttacksThreeMonths;
}
