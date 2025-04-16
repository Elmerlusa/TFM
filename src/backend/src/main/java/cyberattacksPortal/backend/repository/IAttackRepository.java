package cyberattacksPortal.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import cyberattacksPortal.backend.model.Attack;

public interface IAttackRepository extends MongoRepository<Attack, String> {
	public Attack findByIncidentId(final Integer incidentId);
}
