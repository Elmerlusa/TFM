package cyberattacksPortal.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cyberattacksPortal.backend.model.Attack;
import cyberattacksPortal.backend.model.AttackDTO;
import cyberattacksPortal.backend.model.Cybercriminal;
import cyberattacksPortal.backend.model.CybercriminalDTO;
import cyberattacksPortal.backend.model.GlobalStats;
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
	public Attack getAttack(@PathVariable final Integer id) {
		return this.cyberattacksService.getAttack(id);
	}

	@GetMapping("/ciberdelincuentes/{name}")
	public Cybercriminal getCybercriminal(@PathVariable final String name) {
		return this.cyberattacksService.getCybercriminal(name);
	}

	@GetMapping("/estadisticas")
	public GlobalStats getGlobalStats() {
		return this.cyberattacksService.getGlobalStats();
	}
}
