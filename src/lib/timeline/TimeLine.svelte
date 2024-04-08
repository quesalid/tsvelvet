<script lang='ts'>
import {onMount} from 'svelte'

let timelineStepper:any
let timelineStepTitle:any 
let timelineSlidesContainer:any
let timelineSlides:any
let timeline:any

export let steps = [
]
const DOM = {
    timeline: "timeline",
    timelineStepper: "timeline__stepper",
    timelineStep: "timeline__step",
    timelineStepTitle: "timeline__step-title",
    timelineStepActive: "is-active",
    timelineStepActiveMarker: "timeline__step-active-marker",
    timelineSlidesContainer: "timeline__slides",
    timelineSlide: "timeline__slide",
    timelineSlideActive: "is-active",
};
const STEP_ACTIVE_MARKEP_CUSTOM_PROPS = {
    width: "--slide-width",
    posX: "--slide-pos-x",
    posY: "--slide-pos-y",
};
const SLIDES_CONTAINER_CUSTOM_PROPS = {
    height: "--slides-container-height",
};

 
onMount(() => {
    timeline = document.querySelector(`.${DOM.timeline}`);
    console.log("TIMELINE",timeline)
    timelineStepper = timeline === null || timeline === void 0 ? void 0 : timeline.querySelector(`.${DOM.timelineStepper}`);
    timelineStepTitle = timeline === null || timeline === void 0 ? void 0 : timeline.querySelector(`.${DOM.timelineStepTitle}`);
    timelineSlidesContainer = timeline === null || timeline === void 0 ? void 0 : timeline.querySelector(`.${DOM.timelineSlidesContainer}`);
    timelineSlides = timeline && Array.from(timeline.querySelectorAll(`.${DOM.timelineSlide}`));

    createStepActiveMarker();
    activateCurrentSlide();
    recalcStepActiveMarkerProps();

    timeline === null || timeline === void 0 ? void 0 : timeline.addEventListener("click", (event) => {
        const { target } = event;
        if (!target ||
            !(target instanceof Element) ||
            !target.closest(`.${DOM.timelineStep}`)) {
            return;
        }
        const currentStep = target.closest(`.${DOM.timelineStep}`);
        if (!currentStep) {
            return;
        }
        deactivateSteps();
        activateCurrentStep(currentStep);
        recalcStepActiveMarkerProps();
        deactivateSlides();
        activateCurrentSlide();
    });
})


function deactivateSteps() {
    const steps = document.querySelectorAll(`.${DOM.timelineStep}`);
    steps === null || steps === void 0 ? void 0 : steps.forEach((elem) => elem.classList.remove(`${DOM.timelineStepActive}`));
}
function activateCurrentStep(currentStep) {
    currentStep === null || currentStep === void 0 ? void 0 : currentStep.classList.add(`${DOM.timelineStepActive}`);
}
function deactivateSlides() {
    timelineSlides === null || timelineSlides === void 0 ? void 0 : timelineSlides.forEach((elem) => elem.classList.remove(`${DOM.timelineSlideActive}`));
}
function activateCurrentSlide() {
    const currentSlide = getCurrentSlide();
    if (!currentSlide) {
        return;
    }
    const currentSlideHeight = getCurrentSlideHeight(currentSlide);
    setSlideContainerHeight(currentSlideHeight);
    currentSlide.classList.add(`${DOM.timelineSlideActive}`);
    console.log("CURRENT SLIDE",currentSlide)
}
function createStepActiveMarker() {
    const stepActiveMarker = document.createElement("div");
    stepActiveMarker.classList.add(`${DOM.timelineStepActiveMarker}`);
    timelineStepper === null || timelineStepper === void 0 ? void 0 : timelineStepper.appendChild(stepActiveMarker);
    const positionProps = getStepActiveMarkerProps();
    if (!positionProps) {
        return;
    }
    setStepActiveMarkerProps(Object.assign({ stepActiveMarker }, positionProps));
}
function recalcStepActiveMarkerProps() {
    const stepActiveMarker = timeline === null || timeline === void 0 ? void 0 : timeline.querySelector(`.${DOM.timelineStepActiveMarker}`);
    const stepActiveMarkerProps = getStepActiveMarkerProps();
    if (!stepActiveMarkerProps) {
        return;
    }
    setStepActiveMarkerProps(Object.assign({ stepActiveMarker }, stepActiveMarkerProps));
}
function setStepActiveMarkerProps({ stepActiveMarker, posX, posY, width, }) {
    stepActiveMarker.style.setProperty(`${STEP_ACTIVE_MARKEP_CUSTOM_PROPS.width}`, `${width}px`);
    stepActiveMarker.style.setProperty(`${STEP_ACTIVE_MARKEP_CUSTOM_PROPS.posX}`, `${posX}px`);
    if (typeof posY === "number") {
        stepActiveMarker.style.setProperty(`${STEP_ACTIVE_MARKEP_CUSTOM_PROPS.posY}`, `${posY}px`);
    }
}
function getStepActiveMarkerProps() {
    const { currentStep } = getCurrentStep();
    if (!currentStep) {
        return null;
    }
    const width = getElementWidth(currentStep);
    const posX = getStepActiveMarkerPosX(currentStep);
    const posY = getStepActiveMarkerPosY();
    if (typeof posX !== "number" || typeof posY !== "number") {
        return null;
    }
    return { posX, posY, width };
}
function getCurrentStep() {
    const timelineSteps = Array.from(document.querySelectorAll(`.${DOM.timelineStep}`));
    const currentStep = timelineSteps.find((element) => element.classList.contains(`${DOM.timelineStepActive}`));
    const currentStepIndex = currentStep &&
        timelineSteps.findIndex((element) => element.classList.contains(`${DOM.timelineStepActive}`));
    return { currentStep, currentStepIndex };
}
function getCurrentSlide() {
    const { currentStepIndex } = getCurrentStep();
    
    if (typeof currentStepIndex !== "number" || !timelineSlides) {
        return null;
    }
    return timelineSlides[currentStepIndex];
}
function setSlideContainerHeight(height:any) {
    timelineSlidesContainer === null || timelineSlidesContainer === void 0 ? void 0 : timelineSlidesContainer.style.setProperty(`${SLIDES_CONTAINER_CUSTOM_PROPS.height}`, `${height}px`);
}
function getCurrentSlideHeight(currentSlide) {
    return currentSlide.clientHeight;
}
function getStepActiveMarkerPosY() {
    const timelineTitlePosY = timelineStepTitle === null || timelineStepTitle === void 0 ? void 0 : timelineStepTitle.getBoundingClientRect().top;
    const timelineStepperPosY = timelineStepper === null || timelineStepper === void 0 ? void 0 : timelineStepper.getBoundingClientRect().top;
    if (!timelineTitlePosY || !timelineStepperPosY) {
        return null;
    }
    return timelineTitlePosY - timelineStepperPosY;
}
function getStepActiveMarkerPosX(currentStep) {
    const timelineStepperPosX = timelineStepper === null || timelineStepper === void 0 ? void 0 : timelineStepper.getBoundingClientRect().left;
    const currentStepPosX = currentStep.getBoundingClientRect().left;
    if (!timelineStepperPosX) {
        return null;
    }
    return currentStepPosX - timelineStepperPosX;
}
function getElementWidth(elem) {
    return elem.clientWidth;
}
</script>

<div class="content">
  <div class="container">
    <div class="timeline">
      <div class="timeline__stepper">
          {#each steps as Step}
            <div class="timeline__step {Step.step == steps[0].step?'is-active':''}">
              <p class="timeline__step-title">
                {Step.step}
              </p>
            </div>
          {/each}
      </div>

      <div class="timeline__slides">
          {#each steps as Step}
            <div class="timeline__slide {Step.step == steps[0].step?'is-active':''}">
                  <h3 class="timeline__slide-title">{Step.step}</h3>
                  <div class="timeline__slide-content">
                    <p>{Step.description}</p>
                    <input type='button' value="Start" on:click={Step.funct}/>
                  </div>
            </div>
           {/each}
      </div>
    </div>
  </div>
</div>
<style>
:root {
    --color-accent-light: #00DBDE;
    --color-accent-dark: #FC00FF;
    --color-secondary: #ccc;

    --text-color-default: #2c2c2c;
    --text-color-light: #bbb;

    --font-size-default: 15px;
    --font-size-lg: 25px;

    --font-weight-regular: 400;
    --font-weight-semibold: 600;
    --font-weight-default: var(--font-weight-regular);

    --border-color-default: var(--color-secondary);
    --border-color-accent: var(--color-accent-dark);

    --bg-color-default: #fff;
    --bg-color-dark: #2c2c2c;
    --bg-color-accent--lignt: var(--color-accent-light);
    --bg-color-accent--dark: var(--color-accent-dark);

    --transition-duration: .2s;
    --transition-timing-function: linear;
    --transition-delay: 0s;

    --negative-multiplier: -1;

    --gradient-default: linear-gradient(122deg, var(--color-accent-light) 0%, var(--color-accent-dark) 100%);

}
.cd__main{
   display: block !important;
}
body {
    font-family: 'Arial', sans-serif;
    font-size: var(--font-size-default);
    color: var(--text-color-default);
}

/* EXAMPLE STYLES: YOU DON'T NEED THEM!!! */
.header {
    max-width: 500px;
    margin: auto;
    text-align: center;
}

.header__btns {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 30px;
}

body a {
    color: inherit;
    text-decoration: none;
}

.header__btn {
    transition:
            all
            var(--transition-duration)
            var(--transition-timing-function)
            var(--transition-delay);
    padding: 10px 20px;
    margin-right: 10px;
    background-color: var(--bg-color-default);
    border: 1px solid var(--border-color-default);
    border-radius: 3px;
    cursor: pointer;
    outline: none;
}

.header__btn:hover,
.header__btn.js-active {
    color: var(--text-color-light);
    background-color: var(--bg-color-dark);
}

.header__title {
    margin-bottom: 10px;
    font-weight: var(--font-weight-semibold);
}

.content {
    margin: 25px auto;
}


/* TIMELINE STYLES: YOU NEED THEM!!! */
.timeline {
    --wrapper-width: 900px;

    width: 95%;
    max-width: var(--wrapper-width);
    margin: auto;
}

.timeline__stepper {
    --step-border-width: 3px;
    --offset-to-slider-content: 30px;

    position: relative;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    margin-bottom: var(--offset-to-slider-content);
}

@media(min-width: 530px) {
    .timeline__stepper {
        display: flex;
        justify-content: space-around;
        gap: 0;
    }
}

@media(min-width: 700px) {
    .timeline__stepper {
        --offset-to-slider-content: 50px;
    }
}

.timeline__step {
    position: relative;
    width: 100%;
    cursor: pointer;
}

@media(min-width: 530px) {
    .timeline__step {
        width: 100%;;
    }
}


.timeline__step-title {
    --timeline-dot-dimensions: 11px;
    --extra-offset-fox-pixelperfect: -1px;

    position: relative;
    display: none;
    padding-top: 30px;
    margin-bottom: 0;
    text-align: center;
    line-height: 1.7;
    border-top: var(--step-border-width) solid var(--border-color-default);
}

@media(min-width: 700px) {
    .timeline__step-title {
        display: block;
    }
}

.timeline__step-title:before,
.timeline__step-title:after {
    position: absolute;
    top: var(--dot-top-position);
    left: 50%;
    display: block;
    width: var(--timeline-dot-dimensions);
    height: var(--timeline-dot-dimensions);
    content: '';
    border-radius: 50%;
}

.timeline__step-title:before {
    --dot-top-position: calc(
            var(--timeline-dot-dimensions)/2 * var(--negative-multiplier) + var(--extra-offset-fox-pixelperfect)
    );

    transform: translate(-50%);
    border: 2px solid var(--border-color-default);
    border-radius: 50%;
    background-color: #fff;
    z-index: 5;
}

.timeline__step-title:after {
    --timeline-dot-dimensions: 25px;
    --dot-top-position: calc(
            var(--timeline-dot-dimensions)/2 * var(--negative-multiplier) + var(--extra-offset-fox-pixelperfect)
    );

    transform: translate(-50%) scale(0);
    border-radius: 50%;
    background-color: #fff;
}

/* this elements generates in JS */
.timeline__step-active-marker {
    --slide-pos-y: none; /* calcs on the fly in js */
    --slide-pos-x: none; /* calcs on the fly in js */
    --slide-width: auto; /* calcs on the fly in js */

    --transition-timing-function: cubic-bezier(0, 0, 0, 1.2);

    position: absolute;
    top: var(--slide-pos-y);
    left: 0;
    display: none;
    width: var(--slide-width);
    height: var(--step-border-width);
    transform: translateX(var(--slide-pos-x));
    transition: transform var(--transition-duration) var(--transition-timing-function) var(--transition-delay);
    background-image: var(--gradient-default);
}

@media(min-width: 700px) {
    .timeline__step-active-marker {
        display: block;
    }
}

.timeline__step.is-active {
    cursor: default;
}

.timeline__step.is-active .timeline__step-title {
    font-weight: var(--font-weight-semibold);
}

.timeline__step.is-active .timeline__step-title:before {
    transition: background-color var(--transition-duration) var(--transition-timing-function) var(--transition-delay);
    background-color: var(--color-accent-dark);
    border-color: var(--border-color-accent);
}

.timeline__step.is-active .timeline__step-title:after {
    transform: translate(-50%) scale(1);
    transition: transform var(--transition-duration) var(--transition-timing-function) var(--transition-delay);
    background-image: var(--gradient-default);
    opacity: .35;
}


.timeline__slides {
    --slides-container-height: 0px; /* calcs on the fly in js */

    --content-offset-x: 20px;
    --content-offset-y: 15px;

    /*--decoration-blur-spread: 20px;
    --decoration-opacity: .7;
    --decoration-pos-x: 0;
    --decoration-pos-y: 20px;
    --decoration-scale: 1;*/

    position: relative;
    width: 600px;
    max-width: 100%;
    margin: auto;
    height: var(--slides-container-height);
    border-radius: 5px;
    border: 1px solid;
    background-color: var(--bg-color-default);
}

@media(min-width: 700px) {
    .timeline__slides {
        --content-offset-x: 30px;
        --content-offset-y: 20px;
    }
}

.timeline__slides:before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: "";
    opacity: var(--decoration-opacity);
    background-image: var(--gradient-default);
    filter: blur(var(--decoration-blur-spread));
    transform: translate3d(var(--decoration-pos-x), var( --decoration-pos-y), 0) scale(var(--decoration-scale));
    z-index: -1;
}

.timeline__slide {
    position: absolute;
    top: 0;
    left: 0;
    padding: var(--content-offset-y) var(--content-offset-x);
    opacity: 0;
    visibility: hidden;
}

.timeline__slide.is-active {
    transition: opacity var(--transition-duration) var(--transition-timing-function) var(--transition-delay);
    opacity: 1;
    visibility: visible;
}

.timeline__slide-title {
    margin-top: 0;
    font-weight: var(--font-weight-semibold);
}

.timeline__slide-content {
    line-height: 1.7;
}

.timeline__slide-content p:first-child {
    margin-top: 0;
}

.timeline__slide-content p:last-child {
    margin-bottom: 0;
}

.timeline__slide-content input[type='button'] {
    border: 1px solid;
    border-radius: 2px;
    padding: 3px;
    cursor: pointer;
    background-color: #DDDDDD;
}
</style>