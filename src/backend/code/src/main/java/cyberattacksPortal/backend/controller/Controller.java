package cyberattacksPortal.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cyberattacksPortal.backend.model.Attack;
import cyberattacksPortal.backend.model.DTO.AttackDTO;
import cyberattacksPortal.backend.model.DTO.CybercriminalDTO;
import cyberattacksPortal.backend.model.DTO.CybercriminalDetailDTO;
import cyberattacksPortal.backend.model.DTO.StatsDTO;
import cyberattacksPortal.backend.service.ICyberattacksService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class Controller {
	private final ICyberattacksService cyberattacksService;

	@GetMapping("/health")
	public boolean getHealth() {
		return true;
	}

	@GetMapping("/ciberataques")
	public List<AttackDTO> getAttacks() {
		return this.cyberattacksService.getAttacks();
	}

	@GetMapping("/ciberdelincuentes")
	public List<CybercriminalDTO> getCybercriminals() {
		return this.cyberattacksService.getCybercriminals();
	}

	@GetMapping("/ciberataques/{id}")
	public Attack getAttack(@PathVariable final String id) {
		return this.cyberattacksService.getAttack(id);
	}

	@GetMapping("/ciberdelincuentes/{name}")
	public CybercriminalDetailDTO getCybercriminalAttacks(@PathVariable final String name) {
		return this.cyberattacksService.getCybercriminalDetails(name);
	}

	@GetMapping("/estadisticas")
	public StatsDTO getGlobalStats() {
		return this.cyberattacksService.getGlobalStats();
	}
}
