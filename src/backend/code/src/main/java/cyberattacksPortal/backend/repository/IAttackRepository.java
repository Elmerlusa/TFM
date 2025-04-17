package cyberattacksPortal.backend.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import cyberattacksPortal.backend.model.Attack;

public interface IAttackRepository extends MongoRepository<Attack, String> {
	@Query(value = "{}", fields = """
	{
		'detectedAt': 1,
		'_id': 0
	}
	""")
	List<Attack> findDetectedAtAll();
	@Query(value = "{}", fields = """
	{
		'incidentId': 1,
		'detectedAt': 1,
		'type': 1,
		'target.name': 1,
		'cybercriminalName': 1
		'_id': 0
	}
	""")
	List<Attack> findAbstractAll();
	@Query(value = "{'cybercriminalName': '?0'}", fields = """
	{
		'incidentId': 1,
		'detectedAt': 1,
		'type': 1,
		'target.name': 1,
		'cybercriminalName': 1
		'_id': 0
	}
	""")
	List<Attack> findAbstractAllByCybercriminalName(final String cybercriminalName);
	Attack findByIncidentId(final Integer incidentId);
}
