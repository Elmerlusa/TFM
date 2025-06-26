package cyberattacksPortal.backend.model;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "scraped_attacks")
@Data
public class Attack {
	@Id
	private String id;
	private Cybercriminal cybercriminal;
	private Disclosures disclosures;
	private ValueUnit leakSize;
	private Integer leakFiles;
	private Target target;
	
	// extra
	private LocalDate detectedAt;

	// private String type;
	// private String description;
	// private Integer clientsAffected;
	// private Integer recordsAffected;
	// private String reputationalImpact;
	// private Integer downtimeHours;
	// private Target target;
	// private String cybercriminalName;
}
