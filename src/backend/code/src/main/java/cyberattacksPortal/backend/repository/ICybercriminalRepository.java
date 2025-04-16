package cyberattacksPortal.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import cyberattacksPortal.backend.model.Cybercriminal;

@Repository
public interface ICybercriminalRepository extends MongoRepository<Cybercriminal, String> {
	public Cybercriminal findByName(final String name);
}
