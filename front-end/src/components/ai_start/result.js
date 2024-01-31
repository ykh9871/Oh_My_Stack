import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, Label } from 'recharts';
import allRecruits from '../../json_data/recruit.json';
import Header from '../../components/base/header';
import Footer from '../base/footer';
import '../../components/style/result.css';
import { Link } from 'react-router-dom';

export default class Result extends PureComponent {
  state = {
    activeIndex: 0,
    recommendedRecruits: [],
    positionsCount: {},
  };

  componentDidMount() {
    const recommended_id = JSON.parse(localStorage.getItem('recommended_id'));
    let recommendedRecruits = [];
  
    if (recommended_id) {
      recommendedRecruits = this.filterRecruitsById(allRecruits, recommended_id);
      localStorage.setItem('recommendedRecruits', JSON.stringify(recommendedRecruits));
      console.log(recommendedRecruits);
    }
  
    const positionsCount = this.countPositions(recommendedRecruits.slice(0, 100)); // recommendedRecruits를 전달하여 positionsCount 생성
    this.setState({
      activeIndex: 0,
      recommendedRecruits: recommendedRecruits.slice(0, 100),
      positionsCount: positionsCount, // positionsCount를 상태에 설정
    });
  }

  filterRecruitsById = (data, ids) => {
    let index = 1;
    return ids.map(id => data.find(recruit => recruit.id === id))
      .map(item => ({ ...item, index: index++ }));
  };

  countPositions = (data) => {
    const positionsCount = {};

    data.forEach(item => {
      const { position } = item;
      if (!positionsCount[position]) {
        positionsCount[position] = 0;
      }
      positionsCount[position]++;
    });

    return positionsCount;
  };

  calculateJobRanking = (data) => {
    const jobRanking = {};

    data.forEach((item) => {
      const { position, index } = item;

      if (!jobRanking[position]) {
        jobRanking[position] = 0;
      }

      jobRanking[position] += index;
    });

    const sortedJobs = Object.keys(jobRanking).sort(
      (a, b) => jobRanking[b] - jobRanking[a]
    );
    const topJobs = sortedJobs.slice(0, 5);

    return topJobs;
  };

  createChartData = (data) => {
    const chartData = data.slice(0, 5).map((position) => {
      const indexSum = this.state.recommendedRecruits
        .filter((item) => item.position === position)
        .reduce((sum, item) => sum + item.index, 0);

      return { name: position, value: indexSum };
    });

    return chartData;
  };

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  onRankItemEnter = (index) => {
    this.setState({
      activeIndex: index,
    });
  };

  onRankItemLeave = () => {
    this.setState({
      activeIndex: null,
    });
  };

  renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;

    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontWeight="bold">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" style={{ fontSize: '20px', fontWeight: 'bold' }}>
          {`${(percent * 100).toFixed(2)}%`}
        </text>
        {this.state.positionsCount && (
          <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey + 20} textAnchor={textAnchor} fill="#333" style={{ fontSize: '16px', fontWeight: 'bold' }}>
            {`${this.state.positionsCount[payload.name] || 0}개 공고`}
          </text>
        )}
      </g>
    );
  };

  render() {
    const topJobs = this.calculateJobRanking(this.state.recommendedRecruits);
    const chartData = this.createChartData(topJobs);

    const COLORS = ['#bb44e4', '#FF6384', '#36A2EB', '#FFCE56', '#8E44AD'];

    return (
      <>
        <Header />
        <div className="default-container">
          <div className="chart-container">
            <div className="result-header">AI 추천 결과</div>
            <div className="chart-header">
              스택 기반 직무 추천 Top5
            </div>
            <div className="chart-footer">순위 계산 방식: 상위 100개 공고 순위 합의 내림차순</div>
            <div className="chart-wrapper">
              <PieChart width={850} height={500}>
                <Pie
                  activeIndex={this.state.activeIndex}
                  activeShape={this.renderActiveShape}
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={108 * 0.7}
                  outerRadius={144 * 0.7}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={this.onPieEnter}
                  onMouseLeave={this.onRankItemLeave}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                  <Label
                    position="center"
                    fill="#333"
                    fontSize={18}
                    fontWeight="bold" 
                  />
                </Pie>
              </PieChart>
            </div>
            <div className="rank-container">
              {topJobs.slice(0, 5).map((position, index) => (
                <div
                  key={index}
                  className="rank-item"
                  onMouseEnter={() => this.onRankItemEnter(index)}
                  style={{
                    color: index === this.state.activeIndex ? COLORS[index % COLORS.length] : '#333',
                  }}
                >
                  {`${index + 1}. ${position}`}
                </div>
              ))}
            </div>
            <Link
              to={{
                pathname: "/recommend",
                // search: `?positions=${topJobs.slice(0, 3).join(",")}`,
              }}
              className="recommand-button"
            >
              추천 공고 목록
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }
}
