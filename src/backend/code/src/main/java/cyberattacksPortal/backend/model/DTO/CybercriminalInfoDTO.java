package cyberattacksPortal.backend.model.DTO;

import java.util.Set;

public record CybercriminalInfoDTO (
	String name,
	Set<String> telegrams,
	Set<String> wallets,
	Set<String> emails,
	Set<String> onions
) {}
