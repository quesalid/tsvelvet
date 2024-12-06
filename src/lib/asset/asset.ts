/** asset class*/
export class Asset {
    /** asset model location lat lon */
    modelLocation: number[];
    /** asset model */
    model: any;
    /** asset userData */
    userData: any;
    /** asset constructor */
    constructor(location: number[], userData: any) {
        this.modelLocation = location;
        this.userData = userData;
        this.model = null;
    }
    /** asset load model */
    loadModel(model: any) {
        this.model = model;
    }
    /** asset get model */
    getModel() {
        return this.model;
    }
    /** asset get location */
    getLocation() {
        return this.modelLocation;
    }
    /** asset get userData */
    getUserData() {
        return this.userData;
    }
    /** asset set userData */
    setUserData(userData: any) {
        this.userData = userData;
    }
    /** add field to userdata*/
    addField(key: string, value: any) {
        this.userData[key] = value;
    }
    /** asset set location */
    setLocation(location: number[]) {
        this.modelLocation = location;
    }
    /** asset dispose */
    dispose() {
        this.model = null;
        this.userData = null;
    }
}