package cyberattacksPortal.backend.model;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "cybercriminals")
@Data
public class Cybercriminal {
	@Id
	private String id;
	private String name;
	private String onion;
	private String telegram;
	private Set<String> emails;
	private Set<String> wallets;
	private LocalDateTime lastAttackAt;
	private CybercriminalStats stats;
}
