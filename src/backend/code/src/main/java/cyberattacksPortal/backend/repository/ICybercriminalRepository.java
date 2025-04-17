package cyberattacksPortal.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import cyberattacksPortal.backend.model.Cybercriminal;

@Repository
public interface ICybercriminalRepository extends MongoRepository<Cybercriminal, String> {
	@Query(value = "{}", fields = """
	{
		'name': 1,
		'lastAttackAt': 1,
		'stats.totalAttacks': 1,
		'_id': 0
	}
	""")
	List<Cybercriminal> findAbstractAll();
	Cybercriminal findByName(final String name);
}
