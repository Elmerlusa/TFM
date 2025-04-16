package cyberattacksPortal.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import cyberattacksPortal.backend.model.GlobalStats;

@Repository
public interface IGlobalStatsRepository extends MongoRepository<GlobalStats, String> {
}
