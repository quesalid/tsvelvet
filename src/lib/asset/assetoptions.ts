// Desc: Opzioni per i grafici
// Date: 04/07/2021
// Grafico con timeline e markers
const optionTmech: any = {
    title: {
        text: null,
        textStyle: {
            color: 'white'
        },
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        orient: 'vertical',
        top: '10%', // Posiziona il legend sotto il grafico
        left: 'left',
        data: null,
        selected: null,
    },
    grid: {
        top: '10%',
        bottom: '20%', // Margine per lasciare spazio alla timeline e al legend
        containLabel: true // Aggiusta i margini automaticamente
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
        },
        iconStyle: {
            borderColor: 'white'
        }
    },
    xAxis: {
        type: 'category',
        gridIndex: 0, // Associa l'asse X al grid
        data: null
    },
    yAxis:
        [
            {
                type: 'value',
                name: '[kN]',
                max: 70,
                min: 0,
            }
        ],
    series: null,
    timeline: {
        axisType: 'category',
        data: null,
        autoPlay: false,
        bottom: '10%', // Posiziona la timeline in basso
        playInterval: 2000,
        loop: false,
        controlStyle: {
            position: 'left'
        }
    },
};

const legendTmech = {
    data: [],
    top: 30,
    selected: null
}

const markerSerieTmech = {
    name: 'markers',
    type: 'line',
    data: [], // Nessun dato visibile
    markLine: {
        symbol: 'none', // Nessun simbolo alle estremità
        data: []
    }
}

const gettime = (h: number, f: number) => {
    let time = h * 60;
    let timearr = [];
    let num = (f - h) * 4;
    for (let i = 0; i < num; i++) {
        let h = Math.floor(time / 60);
        let m = time % 60;
        let hstr = h < 10 ? '0' + h : h.toString();
        let mstr = m < 10 ? '0' + m : m.toString();
        timearr.push(hstr + ':' + mstr);
        time += 15;
    }
    return timearr;
}
// torna la timeline campionando ogni ora dalla xdata
const gettimeline = (h:number,f:number) => {
    let xdata = gettime(h, f);
    let timeline = [];
    for (let i = 0; i < xdata.length; i++) {
        if (i % 4 == 0) {
            timeline.push(xdata[i]);
        }
    }
    return timeline;
}

const getMarkerSerieDataTmech = (max: number, min:number) => {
    const markerseries = [
        {
            yAxis: min,
            name: 'Limite Warning',
            lineStyle: {
                color: 'orange',
                type: 'dashed'
            },
            label: {
                formatter: 'Warning ({c} kN)'
            }
        },
        {
            yAxis: max,
            name: 'Limite Allarme',
            lineStyle: {
                color: 'red',
                type: 'solid'
            },
            label: {
                formatter: 'Allarme ({c} kN)'
            }
        }
    ]
    return markerseries;
}

const getMarkerSerieTmech = (max:any,min:any) => {
    const markerseries = getMarkerSerieDataTmech(max, min);
    return {
        ...markerSerieTmech,
        markLine: {
            ...markerSerieTmech.markLine,
            data: markerseries
        }
    }
}

const getLegendTmech = (data: any) => {
    const legend = {
        ...legendTmech,
        data: data,
        selected: Object.fromEntries(data.map((key: string) => [key, true]))
    }
    return legend
}

const getSeries = (data: any, numpoints: number, min:number, max:number) => {
    let series = [];
    let legend = getLegendTmech(data).data;
    let markerSerie = getMarkerSerieTmech(min,max);
    for (let i = 0; i < legend.length; i++) {
        const points = [];
        let nextinit = Math.floor(Math.random() * 30);
        for (let j = 0; j < numpoints; j++) {
            // add noise to parabola
            let parabola = 20 - 100 * Math.pow(numpoints / 2 - j, 2) / 1000;
            let next = nextinit + parabola + Math.floor(Math.random() * 5);
            points.push(next);
        }
        series.push({
            name: legend[i].name,
            type: 'line',
            data: points,
        });
    }
    // aggiungi la serie dei markers
    series.push(markerSerie);
    return series;
}

const getOptionTmech = (title: string, data: any, h: number, f: number, min: number, max: number) => {
    optionTmech.title.text = title;
    optionTmech.xAxis.data = gettime(h, f);
    const series = getSeries(data, optionTmech.xAxis.data.length, min, max);
    optionTmech.series = series;
    optionTmech.legend = getLegendTmech(data);
    optionTmech.timeline.data = gettimeline(h, f);
    return optionTmech;
}

// Grafico storico
const optionHistoric: any = {
    title: {
        text: 'Tensione media (kN)',
        left: 'center',
        textStyle: {
            color: 'white',
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    },
    legend: {
        data: ['4A', '4B', '8A', '8B', '12A', '12B'],
        top: '95%', // Posizione sotto tutti i grafici
        left: 'center',
        textStyle: {
            color: 'white'
        },
        selected: {
            'Grafico 1': true,
            'Grafico 2': true,
            'Grafico 3': true,
            'Grafico 4': true,
            'Grafico 5': true,
            'Grafico 6': true
        }
    },
    grid: [
        { top: '5%', height: '12%' },
        { top: '20%', height: '12%' },
        { top: '35%', height: '12%' },
        { top: '50%', height: '12%' },
        { top: '65%', height: '12%' },
        { top: '80%', height: '12%' }
    ],
    xAxis: [
        { gridIndex: 0, type: 'category', data: ['A', 'B', 'C', 'D'], axisLabel: { color: 'white' } },
        { gridIndex: 1, type: 'category', data: ['A', 'B', 'C', 'D'], axisLabel: { color: 'white' } },
        { gridIndex: 2, type: 'category', data: ['A', 'B', 'C', 'D'], axisLabel: { color: 'white' } },
        { gridIndex: 3, type: 'category', data: ['A', 'B', 'C', 'D'], axisLabel: { color: 'white' } },
        { gridIndex: 4, type: 'category', data: ['A', 'B', 'C', 'D'], axisLabel: { color: 'white' } },
        { gridIndex: 5, type: 'category', data: ['A', 'B', 'C', 'D'], axisLabel: { color: 'white' } }
    ],
    yAxis: [
        { gridIndex: 0, type: 'value', name: 'kN', axisLabel: { color: 'white' } },
        { gridIndex: 1, type: 'value', name: 'kN', axisLabel: { color: 'white' } },
        { gridIndex: 2, type: 'value', name: 'kN', axisLabel: { color: 'white' } },
        { gridIndex: 3, type: 'value', name: 'kN', axisLabel: { color: 'white' } },
        { gridIndex: 4, type: 'value', name: 'kN', axisLabel: { color: 'white' } },
        { gridIndex: 5, type: 'value', name: 'kN', axisLabel: { color: 'white' } }
    ],
    series: [
        {
            name: '4A',
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 0,
            areaStyle: {},
            data: [10, 15, 20, 25]
        },
        {
            name: '$B',
            type: 'line',
            xAxisIndex: 1,
            yAxisIndex: 1,
            areaStyle: {},
            data: [20, 25, 30, 35]
        },
        {
            name: '8A',
            type: 'line',
            xAxisIndex: 2,
            yAxisIndex: 2,
            areaStyle: {},
            data: [30, 35, 40, 45]
        },
        {
            name: '8B',
            type: 'line',
            xAxisIndex: 3,
            yAxisIndex: 3,
            areaStyle: {},
            data: [40, 45, 50, 55]
        },
        {
            name: '12A',
            type: 'line',
            xAxisIndex: 4,
            yAxisIndex: 4,
            areaStyle: {},
            data: [50, 55, 60, 65]
        },
        {
            name: '12B',
            type: 'line',
            xAxisIndex: 5,
            yAxisIndex: 5,
            areaStyle: {},
            data: [60, 65, 70, 75]
        }
    ]
};

const getLegendHistoric = (data: any) => {
    const legend = {
        data: data,
        selected: Object.fromEntries(data.map((key: string) => [key, true])),
        top: '97%', // Posizione sotto tutti i grafici
        left: 'center',
        textStyle: {
            color: 'white'
        },
    }
    return legend
}

const gettimeHistoric = (h: string) => {
    // torna il tempo in mesi a partire da h (data iniziale) fino ad oggi
    let time = new Date(h);
    let timearr = [];
    let today = new Date();
    while (time < today) {
        let m = time.getMonth() + 1;
        let y = time.getFullYear();
        let mstr = m < 10 ? '0' + m : m.toString();
        timearr.push(y + '-' + mstr);
        time.setMonth(time.getMonth() + 1);
    }
    return timearr;
}

const getSeriesHistoric = (data: any,pointnum:any) => {
    let series = [];
    for (let i = 0; i < data.length; i++) {
        let points:any=[]
        for (let j = 0; j < pointnum; j++) {
            let value = Math.floor(Math.random() * 30) + 10;
            points.push(value);
        }
        series.push({
            name: data[i],
            type: 'line',
            data: points,
            xAxisIndex: i,
            yAxisIndex: i,
            areaStyle: {},
        });
    }
    return series;
}

const getOptionHistoric = (data:any, initdate:any) => {
    optionHistoric.legend = getLegendHistoric(data);
    for (let xAxis of optionHistoric.xAxis) {
        xAxis.data = gettimeHistoric(initdate);
    }
    const numpoints = optionHistoric.xAxis[0].data.length;
    optionHistoric.series = getSeriesHistoric(data, numpoints);
    return optionHistoric;
}

function generateDistributionData(mean, variance, count = 100) {
    let data = [];
    for (let i = 0; i < count; i++) {
        let x = mean - 3 * Math.sqrt(variance) + (i / count) * 6 * Math.sqrt(variance);
        let y = (1 / Math.sqrt(2 * Math.PI * variance)) * Math.exp(-Math.pow(x - mean, 2) / (2 * variance));
        // add some randomness to y value
        y += Math.random() * 0.05;
        data.push([x.toFixed(2), y.toFixed(4)]);
    }
    return data;
}

const optionDistribution = {
    title: {
        text: 'Distribuzioni tensioni (kN)',
        left: 'center',
        textStyle: { color: 'white' }
    },
    grid: [
        { left: '5%', top: '8%', width: '28%', height: '40%' }, // Prima riga, prima colonna
        { left: '37%', top: '8%', width: '28%', height: '40%' }, // Prima riga, seconda colonna
        { left: '69%', top: '8%', width: '28%', height: '40%' }, // Prima riga, terza colonna
        { left: '5%', top: '57%', width: '28%', height: '40%' }, // Seconda riga, prima colonna
        { left: '37%', top: '57%', width: '28%', height: '40%' }, // Seconda riga, seconda colonna
        { left: '69%', top: '57%', width: '28%', height: '40%' }  // Seconda riga, terza colonna
    ],
    xAxis: [
        { gridIndex: 0, type: 'value', name: 'x', axisLabel: { color: 'white' } },
        { gridIndex: 1, type: 'value', name: 'x', axisLabel: { color: 'white' } },
        { gridIndex: 2, type: 'value', name: 'x', axisLabel: { color: 'white' } },
        { gridIndex: 3, type: 'value', name: 'x', axisLabel: { color: 'white' } },
        { gridIndex: 4, type: 'value', name: 'x', axisLabel: { color: 'white' } },
        { gridIndex: 5, type: 'value', name: 'x', axisLabel: { color: 'white' } }
    ],
    yAxis: [
        { gridIndex: 0, type: 'value', name: 'y', axisLabel: { color: 'white' } },
        { gridIndex: 1, type: 'value', name: 'y', axisLabel: { color: 'white' } },
        { gridIndex: 2, type: 'value', name: 'y', axisLabel: { color: 'white' } },
        { gridIndex: 3, type: 'value', name: 'y', axisLabel: { color: 'white' } },
        { gridIndex: 4, type: 'value', name: 'y', axisLabel: { color: 'white' } },
        { gridIndex: 5, type: 'value', name: 'y', axisLabel: { color: 'white' } }
    ],
    series: [
        {
            name: '4A',
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: generateDistributionData(20, 1)
        },
        {
            name: '4B',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: generateDistributionData(21, 2)
        },
        {
            name: '8A',
            type: 'bar',
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: generateDistributionData(19, 0.5)
        },
        {
            name: '8B',
            type: 'bar',
            xAxisIndex: 3,
            yAxisIndex: 3,
            data: generateDistributionData(18, 1.5)
        },
        {
            name: '12A',
            type: 'bar',
            xAxisIndex: 4,
            yAxisIndex: 4,
            data: generateDistributionData(22, 2)
        },
        {
            name: '12B',
            type: 'bar',
            xAxisIndex: 5,
            yAxisIndex: 5,
            data: generateDistributionData(21, 0.8)
        }
    ],
    graphic: [
        { // Titolo del primo grafico
            type: 'text',
            left: '19%', // Centrare sul primo grafico
            top: '5%',
            style: {
                text: '4A',
                fill: 'white',
                font: '14px sans-serif',
                textAlign: 'center'
            }
        },
        { // Titolo del secondo grafico
            type: 'text',
            left: '50%',
            top: '5%',
            style: {
                text: '4B',
                fill: 'white',
                font: '14px sans-serif',
                textAlign: 'center'
            }
        },
        { // Titolo del terzo grafico
            type: 'text',
            left: '81%',
            top: '5%',
            style: {
                text: '8A',
                fill: 'white',
                font: '14px sans-serif',
                textAlign: 'center'
            }
        },
        { // Titolo del quarto grafico
            type: 'text',
            left: '19%',
            top: '54%',
            style: {
                text: '8B',
                fill: 'white',
                font: '14px sans-serif',
                textAlign: 'center'
            }
        },
        { // Titolo del quinto grafico
            type: 'text',
            left: '50%',
            top: '54%',
            style: {
                text: '12A',
                fill: 'white',
                font: '14px sans-serif',
                textAlign: 'center'
            }
        },
        { // Titolo del sesto grafico
            type: 'text',
            left: '81%',
            top: '54%',
            style: {
                text: '12B',
                fill: 'white',
                font: '14px sans-serif',
                textAlign: 'center'
            }
        }
    ]
};


const getOptionDistribution = () => {
    return optionDistribution;
}

function generateLissajousData(a, b, points = 500) {
    let data = [];
    for (let t = 0; t <= 2 * Math.PI; t += (2 * Math.PI) / points) {
        let x = Math.sin(a * t);
        let y = Math.sin(b * t);
        data.push([x * 2, y * 2]); // Scala in metri (-2, 2)
    }
    return data;
}

function generateEllipticLissajousData(a, b, scaleX = 1, scaleY = 1, angle = 0, points = 400) {
    let data = [];
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    for (let t = 0; t <= 2 * Math.PI; t += (2 * Math.PI) / points) {
        // generate a rnadom phase shift
        const phasex = (Math.random() * 1) - 1;
        const phasey = (Math.random() * 2) - 1;
        // Coordinate originali del Lissajous
        //let x = Math.sin(a * t+phasex);
        //let y = Math.sin(b * t+phasey);
        let x = phasex +0.5
        let y = x+phasey
        

        // Scala per ottenere l'ellisse
        x *= scaleX;
        y *= scaleY;

        // Rotazione per inclinare l'ellisse
        let xRotated = x * cosAngle - y * sinAngle;
        let yRotated = x * sinAngle + y * cosAngle;

        // Aggiungi i punti trasformati
        data.push([xRotated, yRotated]);
    }
    return data;
}

const polarName = ['4A', '4B', '8A', '8b', '12A', '12B'];

const optionPolar: any = {
    title: [
        { text: 'Diagrammi di Lissajous - Sistema Cartesiano', left: 'center', textStyle: { color: 'white' } },
        ...Array.from({ length: 6 }, (_, i) => ({
            text: polarName[i],
            left: `${5 + (i % 3) * 30 + 12.5}%`, // Calcolo posizione orizzontale
            top: `${13.5 + Math.floor(i / 3) * 45 - 4}%`, // Posizione sopra ogni grafico
            textAlign: 'center',
            textStyle: { color: 'white', fontSize: 12 }
        }))
    ],
    grid: Array.from({ length: 6 }, (_, i) => ({
        left: `${5 + (i % 3) * 30}%`, // Posizione orizzontale
        top: `${13.5 + Math.floor(i / 3) * 45}%`, // Posizione verticale
        width: '25%',
        height: '35%'
    })),
    xAxis: Array.from({ length: 6 }, (_, i) => ({
        gridIndex: i, // Associazione al grid corretto
        type: 'value',
        min: -2,
        max: 2,
        name: 'X (metri)',
        nameLocation: 'middle',
        nameGap: 25,
        axisLabel: { color: 'white' },
        nameTextStyle: { color: 'white' }
    })),
    yAxis: Array.from({ length: 6 }, (_, i) => ({
        gridIndex: i, // Associazione al grid corretto
        type: 'value',
        min: -2,
        max: 2,
        name: 'Y (metri)',
        nameLocation: 'middle',
        nameGap: 25,
        axisLabel: { color: 'white' },
        nameTextStyle: { color: 'white' }
    })),
    series: Array.from({ length: 6 }, (_, i) => ({
        type: 'line',
        xAxisIndex: i, // Associazione all'asse X corretto
        yAxisIndex: i, // Associazione all'asse Y corretto
        data: generateEllipticLissajousData(1, 1, 1.2, 1.2, 6*Math.PI / 2),
        lineStyle: {
            width: 1
        },
        symbol: 'none' // Nessun simbolo per i punti
    })),
    backgroundColor: '#1b1b1b'
};


const getOptionPolar = () => {
    return optionPolar;
}

export { getOptionTmech, getOptionHistoric, getOptionDistribution, getOptionPolar };









