package cyberattacksPortal.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import cyberattacksPortal.backend.model.Attack;

public interface IAttackRepository extends MongoRepository<Attack, String> {
	
	Optional<Attack> findById(final Integer id);

	@Query(value = "{}", fields = """
	{
		'detectedAt': 1,
		'type': 1,
		'target.name': 1,
		'cybercriminalName': 1
	}
	""", sort = "{'detectedAt': -1}")
	List<Attack> findAbstractAll();

	@Query(value = "{'cybercriminalName': '?0'}", fields = """
	{
		'detectedAt': 1,
		'type': 1,
		'target.name': 1,
		'cybercriminalName': 1
	}
	""", sort = "{'detectedAt': -1}")
	List<Attack> findAbstractAllByCybercriminalName(final String cybercriminalName);
}
