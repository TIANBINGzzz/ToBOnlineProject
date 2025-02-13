import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import styled from 'styled-components';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const Background = styled.div`
  width:calc(100vw - 230px);
  height:calc(100vh - 20px);
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: #ffffff;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.19);
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  overflow: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: unset;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #f5f5f5;
    border-radius: 10px;
    border: 2px solid #f1f1f1;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
`

const ChartsContainer = styled.div`
  display: flex;
  height: calc(100% - 100px);
  flex-wrap: wrap;
  gap: 20px;
  margin: 20px;
  justify-Content: center;

  @media (max-width: 768px) {
    flex-wrap: nowrap;
    flex-direction: column;
    height: auto
  }
  @media (orientation: portrait) {
    flex-wrap: nowrap;
    flex-direction: column;
    height: auto
  }
`;

const StyledEChart = styled(ReactECharts)`
  flex: 1 1 calc(50% - 20px);
  height: 50%;
  min-width: 300px;

  @media (max-width: 768px) {
    flex: 1 1 100%;
    height: auto;
    min-width: 100%;
  }
`;

const DynamicChart = ({ title, xAxisData, seriesData, chartType }) => {
  const [chartOptions, setChartOptions] = useState({});
  
  useEffect(() => {
    const options = {
      backgroundColor: '#fff',
      title: {
        text: title,
        left: 'center',
        top: '0',
        textStyle: {
          color: '#000',
          fontSize: 16,
          fontFamily: 'Arial'
        },
        subtextStyle: {
          color: '#90979c',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: '5%',
        right: '5%',
        top: 60,
        bottom: 35,
        textStyle: {
          color: '#fff'
        }
      },
      xAxis: [{
        type: 'category',
        axisLine: {
          lineStyle: {
            color: '#90979c'
          }
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: true
        },
        axisLabel: {
          interval: 'auto',
          rotate: -20
        },
        data: xAxisData,
      }],
      yAxis: [{
        type: 'value',
        minInterval: 1,
        splitLine: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#90979c'
          }
        },
        axisTick: {
          how: false
        }
      }],
      series: seriesData.map((seriesItem) => ({
        name: seriesItem.name,
        data: seriesItem.data,
        type: chartType,
        ...(chartType === 'bar' && {
          stack: 'total',
          barMaxWidth: 15,
          barGap: '10%',
          itemStyle: {
            normal: {
              borderRadius: [10, 10, 0, 0],
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#55A9FF' },
                  { offset: 1, color: '#379AFF' }
                ]
              )
            },
            label: {
              show: true,
              position: 'insideTop',
              formatter: (p) => (p.value > 0 ? p.value : ''),
              textStyle: { color: '#fff' }
            }
          }
        }),
        ...(chartType === 'line' && {
          smooth: true,
          lineStyle: { width: 2, color: '#55A9FF' }
        })
      })),
    };
    setChartOptions(options);
  }, [title, xAxisData, seriesData, chartType]);
  
  return <StyledEChart option={chartOptions} />;
};

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const getChartData = async ({ url, body }) => {
  const queryParams = new URLSearchParams(body).toString();
  try {
    const response = await fetch(`http://localhost:8080/${url}?${queryParams}`, {
      method:'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `${sessionStorage.getItem("token")}`
      }
    });  
    const data = await response.json();
    if(data.code == 200){
      return data.data;
    } else {
      throw new Error(data.code); 
    }
  } catch (error) {
    return null;
  }
};

const Charts = () => {
  const [profData, setProfData] = useState(null);
  const [compData, setCompData] = useState(null);
  const [projData, setProjData] = useState(null);
  const [rateData, setRateData] = useState(null);
  const [value, setValue] = useState(0);

  async function updateChartsData(startDate, endDate) {
    const startDateFormatted = formatDate(startDate);
    const endDateFormatted = formatDate(endDate);
    const data1 = await getChartData({
      url: 'user/report',
      body: {
        userType: 'professional',
        begin: startDateFormatted,
        end: endDateFormatted
      }
    });
    if (data1) {
      setProfData({
        xAxisData: data1.dateList.split(','),
        seriesData: [
          { name: 'Total Professional User', data: data1.totalUserList.split(',').map(Number) },
          { name: 'New Professional User', data: data1.newUserList.split(',').map(Number) },
        ],
      })
    }
    const data2 = await getChartData({
      url: 'user/report',
      body: {
        userType: 'company',
        begin: startDateFormatted,
        end: endDateFormatted
      }
    });
    if (data2) {
      setCompData({
        xAxisData: data2.dateList.split(','),
        seriesData: [
          { name: 'Total Company User', data: data2.totalUserList.split(',').map(Number) },
          { name: 'New Company User', data: data2.newUserList.split(',').map(Number) },
        ],
      })
    }
    const data3 = await getChartData({
      url: 'project/report/count',
      body: {
        begin: startDateFormatted,
        end: endDateFormatted
      }
    });
    if (data3) {
      setProjData({
        xAxisData: data3.dateList.split(','),
        seriesData: [
          { name: 'Total Project', data: data3.totalProjectList.split(',').map(Number) },
          { name: 'New Project', data: data3.newProjectList.split(',').map(Number) },
          { name: 'Started Project', data: data3.startProjectList.split(',').map(Number) },
          { name: 'Completed Project', data: data3.completeProjectList.split(',').map(Number) },
        ],
      })
    }
    // update rating chart
    const data4 = await getChartData({
      url: 'project/report/rate',
      body: {
        begin: startDateFormatted,
        end: endDateFormatted
      }
    });
    if (data4) {
      setRateData({
        xAxisData: data4.nameList.split(','),
        seriesData: [
          { name: 'Total Project', data: data4.numberList.split(',').map(Number) },
        ],
      })
    }
  }    

  function changePeriod(range) {
    const endDate = new Date();
    const startDate = new Date(endDate);
    switch (range) {
      case 0:
        (startDate.setDate(endDate.getDate() - 7));
        break;
      case 1:
        (startDate.setMonth(endDate.getMonth() - 1));
        break;
      case 2:
        (startDate.setMonth(endDate.getMonth() - 3));
          break;
      case 3:
        (startDate.setMonth(endDate.getMonth() - 6));
        break;
    }
    updateChartsData(startDate, endDate);
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    changePeriod(newValue);
  };

  useEffect(() => {
    changePeriod(0);
  }, []);
  
  return (
    <Background>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="action tabs example"
        >
          <Tab label="7 days" />
          <Tab label="1 month" />
          <Tab label="3 months" />
          <Tab label="6 months" />
        </Tabs>
      </AppBar>
      <ChartsContainer>
        {profData && <DynamicChart
          title="Professional User Growth"
          xAxisData={profData.xAxisData}
          seriesData={profData.seriesData}
          chartType="line"
        />}
        {compData && <DynamicChart
          title="Company User Growth"
          xAxisData={compData.xAxisData}
          seriesData={compData.seriesData}
          chartType="line"
        />}
        {projData && <DynamicChart
          title="Project Data"
          xAxisData={projData.xAxisData}
          seriesData={projData.seriesData}
          chartType="line"
        />}
        {rateData && <DynamicChart
          title="Top Companies"
          xAxisData={rateData.xAxisData}
          seriesData={rateData.seriesData}
          chartType="bar"
        />}
      </ChartsContainer>
    </Background>
  );
};
  
export default Charts;