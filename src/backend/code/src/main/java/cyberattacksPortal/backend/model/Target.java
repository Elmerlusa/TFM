package cyberattacksPortal.backend.model;

import java.util.Set;

import lombok.Data;

@Data
public class Target {
	private String name;
	private String sector;
	private Integer cnae;
	private String contact;
	private Set<String> regions;
	private String country;
	private Set<String> addresses;
	private String email;
}
