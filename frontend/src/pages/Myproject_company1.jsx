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
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, [page]);

    const fetchProjects = () => {
        const userId = sessionStorage.getItem("id");
        const token = sessionStorage.getItem("token");

        const body = {
            status: 2,
            start: page,
            size: 10,
            sort: "name",
            acs: true,
        };
        const queryParams = new URLSearchParams(body).toString();
        fetch(`http://localhost:8080/project/profile/${userId}?${queryParams}`, {
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
                            updatedProjects.completed.push(...newProjects);
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

    return (
        <TabsWrapper defaultActiveKey="3">
            <StyledTabPane tab="Achievement" key="3">
                {projects.completed.map((project, index) => (
                    <ProjectCard
                        key={index}
                        title={project.name}
                        onClick={() => navigate(`/project/${project.id}`)}
                    >
                        <p>{project.introduction}</p>
                        <Space>
                            <Tag color="purple">Status: Completed</Tag>
                            <Text>⭐ Rating: {project.score === -1 ? "Unrated" : project.score / 5}</Text>
                        </Space>
                    </ProjectCard>
                ))}
            </StyledTabPane>
        </TabsWrapper>
    );
}

export default ProjectTabs;
