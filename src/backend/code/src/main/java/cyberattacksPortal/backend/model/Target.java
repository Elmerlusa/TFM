package cyberattacksPortal.backend.model;

import lombok.Data;

@Data
public class Target {
	private String name;
	private String website;
	private Integer size;
	private Revenue revenue;
}
