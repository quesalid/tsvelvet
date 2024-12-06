/** asset model*/
export class AssetModel {
    sag: number
    lCond = 100    // metri
    tMecc= 50       // kN
    wCond = 1.2         // kg/m
    hAnchorSx = 10  // metri
    hAnchorDx = 12    // metri
    tCond = 25             // °C (opzionale)
    tEnv = 20    // °C (opzionale)
    hEnv = 50        // % (opzionale)
    dWind = 90          // gradi (opzionale)
    sWind = 5          // m/s (opzionale)
    stretch = 0.5    // % (opzionale)

    constructor(data: any) {
        if (data) {
            this.lCond = data.lCond ? data.lCond : this.lCond
            this.tMecc = data.tMecc ? data.tMecc : this.tMecc
            this.wCond = data.wCond ? data.wCond : this.wCond
            this.hAnchorSx = data.hAnchorSx ? data.hAnchorSx : this.hAnchorSx
            this.hAnchorDx = data.hAnchorDx ? data.hAnchorDx : this.hAnchorDx
            this.tCond = data.tCond ? data.tCond : this.tCond
            this.tEnv = data.tEnv ? data.tEnv : this.tEnv
            this.hEnv = data.hEnv ? data.hEnv : this.hEnv
            this.dWind = data.dWind ? data.dWind : this.dWind
            this.sWind = data.sWind ? data.sWind : this.sWind
            this.stretch = data.stretch ? data.stretch : this.stretch
        }
        this.sag = this.calculateSag()
    }

    calculateSag() {
        // Calcolo della differenza di altezza tra i punti di ancoraggio
        const differenzaAltezza = Math.abs(this.hAnchorDx - this.hAnchorSx);

        // Calcolo della tensione orizzontale (approssimazione)
        const tensioneTrasversale = this.tMecc;

        // Calcolo del peso per unità di lunghezza
        const pesoLineare = this.wCond;

        // Formula del sag (approssimazione della catenaria)
        // Sag = (peso * lunghezza^2) / (8 * tensione)
        const sag = (pesoLineare * Math.pow(this.lCond, 2)) / (8 * tensioneTrasversale);

        // Correzione per la differenza di altezza tra i punti di ancoraggio
        const sagCorretto = sag + (differenzaAltezza / 2);

        return sagCorretto
    }

    propetryExist(property: string) {
        return this.hasOwnProperty(property)
    }

    getProperties() {
        return Object.keys(this)
    }

    getPropertyValue(property: string) {
        return this[property]
    }

}

