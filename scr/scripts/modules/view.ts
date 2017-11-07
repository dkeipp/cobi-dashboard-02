import Core from './core';
import Dashboard from '../dashboard';

//import * as Konva from 'konva';
declare let Konva: any;

/**
 *
 */
export default class View {

    private core: Core = null;

    private stageWidth: number;
    private stageHeight: number;
    private stageContainer: string;

    private arcBackgroundColor: string = '#444353';
    private arcBackgroundShadowColor: string = '#444353';
    private arcForeGroundColor: string = '#00C8E6';
    private arcForeGroundShadowColor: string = '#00C8E6';
    private arcPointerColor: string = '#FFF';
    private arcPointerShadowColor: string = '#FFF';

    private cadenceArcX: number = 0;
    private cadenceArcY: number = 0;

    private checkSpeedInterval: number = 1000;
    private checkSpeedIntervalObject = null;
    private lastSpeedUpdate: number = 0;

    private speedArcX: number;
    private speedArcY: number;
    private speedDisplayFullX: number;
    private speedDisplayFullY: number;
    private speedDisplayDecimalX: number;
    private speedDisplayDecimalY: number;

    private arcWidth: number;
    private arcInnerRadius: number;

    private arcOuterRadius: number;
    private averageCadenceInterval: number = 1000;
    private averageCadenceIntervalObject = null;

    private lastCadenceUpdate: number = 0;
    private checkCadenceInterval: number = 1000;

    private checkCadenceIntervalObject = null;

    private stage;
    private layer;
    private mask;
    private speedDisplayFull;
    private speedDisplayDecimal;
    private speedArcBackground;
    private curSpeedArc;
    private averageSpeedArc;
    private averageCadenceArc;
    private cadenceArcBackground;
    private cadenceDisplay;
    private curCadenceArc;
    private speedDisplayFullSize: number;
    private speedDisplayDecimalSize: number;

    private speedArcRotation: number = 270;
    private candenceArcRotation: number = 90;
    private cadenceDisplayX: number;
    private cadenceDisplayY: number;
    private speedDisplayMax;
    private speedDisplayMaxX: number;
    private speedDisplayMaxY: number;
    private displayMaxSize: number;
    private cadenceDisplayMax;
    private cadenceDisplayMaxX: number;
    private cadenceDisplayMaxY: number;
    private speedBottom;
    private bottomWidth: number;
    private cadenceBottom;

    /**
     *
     */
    constructor(core: Core, stageContainer: string, stageWidth: number, stageHeight: number) {
        this.core = core;

        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.stageContainer = stageContainer;

        this.arcWidth = this.stageHeight * 0.05;
        this.arcOuterRadius = this.stageHeight * 0.9 / 2;
        this.arcInnerRadius = this.arcOuterRadius - this.arcWidth;

        this.displayMaxSize = this.stageHeight * 0.1;

        this.bottomWidth = this.stageWidth * 0.19;

        this.speedArcX = this.stageWidth - this.arcOuterRadius - (this.stageWidth * 0.02);
        this.speedArcY = this.stageHeight / 2;

        this.speedDisplayFullX = this.stageWidth * 0.53;
        this.speedDisplayFullY = this.stageHeight * 0.35;
        this.speedDisplayFullSize = this.stageHeight * 0.3;
        this.speedDisplayDecimalX = this.stageWidth * 0.85;
        this.speedDisplayDecimalY = this.speedDisplayFullY;
        this.speedDisplayDecimalSize = this.stageHeight * 0.15;
        this.speedDisplayMaxX = this.speedArcX - (this.stageWidth * 0.12);
        this.speedDisplayMaxY = this.stageWidth * 0.02;

        this.cadenceDisplayX = this.stageWidth * 0.02;
        this.cadenceDisplayY = this.stageHeight * 0.35;

        this.cadenceDisplayMaxX = this.cadenceArcX + (this.stageWidth * 0.3);
        this.cadenceDisplayMaxY = this.stageWidth * 0.02;

        this.cadenceArcX = this.arcOuterRadius + (this.stageWidth * 0.02);
        this.cadenceArcY = this.stageHeight / 2;
    }

    /**
     *
     */
    initView() {
        this.stage =
            new Konva.Stage(
                {
                    container: this.stageContainer,
                    width: this.stageWidth,
                    height: this.stageHeight
                }
            );

        this.layer = new Konva.Layer();

        this.mask =
            new Konva.Group(
                {

                    clip: {
                        x: 0,
                        y: 0,
                        width: this.stageWidth,
                        height: this.stageHeight
                    }

                }
            );

        this.speedArcBackground =
            new Konva.Arc(
                {
                    x: this.speedArcX,
                    y: this.speedArcY,
                    innerRadius: this.arcInnerRadius,
                    outerRadius: this.arcOuterRadius,
                    angle: 180,
                    fill: this.arcForeGroundColor,
                    rotation: this.speedArcRotation
                }
            );

        this.speedBottom =
            new Konva.Rect(
                {
                    x: this.speedArcX - this.bottomWidth,
                    y: this.arcOuterRadius * 2,
                    width: this.bottomWidth,
                    height: this.arcWidth,
                    fill: this.arcBackgroundColor,
                }
            );

        this.curSpeedArc =
            new Konva.Arc(
                {
                    x: this.speedArcX,
                    y: this.speedArcY,
                    innerRadius: this.arcInnerRadius,
                    outerRadius: this.arcOuterRadius,
                    angle: 180,
                    fill: this.arcBackgroundColor,
                    rotation: this.speedArcRotation,
                    shadowEnabled: true,
                    shadowBlur: 10,
                    shadowColor: this.arcForeGroundShadowColor
                }
            );

        this.averageSpeedArc =
            new Konva.Arc(
                {
                    x: this.speedArcX,
                    y: this.speedArcY,
                    innerRadius: this.arcInnerRadius,
                    outerRadius: this.arcOuterRadius,
                    angle: 2,
                    opacity: 0.9,
                    fill: this.arcPointerColor,
                    rotation: this.speedArcRotation,
                    shadowEnabled: true,
                    shadowBlur: 10,
                    shadowColor: this.arcPointerShadowColor
                }
            );

        this.averageCadenceArc =
            new Konva.Arc(
                {
                    x: this.cadenceArcX,
                    y: this.cadenceArcY,
                    innerRadius: this.arcInnerRadius,
                    outerRadius: this.arcOuterRadius,
                    angle: 2,
                    opacity: 0.9,
                    fill: this.arcPointerColor,
                    rotation: this.candenceArcRotation,
                    shadowEnabled: true,
                    shadowBlur: 10,
                    shadowColor: this.arcPointerShadowColor
                }
            );

        this.cadenceArcBackground =
            new Konva.Arc(
                {
                    x: this.cadenceArcX,
                    y: this.cadenceArcY,
                    innerRadius: this.arcInnerRadius,
                    outerRadius: this.arcOuterRadius,
                    angle: 180,
                    fill: this.arcBackgroundColor,
                    rotation: this.candenceArcRotation
                }
            );

        this.cadenceBottom =
            new Konva.Rect(
                {
                    x: this.cadenceArcX,
                    y: this.arcOuterRadius * 2,
                    width: this.bottomWidth,
                    height: this.arcWidth,
                    fill: this.arcBackgroundColor,
                }
            );

        this.curCadenceArc =
            new Konva.Arc(
                {
                    x: this.cadenceArcX,
                    y: this.cadenceArcY,
                    innerRadius: this.arcInnerRadius,
                    outerRadius: this.arcOuterRadius,
                    angle: 180,
                    fill: this.arcForeGroundColor,
                    rotation: this.candenceArcRotation,
                    shadowEnabled: true,
                    shadowBlur: 10,
                    shadowColor: this.arcForeGroundShadowColor
                }
            );

        this.cadenceDisplay =
            new Konva.Text(
                {
                    x: this.cadenceDisplayX,
                    y: this.cadenceDisplayY,
                    text: '0',
                    fontSize: this.speedDisplayFullSize,
                    fontFamily: 'UniSans',
                    fill: '#fff',
                    align: 'right',
                    width: this.stageWidth * 0.3,
                    shadowEnabled: true,
                    shadowBlur: 5,
                    shadowColor: '#fff',
                }
            );

        this.speedDisplayFull =
            new Konva.Text(
                {
                    x: this.speedDisplayFullX,
                    y: this.speedDisplayFullY,
                    text: '0',
                    fontSize: this.speedDisplayFullSize,
                    fontFamily: 'UniSans',
                    fill: '#fff',
                    align: 'right',
                    width: this.stageWidth * 0.3,
                    shadowEnabled: true,
                    shadowBlur: 5,
                    shadowColor: '#fff',
                }
            );

        this.speedDisplayDecimal =
            new Konva.Text(
                {
                    x: this.speedDisplayDecimalX,
                    y: this.speedDisplayDecimalY,
                    text: '0',
                    fontSize: this.speedDisplayDecimalSize,
                    fontFamily: 'UniSans',
                    fill: '#fff',
                    shadowEnabled: true,
                    shadowBlur: 5,
                    shadowColor: '#fff',
                }
            );

        this.speedDisplayMax =
            new Konva.Text(
                {
                    x: this.speedDisplayMaxX,
                    y: this.speedDisplayMaxY,
                    text: '0',
                    fontSize: this.displayMaxSize,
                    fontFamily: 'UniSans',
                    fill: '#fff',
                    align: 'right',
                    shadowEnabled: true,
                    shadowBlur: 5,
                    shadowColor: '#fff',
                }
            );

        this.cadenceDisplayMax =
            new Konva.Text(
                {
                    x: this.cadenceDisplayMaxX,
                    y: this.cadenceDisplayMaxY,
                    text: '0',
                    fontSize: this.displayMaxSize,
                    fontFamily: 'UniSans',
                    fill: '#fff',
                    align: 'right',
                    shadowEnabled: true,
                    shadowBlur: 5,
                    shadowColor: '#fff',
                }
            );

        this.mask.add(this.speedArcBackground);
        this.mask.add(this.speedBottom);
        this.mask.add(this.cadenceArcBackground);
        this.mask.add(this.cadenceBottom);

        this.mask.add(this.curSpeedArc);
        this.mask.add(this.averageSpeedArc);

        this.mask.add(this.curCadenceArc);
        this.mask.add(this.averageCadenceArc);

        this.layer.add(this.mask);
        this.layer.add(this.speedDisplayFull);
        this.layer.add(this.speedDisplayDecimal);
        this.layer.add(this.speedDisplayMax);
        this.layer.add(this.cadenceDisplay);
        this.layer.add(this.cadenceDisplayMax);

        this.stage.add(this.layer);

        document.getElementById('version').innerHTML = Dashboard.getVersion();
    }

    /**
     *
     */
    initAverageSpeedView() {
        this.core.setMaxSpeed(this.core.getMaxSpeed());
        this.updateAverageSpeedView(this.core.getAverageSpeed(), true);
    }

    /**
     *
     */
    initAverageCadenceView() {
        this.core.setMaxCadence(this.core.getMaxCadence());
        this.updateAverageCadenceView(this.core.getAverageCadence(), true);

        if (this.averageCadenceIntervalObject === null) {
            this.averageCadenceIntervalObject =
                setInterval(() => {
                    this.updateAverageCadenceView(this.core.getAverageCadence(), false);
                }, this.averageCadenceInterval);
        }
    }

    /**
     *
     */
    initSpeedCheck() {
        if (this.checkSpeedIntervalObject === null) {
            this.checkSpeedIntervalObject =
                setInterval(() => {
                    if (new Date().getTime() - this.lastSpeedUpdate >
                        this.checkSpeedInterval) {
                        this.updateCurrentSpeedView(0);
                    }
                }, this.checkSpeedInterval);
        }
    }

    /**
     *
     */
    initCadenceCheck() {
        if (this.checkCadenceIntervalObject === null) {
            this.checkCadenceIntervalObject =
                setInterval(() => {
                    if (new Date().getTime() - this.lastCadenceUpdate >
                        this.checkCadenceInterval) {
                        this.updateCurrentCadenceView(0);
                    }
                }, this.checkCadenceInterval);
        }
    }

    /**
     * @param {number} speed
     */
    updateCurrentSpeedView(speed: number) {
        this.lastSpeedUpdate = new Date().getTime();

        speed = Core.round(speed);

        let speedFull = Core.decimal(speed).split('.');

        this.speedDisplayFull.text(speedFull[0]);
        this.speedDisplayDecimal.text(speedFull[1]);
        this.speedDisplayMax.text(this.core.getMaxSpeed());

        this.core.setMaxSpeed(speed);

        let opacity: number = 1;
        let color: string = this.arcBackgroundColor;

        if (speed === 0) {
            opacity = 0;
        }

        let tween =
            new Konva.Tween(
                {
                    node: this.curSpeedArc,
                    angle: this.core.calculateSpeedBasedRotation(speed),
                    easing: Konva.Easings.EaseInOut,
                    duration: 0.5,
                    opacity: opacity
                }
            );

        tween.play();

        if (speed > 0) {
            color = this.arcForeGroundColor;
        }

        tween =
            new Konva.Tween(
                {
                    node: this.speedBottom,
                    easing: Konva.Easings.EaseInOut,
                    duration: 0.5,
                    fill: color,
                }
            );

        tween.play();

        document.getElementById('speed').innerHTML =
            Core.decimal(speed) +
            ' > ' +
            this.core.getAverageSpeed() +
            ' - (' +
            this.core.getMaxSpeed() +
            '/' +
            this.core.getMaxSpeedCeiling() + ')';
    }

    /**
     * @param {number} cadence
     */
    updateCurrentCadenceView(cadence: number) {
        this.lastCadenceUpdate = new Date().getTime();

        cadence = Core.round(cadence);

        this.core.setMaxCadence(cadence);
        this.core.setAverageCadence(cadence);

        let cadenceFull = Core.decimal(cadence).split('.');
        this.cadenceDisplay.text(cadenceFull[0]);

        this.cadenceDisplayMax.text(this.core.getMaxCadence());

        let opacity: number = 1;
        let color: string = this.arcBackgroundColor;

        if (cadence === 0) {
            opacity = 0;
        }

        let tween =
            new Konva.Tween(
                {
                    node: this.curCadenceArc,
                    angle: this.core.calculateCadenceBasedRotation(cadence),
                    easing: Konva.Easings.EaseInOut,
                    duration: 0.5,
                    opacity: opacity
                }
            );

        tween.play();

        if (cadence > 0) {
            color = this.arcForeGroundColor;
        }

        tween =
            new Konva.Tween(
                {
                    node: this.cadenceBottom,
                    easing: Konva.Easings.EaseInOut,
                    duration: 0.5,
                    fill: color,
                }
            );

        tween.play();

        document.getElementById('cadence').innerHTML =
            Core.decimal(cadence) +
            ' > ' +
            this.core.getAverageCadence() +
            ' - (' +
            this.core.getMaxCadence() +
            '/' +
            this.core.getMaxCadenceCeiling() + ')';
    }

    /**
     * @param {number} speed
     * @param {boolean} initial
     */
    updateAverageSpeedView(speed: number, initial: boolean = false) {
        speed = Core.round(speed);

        this.core.setAverageSpeed(speed);

        let duration = 0.5;
        if (initial === true) {
            duration = 5;
        }

        let rotation = 0;
        if (speed !== 0) {
            rotation = this.core.calculateSpeedBasedRotation(speed) - this.speedArcRotation;
        }

        let tween =
            new Konva.Tween(
                {
                    node: this.averageSpeedArc,
                    rotation: rotation,
                    easing: Konva.Easings.EaseInOut,
                    duration: duration,
                }
            );

        tween.play();
    }

    /**
     * @param {number} cadence
     * @param {boolean} initial
     */
    updateAverageCadenceView(cadence: number, initial: boolean = false) {
        cadence = Core.round(cadence);

        this.core.setAverageCadence(cadence);

        let duration = 0.5;
        if (initial === true) {
            duration = 5;
        }

        let rotation = 0;
        if (cadence !== 0) {
            rotation = this.core.calculateCadenceBasedRotation(cadence) + 180;
        }

        let tween =
            new Konva.Tween(
                {
                    node: this.averageCadenceArc,
                    rotation: rotation,
                    easing: Konva.Easings.EaseInOut,
                    duration: duration,
                }
            );

        tween.play();
    }
}
