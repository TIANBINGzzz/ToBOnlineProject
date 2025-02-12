package com.steam.project.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.ObjectUtil;
import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch._types.query_dsl.*;
import co.elastic.clients.json.JsonData;
import com.steam.common.domain.result.PageResult;
import com.steam.common.domain.result.Result;
import com.steam.common.utils.UserContext;
import com.steam.project.dao.ProjectRepository;
import com.steam.project.domain.dto.ProjectDTO;
import com.steam.project.domain.dto.ProjectPageQuery;
import com.steam.project.domain.po.Project;
import com.steam.project.domain.po.ProjectList;
import com.steam.project.domain.vo.CompanyTopReportVO;
import com.steam.project.domain.vo.ProjectListVO;
import com.steam.project.domain.vo.ProjectReportVO;
import com.steam.project.domain.vo.ProjectVO;
import com.steam.project.service.IProjectService;
import com.steam.project.utils.DateUtils;
import jakarta.annotation.Resource;
import org.apache.commons.lang.StringUtils;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.client.elc.NativeQueryBuilder;
import org.springframework.data.elasticsearch.core.IndexOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.HighlightQuery;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.data.elasticsearch.core.query.UpdateQuery;
import org.springframework.data.elasticsearch.core.query.highlight.Highlight;
import org.springframework.data.elasticsearch.core.query.highlight.HighlightField;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.DateOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;

import java.sql.Date;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import static com.steam.common.constants.RedisConstants.BASE_EXPIRE_TIME;
import static com.steam.common.constants.RedisConstants.RANDOM_EXPIRE_TIME;

@Service
public class ProjectServiceImpl implements IProjectService {
    @Resource
    private ProjectRepository projectRepository;

    @Resource
    private MongoTemplate mongoTemplate;

    @Resource
    private ElasticsearchOperations elasticsearchOperations;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    private final Random random = new Random();

    // starting for the first time or changing the database structure
//    @EventListener(ApplicationReadyEvent.class)
//    public void createIndex() {
//        mongoTemplate.dropCollection("project");
//        mongoTemplate.createCollection("project");
//        IndexOperations indexOps = elasticsearchOperations.indexOps(ProjectList.class);
//        indexOps.delete();
//        indexOps.create();
//        indexOps.putMapping();
//    }

    public Result<ProjectList> save(ProjectDTO projectDTO) {
        // check permissions
        if (!"company".equals(UserContext.get("role"))) {
            return Result.error(401, "No permissions to create project");
        }
        if (ObjectUtil.isEmpty(UserContext.get("userName"))) {
            return Result.error(403, "Lack of basic information");
        }
        Project project = BeanUtil.toBean(projectDTO, Project.class);
        // fill uuid and create time
        project.init();
        project.setCompanyId(UserContext.get("userId"));
        project.setCompanyName(UserContext.get("userName"));
        // save project to mongoDB
        try {
            projectRepository.save(project);
        } catch (Exception e) {
            return Result.error(403, "can't save project: " + e.getMessage());
        }
        // save project to ES
        ProjectList projectList = new ProjectList();
        BeanUtil.copyProperties(project, projectList, "id", "createTime");
        projectList.setId(project.getId());
        projectList.setCreateTime(project.getCreateTime().toLocalDate());
        try {
            elasticsearchOperations.save(projectList);
        } catch (Exception e) {
            // delete saved project in mongoDB
            projectRepository.deleteById(project.getId());
            return Result.error(403, "can't save project: " + e.getMessage());
        }
        return Result.success(projectList);
    }

    public Result<String> update(ProjectDTO projectDTO) {

        Project project = projectRepository.findById(projectDTO.getId()).orElse(null);
        if (project == null) {
            return Result.error(404, "can't find project");
        }
        // check permissions
        if (!UserContext.get("userId").equals(project.getCompanyId()) && !"admin".equals(UserContext.get("role")) && !"super".equals(UserContext.get("role"))) {
            return Result.error(401, "No permissions to update project");
        }

        String redisKey = "cache:project:" + projectDTO.getId();
        // delete cache
        redisTemplate.delete(redisKey);

        // update mongoDB
        BeanUtil.copyProperties(projectDTO, project);
        try {
            projectRepository.save(project);
        } catch (Exception e) {
            return Result.error(403, "can't update project: " + e.getMessage());
        }
        // update ES
        if (!project.getStartTime().isAfter(LocalDate.now())) {
            ProjectList projectList = BeanUtil.toBean(project, ProjectList.class);
            elasticsearchOperations.update(projectList);
        }

        // delay to delete cache again -- 2 seconds
        scheduler.schedule(() -> {
            redisTemplate.delete(redisKey);
        }, 2000, TimeUnit.MILLISECONDS);

        return Result.success();
    }

    public Result<String> delete(String id) {
        Project project = projectRepository.findById(id).orElse(null);
        if (project == null) {
            return Result.error(404, "can't find project");
        }
        // check permissions
        if (!UserContext.get("userId").equals(project.getCompanyId()) && !"admin".equals(UserContext.get("role")) && !"super".equals(UserContext.get("role"))) {
            return Result.error(401, "No permissions to update project");
        }

        String redisKey = "cache:project:" + id;
        // delete cache
        redisTemplate.delete(redisKey);

        // delay to delete cache again -- 2 seconds
        scheduler.schedule(() -> {
            redisTemplate.delete(redisKey);
        }, 2000, TimeUnit.MILLISECONDS);

        // delete mongoDB
        try {
            projectRepository.deleteById(id);
        } catch (Exception e) {
            return Result.error(403, "delete project error: " + e.getMessage());
        }
        // delete ES
        try {
            elasticsearchOperations.delete(id, ProjectList.class);
        } catch (Exception e) {
            projectRepository.save(project);
            return Result.error(500, "can't delete project: " + e.getMessage());
        }

        return Result.success();
    }

    public Result<ProjectVO> findById(String id) {
        // try to get press from cache
        String redisKey = "cache:project:" + id;
        ProjectVO projectVO = (ProjectVO) redisTemplate.opsForValue().get(redisKey);
        if (projectVO != null) {
            return Result.success(projectVO);
        }

        // select press from database
        try {
            Project project = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("can't find project: " + id));
            projectVO = new ProjectVO();
            BeanUtil.copyProperties(project, projectVO, "task");
            // store project to cache with random expire time
            int expireTime = BASE_EXPIRE_TIME + random.nextInt(RANDOM_EXPIRE_TIME);
            redisTemplate.opsForValue().set(redisKey, projectVO, expireTime, TimeUnit.SECONDS);

            return Result.success(projectVO);
        } catch (RuntimeException e) {
            return Result.error(403, e.getMessage());
        } catch (Exception e) {
            return Result.error(500, "Unexpected error: " + e.getMessage());
        }
    }

    public Result<PageResult> findList(ProjectPageQuery projectQuery) {
        NativeQueryBuilder nativeQueryBuilder = NativeQuery.builder();
        BoolQuery.Builder boolQuery = QueryBuilders.bool();
        // sort
        Sort sort = Sort.by(new Sort.Order(projectQuery.getAcs()?Sort.Direction.ASC:Sort.Direction.DESC, projectQuery.getSort()));
        // page start from 0
        PageRequest pageRequest = PageRequest.of(projectQuery.getStart(), projectQuery.getSize());
        // select title
        if (ObjectUtil.isNotEmpty(projectQuery.getKey())) {
            // highlight
            HighlightQuery highlightQuery = new HighlightQuery(
                    new Highlight(List.of(new HighlightField("name"))),
                    ProjectList.class
            );
            boolQuery.must(QueryBuilders.match(builder -> new MatchQuery.Builder().field("name").query(projectQuery.getKey())));
            nativeQueryBuilder.withHighlightQuery(highlightQuery);
        }
        // select publisher name
        if (ObjectUtil.isNotEmpty(projectQuery.getCompany())) {
            // highlight
            HighlightQuery highlightQuery = new HighlightQuery(
                    new Highlight(List.of(new HighlightField("company"))),
                    ProjectList.class
            );
            boolQuery.must(QueryBuilders.match(builder -> new MatchQuery.Builder().field("company").query(projectQuery.getCompany())));
            nativeQueryBuilder.withHighlightQuery(highlightQuery);
        }
        // select project type/location
        if (ObjectUtil.isNotEmpty(projectQuery.getOnline())) {
            boolQuery.must(QueryBuilders.term(t -> t
                    .field("online")
                    .value(projectQuery.getOnline())
            ));
        }
        if (ObjectUtil.isNotEmpty(projectQuery.getAddressCountry())) {
            boolQuery.must(QueryBuilders.term(t -> t
                    .field("addressCountry")
                    .value(projectQuery.getAddressCountry())
            ));
        }
        if (ObjectUtil.isNotEmpty(projectQuery.getAddressCity())) {
            boolQuery.must(QueryBuilders.term(t -> t
                    .field("addressCity")
                    .value(projectQuery.getAddressCity())
            ));
        }
        // select project skill
        if (ObjectUtil.isNotEmpty(projectQuery.getSkill())) {
            List<FieldValue> skillValues = projectQuery.getSkill().stream()
                    .map(FieldValue::of)
                    .toList();
            boolQuery.must(QueryBuilders.terms(t -> t
                    .field("skill")
                    .terms(TermsQueryField.of(tf -> tf.value(skillValues))
                    )
            ));
        }
        // range start time and end time
        RangeQuery.Builder rangeQuery = QueryBuilders.range();
        boolean hasTimeConditions = false;
        if (ObjectUtil.isNotEmpty(projectQuery.getStartTime())) {
            rangeQuery.field("startTime")
                    .gte(JsonData.of(DateUtils.formatLocalDate(projectQuery.getStartTime())));
            hasTimeConditions = true;
        }
        if (ObjectUtil.isNotEmpty(projectQuery.getEndTime())) {
            rangeQuery.field("endTime")
                    .lte(JsonData.of(DateUtils.formatLocalDate(projectQuery.getEndTime())));
            hasTimeConditions = true;
        }
        if (hasTimeConditions) {
            boolQuery.must(rangeQuery.build()._toQuery());
        }
        // combine query conditions
        if (boolQuery.hasClauses()) {
            nativeQueryBuilder.withQuery(boolQuery.build()._toQuery());
        }
        Query query = nativeQueryBuilder
                .withSort(sort)
                .withPageable(pageRequest)
                .build();

        SearchHits<ProjectList> searchHits = elasticsearchOperations.search(query, ProjectList.class);
        List<ProjectList> list = searchHits.stream().map(SearchHit::getContent).toList();

        return Result.success(new PageResult(searchHits.getTotalHits(), list));
    }

    @Override
    public List<ProjectListVO> findByIds(List<String> ids) {

        return BeanUtil.copyToList(projectRepository.findAllById(ids), ProjectListVO.class);
    }

    @Override
    public void updateScore(String id, Integer score) {
        Project project = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("can't find project: " + id));
        Long scoreNumber = project.getScoreNumber();
        project.setScore(((project.getScore() * scoreNumber) + score) / (scoreNumber + 1));
        project.setScoreNumber(scoreNumber + 1);
        projectRepository.save(project);
    }

    @Override
    public Result<PageResult> findByStatus(String id, ProjectPageQuery projectQuery) {
        org.springframework.data.mongodb.core.query.Query query = new org.springframework.data.mongodb.core.query.Query();
        // company
        query.addCriteria(Criteria.where("company_id").is(id));
        // set status
        if (projectQuery.getStatus() == 0) {
            query.addCriteria(Criteria.where("start_time").gt(LocalDate.now()))
                    .with(Sort.by(Sort.Order.desc("create_time")));
        } else if (projectQuery.getStatus() == 1) {
            query.addCriteria(Criteria.where("start_time").lte(LocalDate.now()))
                    .addCriteria(Criteria.where("end_time").gte(LocalDate.now()))
                    .with(Sort.by(Sort.Order.desc("start_time")));
        } else {
            query.addCriteria(Criteria.where("end_time").lt(LocalDate.now()))
                    .with(Sort.by(Sort.Order.desc("end_time")));
        }
        // page
        query.with(PageRequest.of(projectQuery.getStart(), projectQuery.getSize()));
        List<Project> projects = mongoTemplate.find(
                query,
                Project.class
        );
        PageResult pageResult = new PageResult(projects.size(), BeanUtil.copyToList(projects, ProjectListVO.class));
        return Result.success(pageResult);
    }

    @Override
    public void updateName(String id, String name) {
        // update mongoDB
        org.springframework.data.mongodb.core.query.Query query = new org.springframework.data.mongodb.core.query.Query();
        query.addCriteria(Criteria.where("company_id").is(id));
        Update update = new Update();
        update.set("company_name", name);
        mongoTemplate.updateMulti(query, update, Project.class);
        // clear redis
        query.fields().include("_id");
        List<String> projectIds = mongoTemplate.findDistinct(query, "_id", "project", String.class);
        projectIds.forEach(projectId -> {
            // delete cache
            redisTemplate.delete("cache:project:" + projectId);
        });
        // update ES
        Query queryES = NativeQuery.builder()
                .withQuery(QueryBuilders.term(builder -> new TermQuery.Builder().field("companyId").value(id)))
                .build();
        SearchHits<ProjectList> searchHits = elasticsearchOperations.search(queryES, ProjectList.class);
        List<ProjectList> list = searchHits.stream().map(SearchHit::getContent).toList();
        List<UpdateQuery> operations = new ArrayList<>();
        for (ProjectList projectList : list) {
            ProjectList updateDocument = new ProjectList();
            updateDocument.setCompanyName(name);
            UpdateQuery updateQuery = UpdateQuery.builder(projectList.getId())
                    .withScript("ctx._source.companyName = params.name")
                    .withParams(Collections.singletonMap("name", name))
                    .build();
            operations.add(updateQuery);
        }
        elasticsearchOperations.bulkUpdate(operations, ProjectList.class);
    }



    @Override
    public Result<ProjectReportVO> countProject(LocalDate begin, LocalDate end) {
        Date beginDate = Date.valueOf(begin);
        Date endDate = Date.valueOf(end.plusDays(1));
        // get data
        org.springframework.data.mongodb.core.query.Query query = new org.springframework.data.mongodb.core.query.Query();
        query.addCriteria(Criteria.where("create_time").lt(beginDate));
        long totalCount = mongoTemplate.count(query, "project");
        Map<LocalDate, Integer> addedProject = countProjectMapping("create_time", beginDate, endDate);
        Map<LocalDate, Integer> startProject = countProjectMapping("start_time", beginDate, endDate);
        Map<LocalDate, Integer> completeProject = countProjectMapping("end_time", beginDate, endDate);
        // transfer to result
        ArrayList<LocalDate> dateList = new ArrayList<>();
        ArrayList<Long> totalList = new ArrayList<>();
        ArrayList<Integer> addedList = new ArrayList<>();
        ArrayList<Integer> startList = new ArrayList<>();
        ArrayList<Integer> completeList = new ArrayList<>();

        for (LocalDate date = begin; !date.isAfter(end); date = date.plusDays(1)) {
            dateList.add(date);
            Integer newProjectCount = addedProject.getOrDefault(date, 0);
            addedList.add(newProjectCount);
            totalCount += newProjectCount.longValue();
            totalList.add(totalCount);
            startList.add(startProject.getOrDefault(date, 0));
            completeList.add(completeProject.getOrDefault(date, 0));
        }
        return Result.success(
                ProjectReportVO.builder()
                        .dateList(StringUtils.join(dateList, ","))
                        .totalProjectList(StringUtils.join(totalList, ","))
                        .newProjectList(StringUtils.join(addedList, ","))
                        .startProjectList(StringUtils.join(startList, ","))
                        .completeProjectList(StringUtils.join(completeList, ","))
                        .build()
        );
    }

    @Override
    public Result<CompanyTopReportVO> rateCompany(LocalDate begin, LocalDate end) {
        Date beginDate = Date.valueOf(begin);
        Date endDate = Date.valueOf(end.plusDays(1));
        // get data
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("create_time").gte(beginDate).lte(endDate)),
                Aggregation.group("company_id")
                        .count().as("count")
                        .first("company_name").as("name"),
                Aggregation.sort(Sort.by(Sort.Order.desc("count"))),
                Aggregation.limit(5)
        );
        AggregationResults<Map> results = mongoTemplate.aggregate(aggregation, "project", Map.class);
        // transfer to result
        ArrayList<String> nameList = new ArrayList<>();
        ArrayList<Integer> numberList = new ArrayList<>();
        results.getMappedResults().forEach(
                entry -> {
                    nameList.add((String) entry.get("name"));
                    numberList.add((Integer) entry.get("count"));
                }
        );
        return Result.success(
                CompanyTopReportVO.builder()
                        .nameList(StringUtils.join(nameList, ","))
                        .numberList(StringUtils.join(numberList, ","))
                        .build()
        );
    }

    private Map<LocalDate, Integer> countProjectMapping(String field, Date beginDate, Date endDate) {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where(field).gte(beginDate).lte(endDate)),
                Aggregation.project()
                        .and(field).as(field)
                        .and(DateOperators.dateOf(field)
                                .withTimezone(DateOperators.Timezone.valueOf("Australia/Sydney"))
                                .toString("%Y-%m-%d")
                        ).as("dateFormatted"),
                Aggregation.group("dateFormatted").count().as("count")
        );
        AggregationResults<Map> results = mongoTemplate.aggregate(aggregation, "project", Map.class);
        return results.getMappedResults().stream()
                .collect(Collectors.toMap(
                        entry -> LocalDate.parse(entry.get("_id").toString()),
                        entry -> Integer.valueOf(entry.get("count").toString())
                ));
    }
}
