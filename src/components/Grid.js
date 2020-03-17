// @flow

import React, {Component} from 'react'
import '../App.css';
import Utils from "../Utils";
import Slider from '@material-ui/lab/Slider';
import {RNG} from "../RNG";
import Interval from "./Interval";
import {GridNode} from "./Models";
import Colors from "../Colors";
import Waypoint from "react-waypoint";
import WidgetButton from "./WidgetButton";
import Plot from "./Plot"
import Constants from "./Constants";


type Props = {
  randomSeed?: number,

  // Network
  addCities?: boolean,
  addLinkedNodes?: boolean,
  gridCols?: number,
  gridRows?: number,

  // Simulation parameters
  daysIncubating?: number,
  daysSymptomatic?: number,
  deathRate?: number,
  decreaseInEncountersAfterSymptoms?: number,
  chanceOfIsolationAfterSymptoms?: number,
  hospitalCapacityPct?: number,
  immunityFraction?: number,
  maxActiveNodes?: number,
  maxIterations?: number,
  personHours?: number,
  transmissionProbability?: number,
  travelRadius?: number,

  // Rendering parameters
  drawNodeOutlines?: boolean,
  nodeSize?: number,
  speed?: number,

  // Controls
  highlight?: string,
  immunitySliderName?: string,
  maxTransmissionRate?: number,
  showAliveFraction?: boolean,
  showAllControls?: boolean,
  showDaysPerStateControls?: boolean,
  showDeaths?: boolean,
  showDeathRateSlider?: boolean,
  showDecreaseInEncountersAfterSymptomsSlider?: boolean,
  showChanceOfIsolationAfterSymptomsSlider?: boolean,
  showDegreeSlider?: boolean,
  showHospitalCapacitySlider?: boolean,
  showImmunityFractionSlider?: boolean,
  showInteractions?: boolean,
  showPersonHoursSlider?: boolean,
  showPlaybackControls?: boolean,
  showProTip?: boolean,
  showSimulationButtons?: boolean,
  showSpeedControls?: boolean,
  showTransmissionProbabilitySlider?: boolean,
  showTravelRadiusSlider?: boolean,
}

type State = {
  numActiveNodes: number,
  playing: boolean,
  visible: boolean,

  // Network

  // Simulation
  daysIncubating: number,
  daysSymptomatic: number,
  deathRate: number,
  decreaseInEncountersAfterSymptoms: number,
  chanceOfIsolationAfterSymptoms: number,
  hospitalCapacityPct: number,
  immunityFraction: number,
  longDistaceNetworkActive: boolean,
  maxIterations: number,
  personHours: number,
  transmissionProbability: number,
  travelRadius: number,

  // Rendering
  centerNodeNeighborsToDisplay: GridNode[];
  drawNodeOutlines: boolean,
  gridWidth: number,
  hospitalCapacitySliderHighlighted: boolean,
  nodeSize: number,
  speed: number,  // between 0 and 1

  // Outcomes
  capacityPerDay: number[],
  deadPerDay: number[],
  infectedPerDay: number[],
  recoveredPerDay: number[],
}

export default class Grid extends Component<Props, State> {
  // noinspection DuplicatedCode
  static NEIGHBOR_CLASSES = [
      [[0, 0]],
      [[-1, 0], [1, 0], [0, -1], [0, 1]],
      [[-1, -1], [-1, 1], [1, -1], [1, 1]],
      [[-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2], [-1, 2], [0, 2], [1, 2], [2, 2], [2, 1], [2, 0], [2, -1], [2, -2], [1, -2], [0, -2], [-1, -2]],
  ];

  // Set default props
  static defaultProps = {
    randomSeed: -1,

    // Network
    addCities: false,
    addLinkedNodes: false,
    gridCols: 1,
    gridRows: 1,

    // Simulation parameters
    daysIncubating: 7,
    daysSymptomatic: 8,
    deathRate: 0.03,
    decreaseInEncountersAfterSymptoms: 0.5,
    chanceOfIsolationAfterSymptoms: 0,
    hospitalCapacityPct: -1,
    immunityFraction: 0,
    maxIterations: -1,
    nug: 20,
    personHours: 10,
    transmissionProbability: 0.4,
    travelRadius: 5,

    // Rendering parameters
    drawNodeOutlines: true,
    speed: 0.5,

    // Controls
    immunitySliderName: "Immunity",
    maxTransmissionRate: 1,
    showAliveFraction: false,
    showAllControls: false,
    showDaysPerStateControls: false,
    showDeaths: false,
    showDecreaseInEncountersAfterSymptomsSlider: false,
    showChanceOfIsolationAfterSymptomsSlider: false,
    showDeathRateSlider: false,
    showDegreeSlider: false,
    showHospitalCapacitySlider: false,
    showImmunityFractionSlider: false,
    showInteractions: true,
    showPersonHoursSlider: false,
    showPlaybackControls: true,
    showProTip: false,
    showSimulationButtons: false,
    showSpeedControls: false,
    showTransmissionProbabilitySlider: false,
    showTravelRadiusSlider: false,
  };

  grid: GridNode[][];
  rng: RNG;

  // Weird rendering parameters; don't want React trying to auto-manage these
  gridWidth: number;
  nodeSize: number;

  canvasRef: any;

  constructor(props: Props) {
    super(props);

    this.canvasRef = React.createRef();

    this.previousSimulationParams = ['foo'];

    this.previousDrawingParams = [];
    this.previousInteractionsParams = [];

    this.onTick = this.onTick.bind(this);
    this.onEnter = this.onEnter.bind(this);
    this.onLeave = this.onLeave.bind(this);

    this.initializeFromProps(this.props, true);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  updateWindowDimensions() {
    let idealWidth = this.props.gridCols * this.props.nodeSize;
    if (this.props.nodeSize >= 5) {
      idealWidth += this.props.gridCols;
    }

    let gridWidth = Math.min(idealWidth, document.documentElement.clientWidth - 40);
    let nodeSize = Math.floor(gridWidth / this.props.gridCols);

    gridWidth = nodeSize * this.props.gridCols;

    if (this.gridWidth !== gridWidth || this.nodeSize !== nodeSize) {
      this.gridWidth = gridWidth;
      this.nodeSize = nodeSize;
      this.redraw(true);
    }
  }

  componentWillReceiveProps(nextProps: Props, nextContext: any): void {
    // this.initializeFromProps(nextProps, false);
  }

  initializeFromProps(props: Props, fromConstructor: boolean) {
    this.gridWidth = props.gridCols * props.nodeSize;
    this.nodeSize = props.nodeSize;

    let randomSeed = props.randomSeed;
    if (randomSeed === -1) {
      randomSeed = Math.floor(Math.random() * 3000000);
    }
    this.rng = new RNG(randomSeed);

    let state = {
      numActiveNodes: 0,
      playing: false,
      visible: false,

      // Network

      // Simulation
      daysIncubating: props.daysIncubating,
      daysSymptomatic: props.daysSymptomatic,
      deathRate: props.deathRate,
      decreaseInEncountersAfterSymptoms: props.decreaseInEncountersAfterSymptoms,
      chanceOfIsolationAfterSymptoms: props.chanceOfIsolationAfterSymptoms,
      hospitalCapacityPct: props.hospitalCapacityPct,
      immunityFraction: props.immunityFraction,
      longDistaceNetworkActive: props.addLinkedNodes,
      maxIterations: props.maxIterations,
      personHours: props.personHours,
      transmissionProbability: props.transmissionProbability,
      travelRadius: props.travelRadius,

      // Rendering
      centerNodeNeighborsToDisplay: [],
      drawNodeOutlines: props.drawNodeOutlines,
      hospitalCapacitySliderHighlighted: false,
      speed: props.speed,

      // Outcomes
      capacityPerDay: [],
      deadPerDay: [],
      infectedPerDay: [],
      recoveredPerDay: [],
    };
    if (fromConstructor) {
      this.state = state;
    } else {
      this.setState(state);
    }
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current;

    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

    // this.regenerate();
    this.redraw(true);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  onTick() {
    if (this.state.playing && this.state.visible) {
      this.simulateStep();
      // this.simulateStep();
      // this.simulateStep();
      // this.simulateStep();
      this.redraw(true);
    }
  }

  onEnter() {
    this.setState({
      visible: true,
    });
    this.redraw(true);
  }

  onLeave() {
    this.setState({
      visible: false,
    });
  }

  static shuffleInPlace(arr, rng: RNG) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  regenerate() {
    this.generate();
    this.forceUpdate();
  }

  resetPlotVariables() {
    this.state.capacityPerDay = [];
    this.state.deadPerDay = [];
    this.state.infectedPerDay = [];
    this.state.recoveredPerDay = [];
  }

  generate(force: boolean) {
    // actually regenerate iff any of the simulation parameters have changed
    let currentSimulationParams = [
        // this.state.immunityFraction,
    ];
    if (!force && Utils.arraysEqual(this.previousSimulationParams, currentSimulationParams)) {
      // console.log('rejecting generate');
      return;
    }

    this.previousSimulationParams = currentSimulationParams;

    // console.log('Generating new network');


    if (this.state.infectedPerDay.length > 1 && this.state.infectedPerDay[this.state.infectedPerDay.length-2] !== null) {
      this.state.capacityPerDay.push(null);
      this.state.deadPerDay.push(null);
      this.state.infectedPerDay.push(null);
      this.state.recoveredPerDay.push(null);
    }
    if (this.state.infectedPerDay.length === 0 || this.state.infectedPerDay[this.state.infectedPerDay.length-1] === null) {
      this.state.capacityPerDay.push(this.state.hospitalCapacityPct * this.props.gridRows * this.props.gridRows);
      this.state.deadPerDay.push(0);
      this.state.infectedPerDay.push(this.props.nug);
      this.state.recoveredPerDay.push(0);
    }

    this.state.centerNodeNeighborsToDisplay = [];

    let nRows = this.props.gridRows;
    let nCols = this.props.gridCols;

    // Initialize grid
    this.grid = [];
    for (let r = 0; r < nRows; r++) {
      let row = [];
      for (let c = 0; c < nCols; c++) {
        let node = new GridNode(this.rng, r, c);
        node.immune = this.rng.random() < this.state.immunityFraction;

        row.push(node);
      }
      this.grid.push(row);
    }

    // Add linked nodes
    // noinspection JSMismatchedCollectionQueryUpdate
    let linkedNodes: Set<GridNode> = new Set();
    if (this.props.addLinkedNodes) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          let r = Math.floor((nRows / 6) * (2 * i + 1));
          let c = Math.floor((nCols / 6) * (2 * j + 1));
          let node = this.grid[r][c];
          node.linked = true;
          node.setSusceptible();  // make sure it's not removed
          linkedNodes.add(node);
        }
      }
    }

    // Add cities
    if (this.props.addCities) {
      let cityCenters = [];
      cityCenters.push([Math.floor(3/4 * nRows), Math.floor(1/4 * nCols)]);
      cityCenters.push([Math.floor(1/4 * nRows), Math.floor(3/4 * nCols)]);
      for (let r = 0; r < nRows; r++) {
        for (let c = 0; c < nCols; c++) {
          for (let center of cityCenters) {
            let cr = center[0];
            let cc = center[1];
            let distance = Math.sqrt(Math.pow(cr - r, 2) + Math.pow(cc - c, 2));
            if (distance <= 16) {
              this.grid[r][c].specialDegree = 8 - Math.floor(distance/4);
            }
          }
        }
      }
    }

    // Initialize nug
    let centerR = Math.floor((nRows - 1) / 2);
    let centerC = Math.floor((nCols - 1) / 2);
    if (this.props.nug === 1) {
      if (this.state.daysIncubating === 0) {
        this.grid[centerR][centerC].setInfected();
      } else {
        this.grid[centerR][centerC].setExposed();
      }
    } else if (this.props.nug === 5) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (Math.abs(dr) === 1 && Math.abs(dc) === 1) {
            continue;
          }

          this.grid[centerR+dr][centerC+dc].setExposed();
        }
      }
    } else if (this.props.nug === 20) {
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          if (Math.abs(dr) === 2 && Math.abs(dc) === 2) {
            continue;
          }

          this.grid[centerR+dr][centerC+dc].setExposed();
        }
      }
    }

    this.redraw(true);
    this.setState({
      numActiveNodes: this.props.nug,
    })
  }

  simulateStep() {
    let nRows = this.props.gridRows;
    let nCols = this.props.gridCols;

    // let actualRemovedCells = 0;
    let linkedNodes: Set<GridNode> = new Set();

    // Start day
    for (let r = 0; r < nRows; r++) {
      for (let c = 0; c < nCols; c++) {
        let node = this.grid[r][c];
        node.startDay();
        if (this.state.longDistaceNetworkActive && node.linked) {
          linkedNodes.add(node);
        }
      }
    }

    // Infect
    let centerNodeNeighborsToDisplay = [];
    for (let r = 0; r < nRows; r++) {
      for (let c = 0; c < nCols; c++) {
        let node = this.grid[r][c];
        if (this.props.showInteractions && this.isCenterNode(r, c) && node.canInfectOthers()) {
          centerNodeNeighborsToDisplay = this.maybeInfect(node, r, c, linkedNodes);
        } else {
          this.maybeInfect(node, r, c, linkedNodes);
        }
      }
    }

    // End day
    let actualInfectedNodes = 0;
    for (let r = 0; r < nRows; r++) {
      for (let c = 0; c < nCols; c++) {
        let node = this.grid[r][c];
        if (node.getNextState() === Constants.EXPOSED || node.getNextState() === Constants.INFECTED) {
          actualInfectedNodes++;
        }
      }
    }
    let overCapacity = this.state.hospitalCapacityPct > -1 && actualInfectedNodes > this.state.hospitalCapacityPct * (nRows*nCols);
    for (let r = 0; r < nRows; r++) {
      for (let c = 0; c < nCols; c++) {
        let node = this.grid[r][c];
        node.endDay(overCapacity, this.state.daysIncubating, this.state.daysSymptomatic, this.props.showDeaths, this.state.deathRate);
      }
    }
    let actualDeadNodes = 0;
    let actualRecoveredNodes = 0;
    for (let r = 0; r < nRows; r++) {
      for (let c = 0; c < nCols; c++) {
        let node = this.grid[r][c];
        if (node.getNextState() === Constants.REMOVED) {
          actualRecoveredNodes++;
        } else if (node.getNextState() === Constants.DEAD) {
          actualDeadNodes++;
        }
      }
    }
    this.state.capacityPerDay.push(this.state.hospitalCapacityPct * this.props.gridRows * this.props.gridRows);
    this.state.deadPerDay.push(actualDeadNodes);
    this.state.infectedPerDay.push(actualInfectedNodes);
    this.state.recoveredPerDay.push(actualRecoveredNodes);

    this.state.centerNodeNeighborsToDisplay = centerNodeNeighborsToDisplay;

    // Update the number of active nodes, and the playing bit if necessary
    this.setState({
      numActiveNodes: actualInfectedNodes,
      playing: this.state.playing && actualInfectedNodes !== 0,
    });

    this.redraw(true);
  }

  isCenterNode(r: number, c: number): boolean {
    return r === c && r === Math.floor(this.props.gridRows / 2);
  }

  maybeInfect(node: GridNode, r: number, c: number, linkedNodes: Set<GridNode>): GridNode[] {
    let neighbors = [];
    if (node.canInfectOthers() || this.isCenterNode(r, c)) {
      neighbors = this.getNeighbors(node, r, c, linkedNodes);
    }

    if (node.canInfectOthers()) {
      let transProb = this.state.transmissionProbability;
      transProb = Math.pow(transProb, 3);

      for (let neighbor of neighbors) {
        node.tryToInfect(neighbor, transProb);
      }
    }
    return neighbors;
  }

  chooseRandomNeighbor(node: GridNode, r: number, c: number): GridNode {
    let radius = this.state.travelRadius;

    let neighbor = null;
    while (neighbor === null) {
      let dr = this.rng.randIntBetween(-radius, radius);
      let dc = this.rng.randIntBetween(-radius, radius);

      if (dr === 0 && dc === 0) {
        continue;
      }

      // special case for radius 1: only immediate neighbors
      if (radius === 1) {
        if (Math.abs(dr) === 1 && Math.abs(dc) === 1) {
          continue;
        }
      }

      let nr = r + dr;
      let nc = c + dc;

      if (nr < 0 || nr >= this.grid.length || nc < 0 || nc >= this.grid[0].length) {
        continue;
      }

      neighbor = this.grid[nr][nc];
    }
    return neighbor;
  }

  // noinspection JSUnusedLocalSymbols
  getNeighbors(node: GridNode, r: number, c: number, linkedNodes: Set<GridNode>): GridNode[] {
    let neighbors = [];
    let personHoursWithIsolation = this.state.personHours;
    if (node.isInfected) {
      if (this.rng.random() < this.state.chanceOfIsolationAfterSymptoms) {
        personHoursWithIsolation *= (1-this.state.decreaseInEncountersAfterSymptoms);        
      }
    }
    if (this.state.travelRadius === 0) {
      // do nothing, just return empty list
    } else if (this.state.travelRadius === 1 && personHoursWithIsolation === 4) {
      // Just the four cardinal neighbors
      if (r > 0) {
        neighbors.push(this.grid[r-1][c]);
      }
      if (c > 0) {
        neighbors.push(this.grid[r][c-1]);
      }
      if (r < this.grid.length - 1) {
        neighbors.push(this.grid[r+1][c]);
      }
      if (c < this.grid[0].length - 1) {
        neighbors.push(this.grid[r][c+1]);
      }
    } else {
      // Regular probabilistic neighbors
      while (neighbors.length < personHoursWithIsolation) {
        let n = this.chooseRandomNeighbor(node, r, c)
        neighbors.push(n)
      }
    }
    return neighbors
  }

  togglePlayback() {
    if (this.state.numActiveNodes === 0) {
      // If network is dead, play button acts as reset + play button.
      this.generate(true);
    }
    this.setState({
      playing: !this.state.playing,
    });
  }

  inInitialPosition(): boolean {
    return this.state.infectedPerDay.length === 0;
  }

  redraw(force: boolean) {
    if (this.canvas === null || this.canvas === undefined) {
      console.log('no canvas');
      return;
    }

    // actually redraw iff any of the drawing parameters have changed
    let currentDrawingParams = [
        this.network,
        this.state.drawNodeOutlines,
        this.state.longDistaceNetworkActive,
        this.state.personHours,
        this.state.travelRadius,
    ];
    if (!force && Utils.arraysEqual(this.previousDrawingParams, currentDrawingParams)) {
      // console.log('no draw');
      return;
    }
    this.previousDrawingParams = currentDrawingParams;


    // actually redraw iff any of the drawing parameters have changed
    let showInteractionsParams = [
        this.state.personHours,
        this.state.travelRadius,
    ];
    let interactionsParamsChanged = !Utils.arraysEqual(this.previousInteractionsParams, showInteractionsParams);
    this.previousInteractionsParams = showInteractionsParams;


    // console.log('redrawing...');

    let context = this.canvas.getContext('2d');
    context.fillStyle = '#FFF';
    context.fillRect(0, 0, this.gridWidth, this.gridWidth);

    for (let r = 0; r < this.grid.length; r++) {
      for (let c = 0; c < this.grid[r].length; c++) {
        let node = this.grid[r][c];
        this.drawCell(r, c, node, context, false);
      }
    }

    // if (this.props.showInteractions &&
    //     this.state.centerNodeNeighborsToDisplay &&
    //     this.state.centerNodeNeighborsToDisplay.length > 0) {
    if (this.props.showInteractions && (interactionsParamsChanged || this.inInitialPosition())) {
      let centerR = Math.floor(this.props.gridRows / 2);
      let centerC = centerR;

      let centerNode = this.grid[centerR][centerC];

      // let neighbors = this.state.centerNodeNeighborsToDisplay;
      let neighbors = this.getNeighbors(centerNode, centerR, centerC, null);

      // this.drawCell(centerR, centerC, centerNode, context, true);
      for (let node of neighbors) {
        this.drawCell(node.r, node.c, node, context, true);
      }
      for (let node of neighbors) {
        this.drawInteraction(centerR, centerC, node.r, node.c, context)
      }
    }
  }

  drawInteraction(r1: number, c1: number, r2: number, c2: number, context) {
    let w = this.nodeSize;

    context.strokeStyle = '#000';
    context.beginPath();
    context.moveTo((c1 + 0.5) * w, (r1 + 0.5) * w);
    context.lineTo((c2 + 0.5) * w, (r2 + 0.5) * w);
    context.stroke();
  }

  drawCell(r: number, c: number, node: GridNode, context, highlight: boolean) {
    let w = this.nodeSize;
    let y = r * w;
    let x = c * w;

    if (node.isExposed()) {
      context.fillStyle = Constants.EXPOSED_COLOR;
    } else if (node.isInfected()) {
      context.fillStyle = Constants.INFECTED_COLOR;
    } else if (node.isRemoved()) {
      context.fillStyle = Constants.REMOVED_COLOR;
    } else if (node.isDead()) {
      context.fillStyle = Constants.DEAD_COLOR;
    } else {
      // Node is susceptible
      context.fillStyle = Constants.SUSCEPTIBLE_COLOR;

      if (node.specialDegree !== null) {
        // should be somewhere between 4 and 8
        Utils.assert(node.specialDegree >= 4 && node.specialDegree <= 8, "node.specialDegree should be between 4 and 8; was: " + node.specialDegree);
        let intensity = (node.specialDegree - 4) / 4.0;
        context.fillStyle = Colors.hex(Colors.blend(Colors.makeHex(Grid.SUSCEPTIBLE_COLOR), Colors.makeHex('#BBB'), intensity))
      }
    }

    let gap = 1;
    if (this.nodeSize < 5 || this.nodeSize < this.props.nodeSize) {
      gap = 0;
    }

    // context.fillRect(x, y, w, w);
    context.fillRect(x, y, w - gap, w - gap);
    // context.beginPath();
    // context.arc(x+w/2, y+w/2, w/2-1, 0, 2 * Math.PI);
    // context.fill();

    if (highlight || (node.linked && this.state.longDistaceNetworkActive)) {
      // context.beginPath();
      context.lineWidth = 1;
      context.strokeStyle = '#000';
      let left = x - 0.5;
      let wid = w - gap + 1;
      if (x === 0) {
        left = 0.5;
        wid = wid - 1;
      }
      let top = y - 0.5;
      let hei = w - gap + 1;
      if (y === 0) {
        top = 0.5;
        hei = hei - 1;
      }
      context.strokeRect(left, top, wid, hei);
      // context.stroke();
    }
  }

  static renderPercentage(fraction: number) {
    let percent = Math.round(fraction * 100);
    return <span><strong>{percent}</strong>%</span>;
  }

  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  renderSlider(name: string, value: number, onChange: Function, min: number, max: number, step: number,
               renderPercentage: boolean, highlighted: boolean) {
    let valueStr;
    if (renderPercentage === 0) {
      valueStr = "";
    } else if (renderPercentage) {
      valueStr = <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Grid.renderPercentage(value)}</span>;
    } else {
      valueStr = <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>{Math.round(value*100)/100}</strong></span>;
    }

    let highlightedClass = "";
    if (highlighted) {
      highlightedClass = " highlighted"
    }

    return (
      <div className={"slider-container" + highlightedClass}>
        <div className="slider-name">{name}{valueStr}</div>
        <div className="slider-slider">
          <Slider classes={{
                    container: 'slider-slider-container',
                    thumbIconWrapper: "",
                  }}
                  // thumb={
                  //   <img
                  //     alt="slider thumb icon"
                  //     src="/static/images/misc/circle.png"
                  //   />
                  // }
                  min={min}
                  max={max}
                  step={step}
                  value={value}
                  onChange={onChange}/>
        </div>
        {/*<div className="slider-minus">*/}
        {/*  <WidgetButton size="small" onClick={() => onChange(null, Math.max(value - step, min))}><span className="plus-minus-button">–</span></WidgetButton>*/}
        {/*</div>*/}
        {/*<div className="slider-plus">*/}
        {/*  <WidgetButton size="small" onClick={() => onChange(null, Math.min(value + step, max))}><span className="plus-minus-button">+</span></WidgetButton>*/}
        {/*</div>*/}
      </div>
    );
  }

  render() {
    this.generate();
    this.redraw();

    let showAll = this.props.showAllControls;

    let transmissionProbabilitySlider = null;
    if (showAll || this.props.showTransmissionProbabilitySlider) {
      transmissionProbabilitySlider =
          this.renderSlider("Transmission rate", this.state.transmissionProbability,
              (e, value) => { this.setState({transmissionProbability: value}); },
              0, this.props.maxTransmissionRate, 0.01, false, this.props.highlight === "transmissionRate");
    }

    let immunityFractionSlider = null;
    // if (showAll || this.props.showImmunityFractionSlider) {
    //   let sliderName = this.props.immunitySliderName || "Immunity";
    //
    //   immunityFractionSlider =
    //       this.renderSlider(sliderName, this.state.immunityFraction,
    //           (e, value) => { this.setState({immunityFraction: value}); },
    //           0, 1, 0.01, true, this.props.highlight === "immunity");
    // }

    let hospitalCapacitySlider = null;
    if (showAll || this.props.showHospitalCapacitySlider) {
      // decoy slider
      // hospitalCapacitySlider =
      //     this.renderSlider("Hospital capacity", this.state.hospitalCapacityPct,
      //         (e, value) => { this.setState({hospitalCapacitySliderHighlighted: true}); },
      //         0, 1, 0.01, true, this.state.hospitalCapacitySliderHighlighted);
      hospitalCapacitySlider =
          this.renderSlider("Hospital capacity", this.state.hospitalCapacityPct,
              (e, value) => { this.setState({hospitalCapacityPct: value}); },
              0, 1, 0.01, true, false);

    }

    let travelRadiusSlider = null;
    if (showAll || this.props.showTravelRadiusSlider) {
      travelRadiusSlider =
          this.renderSlider("Travel radius", this.state.travelRadius,
              (e, value) => { this.setState({travelRadius: value}); },
              0, Math.min(30, Math.floor(this.props.gridRows/2)), 1, false, false);
    }

    let personHoursSlider = null;
    if (showAll || this.props.showPersonHoursSlider) {
      personHoursSlider =
          this.renderSlider("Encounters per day", this.state.personHours,
              (e, value) => { this.setState({personHours: value}); },
              1, 30, 1, false, false);
    }

    let daysIncubatingSlider = null;
    if (showAll || this.props.showDaysPerStateControls) {
      daysIncubatingSlider =
          this.renderSlider("Days in incubation", this.state.daysIncubating,
              (e, value) => { this.setState({daysIncubating: value}); },
              0, 20, 1, false, false);
    }

    let daysSymptomaticSlider = null;
    if (showAll || this.props.showDaysPerStateControls) {
      daysSymptomaticSlider =
          this.renderSlider("Days with symptoms", this.state.daysSymptomatic,
              (e, value) => { this.setState({daysSymptomatic: value}); },
              1, 20, 1, false, false);
    }

    let chanceOfIsolationAfterSymptomsSlider = null;
    if (showAll || this.props.showChanceOfIsolationAfterSymptomsSlider) {
      chanceOfIsolationAfterSymptomsSlider =
          this.renderSlider("Chance of isolation after showing symptoms", this.state.chanceOfIsolationAfterSymptoms,
              (e, value) => { this.setState({chanceOfIsolationAfterSymptoms: value}); },
              0, 1, 0.01, true, false);
    }

    let decreaseInEncountersAfterSymptomsSlider = null;
    if (showAll || this.props.showDecreaseInEncountersAfterSymptomsSlider) {
      decreaseInEncountersAfterSymptomsSlider =
          this.renderSlider("Degree of isolation after showing symptoms", this.state.decreaseInEncountersAfterSymptoms,
              (e, value) => { this.setState({decreaseInEncountersAfterSymptoms: value}); },
              0, 1, 0.01, true, false);
    }

    let deathRateSlider = null;
    if (showAll || this.props.showDeathRateSlider) {
      let sliderName = "Fatality rate";
      if (this.state.hospitalCapacityPct > -1) {
        sliderName = "Input fatality rate";
      }

      deathRateSlider =
          this.renderSlider(sliderName, this.state.deathRate,
              (e, value) => { this.setState({deathRate: value}); },
              0, 0.3, 0.01, true, false);
    }

    // let speedSlider = null;
    // let speedMinusButton = null;
    // let speedPlusButton = null;
    // if (showAll || this.props.showSpeedControls) {
    //   speedMinusButton = <WidgetButton onClick={() => { this.setState({speed: Math.max(0, this.state.speed - 0.20)}) }}>🚶</WidgetButton>;
    //   speedPlusButton = <WidgetButton onClick={() => { this.setState({speed: Math.min(1, this.state.speed + 0.20)}) }}>🏃</WidgetButton>;
    //   speedSlider =
    //       this.renderSlider("Speed", this.state.speed,
    //           (e, value) => { this.setState({speed: value}); },
    //           0, 1, 0.01, 0, false);
    // }

    let playbackControls = null;
    if (showAll || this.props.showPlaybackControls) {
      let newNetworkButton = <WidgetButton onClick={() => {this.setState({playing: false}); this.generate(true); this.forceUpdate();} } >Reset</WidgetButton>;
      let text = <span style={{fontSize: '10pt'}}>▷</span>;
      if (this.state.playing) {
        text = <span><b>||</b></span>;
      }
      let togglePlaybackButton = <WidgetButton highlighted={!this.state.playing} onClick={() => {this.togglePlayback(); } } >{text}</WidgetButton>;
      let stepButton = <WidgetButton onClick={() => {this.simulateStep(); this.setState({playing: false}); } } >Step</WidgetButton>;

      playbackControls =
        <div className='playback-controls-container'>
          {newNetworkButton}
          {togglePlaybackButton}
          {stepButton}

          {/*{speedMinusButton}*/}
          {/*{speedPlusButton}*/}
        </div>
    }

    let toggleLongDistanceNetwork = null;
    if (this.props.addLinkedNodes) {
      let text = 'Long distance: disabled';
      if (this.state.longDistaceNetworkActive) {
        text = 'Long distance: enabled';
      }
      toggleLongDistanceNetwork = <div><span onClick={() => {this.setState({longDistaceNetworkActive: !this.state.longDistaceNetworkActive}); } } >{text}</span></div>;
    }

    let percentAliveSlider = null;
    // if (this.props.showAliveFraction || showAll) {
    //   let fractionAlive = this.state.numActiveNodes / (this.props.gridRows * this.props.gridCols);
    //   // noinspection JSSuspiciousNameCombination
    //   percentAliveSlider = <div>
    //     <Slider style={{height: this.gridWidth, marginLeft: '0.5rem'}}
    //             classes={{
    //               // track: { color: 'pink', width: 50, height: 100 },
    //               // thumb: { display: 'none' },
    //             }}
    //             min={0}
    //             max={1}
    //             value={fractionAlive}
    //             thumb={<span/>}
    //             vertical
    //             />
    //   </div>
    // }

    let protip = null;
    if (this.props.showProTip) {
      protip = (
          <div style={{color: '#666', fontSize: '12pt', marginTop: '1em'}}>👆 Pro-tip: You can adjust sliders while the simulation is running.</div>
      );
    }

    let intervalMillis = 1000 * (1-Math.pow(this.state.speed, 1/5));
    intervalMillis = Math.max(intervalMillis, 16);

    let highlightedSlider = null;
    if (this.props.highlight === "transmissionRate") {
      highlightedSlider = transmissionProbabilitySlider;
      transmissionProbabilitySlider = null;
    } else if (this.props.highlight === "immunity") {
      highlightedSlider = immunityFractionSlider;
      immunityFractionSlider = null;
    }

    let plot = null;
    if (this.props.showAliveFraction) {
      let population = this.props.gridRows * this.props.gridRows;
      plot = <Plot hospitalCapacity={this.state.hospitalCapacityPct * population}
                   capacityPerDay={this.state.capacityPerDay}
                   deadPerDay={this.state.deadPerDay}
                   infectedPerDay={this.state.infectedPerDay}
                   population={population}
                   recoveredPerDay={this.state.recoveredPerDay}
                   showDeaths={this.props.showDeaths} />;
    }

    return (
        <div className="widget-container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <Waypoint onEnter={this.onEnter} onLeave={this.onLeave} scrollableAncestor={window}>
              <canvas ref={this.canvasRef} width={this.gridWidth} height={this.gridWidth} />
            </Waypoint>
            {percentAliveSlider}
          </div>
          {playbackControls}
          <div style={{height: "0.5em"}}/>
          {highlightedSlider}

          {hospitalCapacitySlider}
          {deathRateSlider}
          {chanceOfIsolationAfterSymptomsSlider}
          {decreaseInEncountersAfterSymptomsSlider}

          {personHoursSlider}
          {travelRadiusSlider}

          {transmissionProbabilitySlider}
          {immunityFractionSlider}

          {daysIncubatingSlider}
          {daysSymptomaticSlider}

          {toggleLongDistanceNetwork}

          {protip}

          {plot}


          {/*{speedSlider}*/}
          <Interval milliseconds={intervalMillis} callback={this.onTick} />
        </div>
    )
  }
}