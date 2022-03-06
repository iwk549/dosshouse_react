import React, { Component } from "react";
import Chart from "../../common/charts";

class ChartSelector extends Component {
  state = {
    xAxis: "valence",
    yAxis: "energy",
    checkBoxesX: [
      { label: "danceability", title: "Danceability", checked: false },
      { label: "instrumentalness", title: "Instrumentalness", checked: false },
      { label: "acousticness", title: "Acousticness", checked: false },
      { label: "speechiness", title: "Speechiness", checked: false },
      { label: "liveness", title: "Liveness", checked: false },
      { label: "valence", title: "Valence", checked: true },
      { label: "energy", title: "Energy", checked: false },
    ],
    checkBoxesY: [
      { label: "danceability", title: "Danceability", checked: false },
      { label: "instrumentalness", title: "Instrumentalness", checked: false },
      { label: "acousticness", title: "Acousticness", checked: false },
      { label: "speechiness", title: "Speechiness", checked: false },
      { label: "liveness", title: "Liveness", checked: false },
      { label: "valence", title: "Valence", checked: false },
      { label: "energy", title: "Energy", checked: true },
    ],
  };

  handleCheck = (event) => {
    const xOrY = event.target.id.length - 1;
    const axisLabel = event.target.id.substring(0, xOrY);

    let updatedBoxes = [
      ...this.state["checkBoxes" + event.target.id.substring(xOrY)],
    ];
    const axisToChange = event.target.id.substring(xOrY).toLowerCase() + "Axis";

    updatedBoxes.forEach((c) => {
      c.checked = false;
      if (event.target.id.includes(c.label)) c.checked = true;
    });

    this.setState({
      [axisToChange]: axisLabel,
      ["checkBoxes" + event.target.id.substring(xOrY)]: updatedBoxes,
    });
  };

  render() {
    return (
      <>
        <div>
          <hr />
          <div className="side-by-side right">
            <div className="side-by-side left">
              <b>X Axis</b>
              <br />
              {this.state.checkBoxesX.map((b, idx) => (
                <React.Fragment key={idx}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={b.label + "X"}
                    onChange={this.handleCheck}
                    checked={b.checked}
                  />
                  <label htmlFor={b.label + "X"} className="form-check-label">
                    {b.title}
                  </label>
                  <br />
                </React.Fragment>
              ))}
            </div>
            <div className="side-by-side right">
              <b>Y Axis</b>
              <br />
              {this.state.checkBoxesY.map((b, idx) => (
                <React.Fragment key={idx}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={b.label + "Y"}
                    onChange={this.handleCheck}
                    checked={b.checked}
                  />
                  <label htmlFor={b.label + "Y"} className="form-check-label">
                    {b.title}
                  </label>
                  <br />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <Chart
          data={this.props.data}
          xAxis={this.state.xAxis}
          yAxis={this.state.yAxis}
        />
      </>
    );
  }
}

export default ChartSelector;
