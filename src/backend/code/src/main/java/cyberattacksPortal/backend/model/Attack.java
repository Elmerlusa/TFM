package cyberattacksPortal.backend.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "attacks")
@Data
public class Attack {
	@Id
	private String id;
	private Integer incidentId;
	private LocalDateTime detectedAt;
	private LocalDateTime notifiedAt;
	private String type;
	private String description;
	private Integer clientsAffected;
	private Integer recordsAffected;
	private String reputationalImpact;
	private Integer downtimeHours;
	private Target target;
	private String cybercriminalName;

	// Calculados
	private Cybercriminal cybercriminal;
}
