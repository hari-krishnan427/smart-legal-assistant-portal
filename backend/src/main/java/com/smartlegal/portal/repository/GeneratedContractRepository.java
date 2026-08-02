package com.smartlegal.portal.repository;

import com.smartlegal.portal.entity.GeneratedContract;
import com.smartlegal.portal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GeneratedContractRepository extends JpaRepository<GeneratedContract, Long> {

    List<GeneratedContract> findByUserOrderByCreatedAtDesc(User user);
}
