// ProjectTabs.js
import React, { useState, useEffect } from 'react';
import { Card, Space, Tag, Tabs, Typography, message } from 'antd';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;
const { TabPane } = Tabs;

const ProjectCard = styled(Card)`
  width: 100%;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

const TabsWrapper = styled(Tabs)`
  margin-left: 10px;
  width: 90%;
`;

const StyledTabPane = styled(TabPane)`
  text-align: center;
  font-size: larger;
  font-weight: bold;
`;

function ProjectTabs() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState({ applying: [], inProgress: [], completed: [] });
    const [projectType, setProjectType] = useState(1); // 3 indicates "completed" by default
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchProjects(projectType);
    }, [page, projectType]);

    const fetchProjects = (type) => {
        const userId = sessionStorage.getItem("id");
        const userType = sessionStorage.getItem("userType");
        const token = sessionStorage.getItem("token");

        const params = new URLSearchParams({
            id: userId,
            role: userType,
            status: type,
            start: page,
            size: 5
        });

        fetch(`http://localhost:8080/application/list?${params.toString()}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Authorization': `${token}`
            }
        })
            .then(response => response.json())
            .then(response => {
                if (response.code === 200) {
                    const newProjects = response.data.records;
                    if (newProjects.length > 0) {
                        setProjects(prevProjects => {
                            const updatedProjects = { ...prevProjects };
                            if (type === 0) updatedProjects.applying.push(...newProjects);
                            else if (type === 2) updatedProjects.inProgress.push(...newProjects);
                            else if (type === 1) updatedProjects.completed.push(...newProjects);
                            return updatedProjects;
                        });
                    } else {
                        setHasMore(false);
                    }
                } else {
                    message.error(response.msg);
                }
            })
            .catch(error => {
                message.error(`Error fetching projects: ${error.message}`);
            });
    };

    const handleTabChange = (key) => {
        const type = key === '1' ? 0 : key === '2' ? 2 : 3;
        setProjectType(type);
        setPage(1);
        setProjects({ applying: [], inProgress: [], completed: [] });
        setHasMore(true);
    };

    return (
        <TabsWrapper defaultActiveKey="1" onChange={handleTabChange}>
            <StyledTabPane tab="Completed" key="3">
                {projects.completed.map((project, index) => (
                    <ProjectCard key={index} title={project.projectTitle} onClick={() => navigate(`/project/${project.projectId}`)}>
                        <p>{project.companyName}</p>
                        <Text>{project.updateTime}</Text>
                        <Space>
                            <Tag color="purple">Status: Completed</Tag>
                            <Text>⭐ Rating: {project.companyFeedback === -1 ? "Unrated" : project.companyFeedback / 5}</Text>
                        </Space>
                    </ProjectCard>
                ))}
            </StyledTabPane>
        </TabsWrapper>
    );
}

export default ProjectTabs;
