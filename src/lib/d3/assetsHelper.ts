let assets: any = []

let rdp_udsud = [
    [13.46887710880064, 45.85166383155799, 0],
    [13.464776641631351, 45.85232698092819, 0],
    [13.460000923650009, 45.85315269243209, 0],
    [13.455210296215855, 45.85241464295666, 0],
    [13.450542801534054, 45.85231740018976, 0],
    [13.44505195689818, 45.85224297923758, 0],
    [13.440372959758156, 45.85264705377735, 0],
    [13.43491566711406, 45.853145201118316, 0],
    [13.430552649969458, 45.85374031215768, 0],
    [13.427054412283702, 45.85425048747848, 0],
    [13.42180239528584, 45.85469186472455, 0],
    //[13.421753083471454, 45.85477640549971, 0],
    [13.42049752877672, 45.856784211169646, 0],
    [13.419075072517051, 45.85909838146707, 0],
    [13.417231569217059, 45.86211775336656, 0],
    [13.414944259553529, 45.86584485333895, 0],
    [13.412842256462007, 45.86940123416414, 0],
    [13.410700121573068, 45.872928602028615, 0],
    [13.409024382824242, 45.87626183308792, 0],
    [13.407730604141983, 45.879269523343716, 0],
    [13.405790138711938, 45.883102613795984, 0],
    [13.404673390576106, 45.88535190067511, 0],
    [13.401449156409143, 45.88716849668964, 0],
    [13.397964200555625, 45.889176883277486, 0],
    [13.393997700459533, 45.89144838751932, 0],
    [13.390497942214385, 45.8941214339159, 0],
    [13.387071330745606, 45.896817549729164, 0],
    [13.383708066508717, 45.899508680937736, 0],
    [13.380488647981107, 45.90207119265619, 0],
    [13.377430534947708, 45.904495986850016, 0],
    [13.374393238607812, 45.90689393176899, 0],
    [13.371921326740082, 45.90885788036059, 0],
    [13.368830462308601, 45.91130921261307, 0],
    [13.365567464319943, 45.91382065050609, 0],
    [13.362734735836513, 45.914786797388075, 0],
    [13.358106067172415, 45.91618069663717, 0],
    [13.355244373386684, 45.917071419328344, 0],
    [13.35189875631175, 45.918063650495355, 0],
    [13.347889485540682, 45.919268640789234, 0],
    [13.343076806040843, 45.91965574702892, 0],
    [13.338048063988897, 45.920019261652214, 0],
    [13.332570960307958, 45.920426599116404, 0],
    [13.327696565621824, 45.920785249222355, 0],
    [13.32323639294551, 45.92113773632758, 0],
    [13.319594100618815, 45.92387639472775, 0],
    [13.315751587018477, 45.92683995804946, 0],
    [13.312192114997028, 45.929493474069304, 0],
    [13.310873017679514, 45.93216340236006, 0]
]

const setFakeStatus = (i: number, apply=true) => {
    let fakeStatus = 'NORMAL'
    if (i % 5 === 0 && apply) {
        fakeStatus = 'WARNING'
    }
    if (i % 7 === 0 && apply) {
        fakeStatus = 'ALARM'
    }
    return fakeStatus

}

export const getAssetsFromCoords = (coordinates: any) => {
    const coords = coordinates ? coordinates : rdp_udsud
    for(let i = 0; i < coords.length; i++) {
        const asset = {
            model: null,
            modelLocation: coords[i],
            userData: {
                name: 'Traliccio CN-LN003-TR-'+i,
                type: 'Traliccio',
                id: 'CN-LN003-TR-' + i,
                center: [coords[i][0], coords[i][1]],
                sensors: [
                    { name: 'Sens_A4', id: 'SensA4', status: setFakeStatus(i,true) },
                    { name: 'Sens_A8', id: 'SensA8', status: setFakeStatus(i, false) },
                    { name: 'Sens_A12', id: 'SensA12', status: setFakeStatus(i, false) },
                    { name: 'Sens_B4', id: 'SensB4', status: setFakeStatus(i, false) },
                    { name: 'Sens_B8', id: 'SensB8', status: setFakeStatus(i, false) },
                    { name: 'Sens_B12', id: 'SensB12', status: setFakeStatus(i, false) },
                    { name: 'Sens_C4', id: 'SensC4', status: setFakeStatus(i, false) },
                    { name: 'Sens_C8', id: 'SensC8', status:setFakeStatus(i, false) },
                    { name: 'Sens_C12', id: 'SensC12', status: setFakeStatus(i, true) },
                    { name: 'Sens_D4', id: 'SensD4', status: setFakeStatus(i, false) },
                    { name: 'Sens_D8', id: 'SensD8', status: setFakeStatus(i, false) },
                    { name: 'Sens_D12', id: 'SensD12', status: setFakeStatus(i, false) },
                ]
            }
        }
        assets.push(asset)
    }
    return assets
}

export const getAssetStatus = (asset) => {
    const sensors = asset.userData.sensors
    let status = 'NORMAL'
    for (let i = 0; i < sensors.length; i++) {
        if (sensors[i].status === 'WARNING') {
            status = 'WARNING'
        }
        if(sensors[i].status === 'ALARM') {
            return 'ALARM'
        }
    }
    return status
}