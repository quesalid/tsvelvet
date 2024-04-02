import { v4 as uuidv4 } from 'uuid';
class EditNode {
    constructor(name,properties) {
        this.id = uuidv4()
        this.name = name
        this.callback = 'defaultCB'
        this.subscriptions = []
        if (properties)
            this.properties = properties
        else
            this.properties = {}
    }

    getProperty(name) {
        if (this.properties[name])
            return this.properties[name]
        else
            return null
    }

    setProperty(name,value) {
        if (this.properties[name])
           this.properties[name] = value
    }

    getPropertyType(name) {
        if (this.properties[name])
            
    }

    subscribe(event, handler) {
        const subscription = { event: event, handler: handler }
        this.subscriptions.push(subscription)
    }
    unsubscribe(event) {
        this.subscriptions = this.subscriptions.filter((item)=> item.event!=event)
    }
}