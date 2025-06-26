package cyberattacksPortal.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Revenue {
	private Double value;
	private String multiplier;
	private String unit;
}
