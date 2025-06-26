package cyberattacksPortal.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import cyberattacksPortal.backend.model.Attack;

public interface IAttackRepository extends MongoRepository<Attack, String> {
	
	Optional<Attack> findById(final String id);

	@Query(value = "{}", fields = """
		{
			'cybercriminal.name': 1,
			'target.name': 1,
			'leakSize': 1,
			'detectedAt': 1
		}
	""")
	List<Attack> findAbstractAll();

	@Query(value = "{'cybercriminal.name': '?0'}", fields = """
		{
			'cybercriminal.name': 1,
			'target.name': 1,
			'leakSize': 1,
			'detectedAt': 1
		}
	""")
	List<Attack> findAbstractAllByCybercriminalName(final String cybercriminalName);

	@Query(value = "{}", fields = """
		{
			'_id': 0,
			'cybercriminal.name': 1
		}		
	""")
	List<Attack> findCybercriminalNames();

	@Query(value = "{'cybercriminal.name': '?0'}")
	List<Attack> findAllByCybercriminalName(final String cybercriminalName);
}
