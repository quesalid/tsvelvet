<script lang='ts'>
    import { onMount } from "svelte";


    export let cableColor = "#fc97af"
    export let cableName = "4A"

    // Parametri iniziali
    let length = 200; // Lunghezza del conduttore in metri
    let heightLeft = 20; // Altezza da terra punto di ancoraggio sinistro (m)
    let heightRight = 22; // Altezza da terra punto di ancoraggio destro (m)
    let tension = 10; // Tensione meccanica in kN
    let weightPerMeter = 1.5; // Peso del conduttore in kg/m

    let canvas; // Riferimento al canvas
    let ctx; // Contesto del canvas
    const g = 9.81; // Accelerazione di gravità in m/s²

   function calculateCatenary() {
        const tensionN = tension * 1000; // Convertire tensione in N
        const weight = weightPerMeter * g; // Peso per unità di lunghezza in N/m
        const a = tensionN / weight; // Parametro della catenaria

        // Calcolo del valore minimo di y (sag)
        const sag = (weight * Math.pow(length, 2)) / (8 * tensionN);

        const points = [];
        const numPoints = 100;
        const step = length / numPoints;

        let minY = Infinity;
        let sagX = 0;

        for (let x = 0; x <= length; x += step) {
            // Calcolo della catenaria
            const relativeHeight = (x / length) * (heightRight - heightLeft) + heightLeft;
            const y =
                relativeHeight +
                a * (Math.cosh((x - length / 2) / a) - 1); // Catenaria invertita
            points.push({ x, y });

            if (y < minY) {
                minY = y;
                sagX = x;
            }
        }

        return { points, sag, sagX, sagY: minY };
    }

    function drawCatenary() {
        if (!ctx) return;

        const { points, sag, sagX, sagY } = calculateCatenary();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Scala per adattare la catenaria al canvas
        const xScale = canvas.width / length;
        const maxHeight = Math.max(heightLeft, heightRight) + sag + 10; // Altezza massima con margine
        const yScale = canvas.height / maxHeight;

        // Disegna il terreno
        ctx.strokeStyle = "green";
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.stroke();

        // Disegna la curva della catenaria
        ctx.strokeStyle = cableColor;
        ctx.beginPath();
        points.forEach(({ x, y }, index) => {
            const canvasX = x * xScale;
            const canvasY = canvas.height - y * yScale; // Coordinate corrette
            if (index === 0) {
                ctx.moveTo(canvasX, canvasY);
            } else {
                ctx.lineTo(canvasX, canvasY);
            }
        });
        ctx.stroke();

        // Disegna la linea del sag
        const sagCanvasX = sagX * xScale;
        const sagCanvasY = canvas.height - sagY * yScale;
        //const sagCanvasY =  sagY * yScale;
        const anchorYLeft = canvas.height - points[0].y * yScale;
        const anchorYRight = canvas.height - points[points.length-1].y * yScale;

        ctx.strokeStyle = "red";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sagCanvasX, Math.min(anchorYLeft, anchorYRight)); // Dall'altezza minore
        ctx.lineTo(sagCanvasX, sagCanvasY); // Al punto più basso
        console.log("start point", sagCanvasX, Math.min(anchorYLeft, anchorYRight), "end point", sagCanvasX, sagCanvasY)
        ctx.stroke();

        // Frecce sul sag
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.moveTo(sagCanvasX - 5, sagCanvasY); // Freccia inferiore
        ctx.lineTo(sagCanvasX + 5, sagCanvasY);
        ctx.lineTo(sagCanvasX, sagCanvasY - 10);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(sagCanvasX - 5, Math.min(anchorYLeft, anchorYRight)); // Freccia superiore
        ctx.lineTo(sagCanvasX + 5, Math.min(anchorYLeft, anchorYRight));
        ctx.lineTo(sagCanvasX, Math.min(anchorYLeft, anchorYRight) + 10);
        ctx.fill();

        // Testo del sag
        ctx.fillStyle = "white";
        ctx.font = "13px Arial";
        ctx.fillText(
            `Sag: ${sag.toFixed(2)} m`,
            sagCanvasX - 25,
            Math.min(anchorYLeft, anchorYRight) - 10
        );

        // Disegna la linea dal terreno a sagY
        ctx.strokeStyle = "yellow";
        ctx.beginPath();
        ctx.moveTo(sagCanvasX, canvas.height);
        ctx.lineTo(sagCanvasX, sagCanvasY);
        ctx.stroke();

        // disegna le frecce
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.moveTo(sagCanvasX - 5, sagCanvasY); // Freccia inferiore
        ctx.lineTo(sagCanvasX + 5, sagCanvasY);
        ctx.lineTo(sagCanvasX, sagCanvasY + 10);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(sagCanvasX - 5, canvas.height); // Freccia superiore
        ctx.lineTo(sagCanvasX + 5, canvas.height);
        ctx.lineTo(sagCanvasX, canvas.height - 10);
        ctx.fill();

         // Testo linea dal terreno a sagY
         ctx.fillStyle = "white";
         ctx.font = "13px Arial";
         const fromGround = Math.max(heightLeft, heightRight) - sag;
         ctx.fillText(
			 `SagY: ${fromGround.toFixed(2)} m`,
			 sagCanvasX + 10,
			 canvas.height - 10
		 );

        const pradius = 5;
        // Disegna i punti di ancoraggio
        ctx.fillStyle = cableColor;
        const anchorLeftX = pradius;
        const anchorLeftY = canvas.height - points[0].y * yScale;
        const anchorRightX = canvas.width - pradius;
        const anchorRightY = canvas.height - points[points.length-1].y * yScale;

        ctx.beginPath();
        ctx.arc(anchorLeftX, anchorLeftY, pradius, 0, 2 * Math.PI); // Cerchio sinistro
        ctx.fill();

        ctx.beginPath();
        ctx.arc(anchorRightX, anchorRightY, pradius, 0, 2 * Math.PI); // Cerchio destro
        ctx.fill();

    }

    $: {
        if (ctx) drawCatenary();
    }

    onMount(() => {
        ctx = canvas.getContext("2d");
        drawCatenary();
    });
</script>

<style>
	.comp-container {
		display: flex;
        padding: 5px;
        width:100%;
	}
    canvas {
        width:100%;
        height: auto;
        background-color: rgba(41,52,65,0.88);
    }
    .controls {
        display: flex;
        flex-direction: column;
        gap: 3px;
        margin-bottom: none;
        font-size:smaller;
        color: white;
        width:100%;
        background-color: rgba(41,52,65,0.88);
        padding: 5px;
    }
    .controls-title{
        font-weight: bold;
        font-size: larger;
        border: 1px solid white;
        border-radius: 10px;
        padding-left: 5px;
        opacity:1;
    }
    .controls label {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .controls span {
        width: 42%;
     }
    .controls input {
        margin-left: 10px;
        width: 100px;
    }
    


</style>
<div class="comp-container">
    <div class="controls">
        <div class="controls-title"> Sag cavo {cableName}</div>
        <label>
           <span> Lunghezza (m):</span>
            <input type="range" min="100" max="500" step="10" bind:value={length} on:input={drawCatenary} />
            {length}
        </label>
        <label>
            <span>Altezza sx (m):</span>
            <input type="range" min="10" max="50" step="1" bind:value={heightLeft} on:input={drawCatenary} />
            {heightLeft}
        </label>
        <label>
            <span>Altezza dx (m):</span>
            <input type="range" min="10" max="50" step="1" bind:value={heightRight} on:input={drawCatenary} />
            {heightRight}
        </label>
        <label>
            <span>Tensione (kN):</span>
            <input type="range" min="5" max="50" step="1" bind:value={tension} on:input={drawCatenary} />
            {tension}
        </label>
        <label>
            <span>Peso (kg/m):</span>
            <input type="range" min="0.5" max="5" step="0.1" bind:value={weightPerMeter} on:input={drawCatenary} />
            {weightPerMeter}
        </label>
    </div>

    <canvas bind:this={canvas} width='300px'></canvas>
</div>
