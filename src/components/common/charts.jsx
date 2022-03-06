import React, { Component } from "react";
import {
  VictoryBar,
  VictoryScatter,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryTooltip,
  VictoryGroup,
} from "victory";

const axisStyle = {
  axisLabel: {
    fontSize: 4,
    padding: 10,
  },
  ticks: { size: 1 },
  grid: { stroke: ({ tick }) => (tick === 0.5 ? "red" : "") },
  tickLabels: {
    fontSize: 3,
    padding: 3,
  },
};

const tickValues = [0, 0.5, 1];

class Chart extends Component {
  render() {
    if (this.props.data.length === 0) return null;

    let chartData = [];
    this.props.data.forEach((d) => {
      chartData.push({
        x: d[this.props.xAxis],
        y: d[this.props.yAxis],
        label: d.name,
      });
    });
    return (
      <VictoryChart
        height={200}
        width={300}
        // domainPadding={20}
        animate={{ duration: 1000, easing: "bounce" }}
      >
        <VictoryAxis
          label={this.props.xAxis}
          tickValues={tickValues}
          style={axisStyle}
        />
        <VictoryAxis
          label={this.props.yAxis}
          dependentAxis
          tickValues={tickValues}
          style={axisStyle}
        />
        <VictoryScatter
          labelComponent={
            <VictoryTooltip
              center={{ x: 115, y: 60 }}
              constrainToVisibleArea={true}
              style={{ fontSize: 3 }}
            />
          }
          minBubbleSize={50}
          data={chartData}
          size={1}
        />
      </VictoryChart>
    );
  }
}

export default Chart;
