package cyberattacksPortal.backend.model;

import lombok.Data;

@Data
public class Cybercriminal {
	private String name;

	// extra
	private String telegram;
	private String wallet;
	private String email;
	private String onion;
}
