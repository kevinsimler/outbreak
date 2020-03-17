import {Component} from "react";
import React from "react";
import Constants from "./Constants";
import WidgetButton from "./WidgetButton"
import NodeLegend from "./NodeLegend"


type Props = {
  hospitalCapacity: number,
  capacityPerDay: number[],
  deadPerDay: number[],
  infectedPerDay: number[],
  population: number,
  recoveredPerDay: number[],
  showDeaths: boolean,
}

type State = {
  showDead: boolean,
  showInfected: boolean,
  showRecovered: boolean,
}

const REMOVED_COLOR = '#A8A8A8';

export default class Plot extends Component<Props, State> {

  width: number;
  height: number;

  maxDay: number;
  maxValue: number;

  canvasRef: any;

  constructor(props: Props) {
    super(props);

    this.width = null;
    this.height = 150;

    this.canvasRef = React.createRef();

    this.state = {
      showDead: true,
      showInfected: true,
      showRecovered: true,
    }

    this.componentWillReceiveProps(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  updateWindowDimensions() {
    let idealWidth = 600;
    let maxWidth = Math.min(idealWidth, document.documentElement.clientWidth - 60);

    if (this.width !== maxWidth) {
      this.width = maxWidth;
      this.redraw();
    }
  }

  componentWillReceiveProps(nextProps: Props, nextContext: any): void {
    this.updateMaxValues(nextProps)
  }

  updateMaxValues(nextProps: Props): void {
    this.maxValue = 1;

    let serieses = [];
    if (this.state.showInfected) {
      serieses.push(nextProps.infectedPerDay);
    }
    if (this.state.showRecovered) {
      serieses.push(nextProps.recoveredPerDay);
    }
    if (this.state.showDead) {
      serieses.push(nextProps.deadPerDay);
    }
    if (nextProps.hospitalCapacity > -1) {
      serieses.push(nextProps.capacityPerDay);
    }

    for (let i = 0; i < nextProps.infectedPerDay.length; i++) {
      for (let series of serieses) {
        let v = series[i];
        if (v !== null && v > this.maxValue) {
          this.maxValue = v;
        }
      }
    }

    this.maxValue *= 1.1;

    this.maxValue = this.props.population;

    this.maxDay = Math.max(nextProps.infectedPerDay.length - 1, 1);
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current;

    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

    this.redraw();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  showHospitalCapacity(): boolean {
    return this.props.hospitalCapacity > -1;
  }

  redraw() {
    if (this.canvas === null || this.canvas === undefined) {
      return;
    }

    this.updateMaxValues(this.props);

    let context = this.canvas.getContext('2d');

    context.fillStyle = Constants.SUSCEPTIBLE_COLOR;
    context.fillRect(0, 0, this.width, this.height);

    context.setLineDash([]);
    context.lineWidth = 2;

    // if (this.state.showInfected || true) {
    //   context.strokeStyle = Constants.INFECTED_COLOR;
    //   for (let i = 1; i < this.props.infectedPerDay.length; i++) {
    //     let day1 = i - 1
    //     let day2 = i
    //     let value1 = this.props.infectedPerDay[day1]
    //     let value2 = this.props.infectedPerDay[day2]
    //
    //     if (value2 === null) {
    //       context.strokeStyle = '#000';
    //       context.lineWidth = 1;
    //       this.drawLine(context, day2, 0, day2, this.maxValue);
    //       context.strokeStyle = Constants.INFECTED_COLOR;
    //       context.lineWidth = 2;
    //     }
    //     if (value1 === null || value2 === null) {
    //       continue;
    //     }
    //
    //     if (this.state.showInfected) {
    //       if (this.showHospitalCapacity()) {
    //         if (value1 > this.props.hospitalCapacity && value2 > this.props.hospitalCapacity) {
    //           context.fillStyle = '#ffd6dd';
    //           context.beginPath();
    //           context.moveTo(this.xcoord(day1), this.ycoord(this.props.hospitalCapacity));
    //           context.lineTo(this.xcoord(day1), this.ycoord(value1));
    //           context.lineTo(this.xcoord(day2), this.ycoord(value2));
    //           context.lineTo(this.xcoord(day2), this.ycoord(this.props.hospitalCapacity));
    //           context.fill();
    //         }
    //       }
    //
    //       this.drawLine(context, day1, value1, day2, value2);
    //     }
    //   }
    // }
    //
    // if (this.state.showRecovered) {
    //   context.strokeStyle = REMOVED_COLOR;
    //   this.drawSeries(this.props.recoveredPerDay, context);
    // }
    //
    // if (this.state.showDead) {
    //   context.strokeStyle = Constants.DEAD_COLOR;
    //   this.drawSeries(this.props.deadPerDay, context);
    // }


    // for (let i = 0; i < this.props.infectedPerDay.length; i++) {
    //   let day = i;
    //   let infected = this.props.infectedPerDay[day];
    //
    //   if (infected === null) {
    //     context.fillStyle = '#000';
    //     // this.drawLine(context, day+0.5, 0, day+0.5, this.maxValue);
    //     this.drawBar(context, day, 0, day+1, this.maxValue);
    //   } else {
    //     let recovered = this.props.recoveredPerDay[day];
    //     let dead = this.props.deadPerDay[day];
    //     let susceptible = this.props.population - infected - recovered - dead;
    //
    //     context.lineWidth = 1;
    //
    //     context.fillStyle = Constants.INFECTED_COLOR;
    //     this.drawBar(context, day, 0, day+1, infected);
    //
    //     context.fillStyle = Constants.SUSCEPTIBLE_COLOR;
    //     this.drawBar(context, day, infected, day+1, infected+susceptible);
    //
    //     context.fillStyle = REMOVED_COLOR;
    //     this.drawBar(context, day, infected+susceptible, day+1, infected+susceptible+recovered);
    //
    //     context.fillStyle = Constants.DEAD_COLOR;
    //     this.drawBar(context, day, infected+susceptible+recovered, day+1, infected+susceptible+recovered+dead);
    //   }
    // }

    let zerosPath = [];
    let infectedPath = [];
    let recoveredPath = [];
    let deadPath = [];
    let topPath = [];
    let capacityPath = [];

    for (let i = 0; i < this.props.infectedPerDay.length; i++) {
      let day = i;
      let infected = this.props.infectedPerDay[day];
      let recovered = this.props.recoveredPerDay[day];
      let dead = this.props.deadPerDay[day];
      let susceptible = this.props.population - infected - recovered - dead;
      let capacity = this.props.capacityPerDay[day];
      if (infected === null) {
        // this.drawPath(zerosPath, infectedPath, context, Constants.INFECTED_COLOR);
        // this.drawPath(recoveredPath, deadPath, context, REMOVED_COLOR);
        // this.drawPath(deadPath, topPath, context, Constants.DEAD_COLOR);
        this.drawPath(zerosPath, infectedPath, context, Constants.INFECTED_COLOR);
        this.drawPath(infectedPath, recoveredPath, context, REMOVED_COLOR);
        this.drawPath(recoveredPath, deadPath, context, Constants.DEAD_COLOR);
        if (this.showHospitalCapacity()) {
          this.drawPath(capacityPath, capacityPath, context, '#000');
        }
        zerosPath.length = 0;
        infectedPath.length = 0;
        recoveredPath.length = 0;
        deadPath.length = 0;
        topPath.length = 0;
        capacityPath.length = 0;
      } else {
        zerosPath.push([this.xcoord(day), this.ycoord(0)]);
        infectedPath.push([this.xcoord(day), this.ycoord(infected)]);
        recoveredPath.push([this.xcoord(day), this.ycoord(infected+recovered)]);
        deadPath.push([this.xcoord(day), this.ycoord(infected+recovered+dead)]);
        topPath.push([this.xcoord(day), this.ycoord(this.maxValue)]);
        capacityPath.push([this.xcoord(day), this.ycoord(capacity)]);
      }
    }
    this.drawPath(zerosPath, infectedPath, context, Constants.INFECTED_COLOR);
    this.drawPath(infectedPath, recoveredPath, context, REMOVED_COLOR);
    this.drawPath(recoveredPath, deadPath, context, Constants.DEAD_COLOR);

    if (this.showHospitalCapacity()) {
      this.drawPath(capacityPath, capacityPath, context, '#000');
    }

    for (let i = 0; i < this.props.infectedPerDay.length; i++) {
      let day = i;
      let infected = this.props.infectedPerDay[day];

      if (infected === null) {
        context.strokeStyle = '#000';
        context.lineWidth = 2;
        context.setLineDash([5, 5]);
        this.drawLine(context, day-1, 0, day-1, this.maxValue);
      }
    }

    // if (this.showHospitalCapacity()) {
    //   context.strokeStyle = '#000';
    //   context.setLineDash([5, 5]);
    //   context.lineWidth = 1;
    //   this.drawLine(context, 0, this.props.hospitalCapacity, this.maxDay, this.props.hospitalCapacity);
    // }

    context.strokeStyle = '#000';
    context.setLineDash([]);
    context.lineWidth = 1;
    this.drawLine(context, 0, 0, 0, this.maxValue);
    this.drawLine(context, 0, 0, this.maxDay, 0);
  }

  drawPath(fwdpath: number[][], backpath: number[][], context, color) {
    if (fwdpath.length === 0) {
      return;
    }

    context.beginPath();
    context.moveTo(fwdpath[0][0], fwdpath[0][1]);
    for (let i = 0; i < fwdpath.length; i++) {
      context.lineTo(fwdpath[i][0], fwdpath[i][1]);
    }
    if (fwdpath !== backpath) {
      for (let i = backpath.length - 1; i >= 0; i--) {
        context.lineTo(backpath[i][0], backpath[i][1]);
      }
    }

    if (fwdpath === backpath) {
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.setLineDash([5, 5]);
      context.stroke();
    } else {
      context.fillStyle = color;
      context.fill();
    }
  }

  drawSeries(series: number[], context) {
    for (let i = 1; i < series.length; i++) {
      let day1 = i - 1
      let day2 = i
      let value1 = series[day1]
      let value2 = series[day2]
      if (value1 === null || value2 === null) {
        continue;
      }
      this.drawLine(context, day1, value1, day2, value2);
    }
  }

  xcoord(day: number): number {
    return this.width * day / this.maxDay;
  }

  ycoord(value: number): number {
    return (this.height-1) * (1 - value / this.maxValue);
  }

  drawBar(context: any, day1: number, value1: number, day2: number, value2: number) {
    let x1 = this.xcoord(day1);
    let x2 = this.xcoord(day2);
    let y1 = this.ycoord(value1);
    let y2 = this.ycoord(value2);
    context.fillRect(x1, y1, x2-x1, y2-y1);
  }

  drawLine(context: any, day1: number, value1: number, day2: number, value2: number) {
    context.beginPath();
    context.moveTo(this.xcoord(day1), this.ycoord(value1));
    context.lineTo(this.xcoord(day2), this.ycoord(value2));
    context.stroke();
  }

  resetArrays() {
    this.props.capacityPerDay.length = 0;
    this.props.deadPerDay.length = 0;
    this.props.infectedPerDay.length = 0;
    this.props.recoveredPerDay.length = 0;

    this.redraw();
    this.forceUpdate();
  }

  render() {
    this.redraw();

    let infectedPercent = Math.round(this.props.infectedPerDay[this.props.infectedPerDay.length - 1] / this.props.population * 100);
    let recoveredPercent = Math.round(this.props.recoveredPerDay[this.props.recoveredPerDay.length - 1] / this.props.population * 100);
    let deadPercent = Math.round(this.props.deadPerDay[this.props.deadPerDay.length - 1] / this.props.population * 100);

    if (isNaN(infectedPercent)) {
      infectedPercent = 0;
    }
    if (isNaN(recoveredPercent)) {
      recoveredPercent = 0;
    }
    if (isNaN(deadPercent)) {
      deadPercent = 0;
    }

    // let infectedCB = <label><input type="checkbox" checked={this.state.showInfected} onChange={(e) => this.setState({showInfected: e.target.checked})}/> Infected: {infectedPercent}%</label>
    let infectedCB = <span><NodeLegend type="infected"/> &nbsp;Infected: {infectedPercent}%</span>

    // let recoveredCB = <label><input type="checkbox" checked={this.state.showRecovered} onChange={(e) => this.setState({showRecovered: e.target.checked})}/> Recovered: {recoveredPercent}%</label>
    let recoveredCB = <span><NodeLegend type="removed"/> &nbsp;Recovered: {recoveredPercent}%</span>

    let deadCB = null;
    if (this.props.showDeaths) {
      // deadCB = <label><input type="checkbox" checked={this.state.showDead} onChange={(e) => this.setState({showDead: e.target.checked})}/> Dead: {deadPercent}%</label>
      deadCB = <span><NodeLegend type="dead"/> <span style={{backgroundColor: '#FFA'}}>&nbsp;Dead: {deadPercent}%&nbsp;</span></span>
    }

    let widthToUse = this.width;
    if (widthToUse === null) {
      widthToUse = 300;
    }

    return (
      <div>
        <div className="plot-container">
          {/*<div className="plot-yaxis">population</div>*/}
          <div className="plot-xaxis">time ⟶</div>
          <div className="plot-chart">
            <canvas ref={this.canvasRef} width={widthToUse} height={this.height} />
          </div>
          <div className="plot-legend">
            <div className="plot-legend-button">
              <WidgetButton onClick={() => {this.resetArrays()}}>Clear</WidgetButton>
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <div>{infectedCB}</div>
              <div>{recoveredCB}</div>
              <div>{deadCB}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}