package com.steam.project.task;

import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import co.elastic.clients.json.JsonData;
import com.steam.project.domain.po.ProjectList;
import com.steam.project.utils.DateUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * clean ES
 */
@Component
@RequiredArgsConstructor
public class ProjectTask {

    private final ElasticsearchOperations elasticsearchOperations;

    @Scheduled(cron = "01 00 00 * * ?")
    public void processDeliveryOrder(){

        // start_time before today
        Query query = NativeQuery.builder()
                .withQuery(QueryBuilders
                        .range()
                        .field("startTime")
                        .lte(JsonData.of(DateUtils.formatLocalDate(LocalDate.now())))
                        .build()._toQuery())
                .build();
        // search documents
        List<String> idsToDelete = elasticsearchOperations.search(query, ProjectList.class)
                .stream()
                .map(hit -> hit.getContent().getId())
                .toList();
        // clean ES
        idsToDelete.forEach(id -> elasticsearchOperations.delete(id, ProjectList.class));
    }
}
