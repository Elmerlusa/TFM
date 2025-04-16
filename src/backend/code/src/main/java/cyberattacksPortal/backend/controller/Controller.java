package cyberattacksPortal.backend.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import cyberattacksPortal.backend.model.Attack;
import cyberattacksPortal.backend.model.AttackDTO;
import cyberattacksPortal.backend.model.Cybercriminal;
import cyberattacksPortal.backend.model.CybercriminalDTO;
import cyberattacksPortal.backend.model.GlobalStats;
import cyberattacksPortal.backend.service.ICyberattacksService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class Controller {
	private final ICyberattacksService cyberattacksService;
	
	@GetMapping("")
	public void index(final HttpServletResponse response) {
		try {
			response.sendRedirect("/estadisticas");
		} catch (final IOException e) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "error");
		}
	}

	@GetMapping("/ciberataques")
	public List<AttackDTO> getAttacks() {
		return this.cyberattacksService.getAttacks();
	}

	@GetMapping("/ciberdelincuentes")
	public List<CybercriminalDTO> getCybercriminals() {
		return this.cyberattacksService.getCybercriminals();
	}

	@GetMapping("/ciberataques/{incidentId}")
	public Attack getAttack(@PathVariable final Integer incidentId) {
		return this.cyberattacksService.getAttack(incidentId);
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
