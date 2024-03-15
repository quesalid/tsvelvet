import { Engine } from 'json-rules-engine'

export const testRules = () => {
    let engine = new Engine()
    engine.addRule({
        conditions: {
            any: [{
                all: [{
                    fact: 'gameDuration',
                    operator: 'equal',
                    value: 40
                }, {
                    fact: 'personalFoulCount',
                    operator: 'greaterThanInclusive',
                    value: 5
                }]
            }, {
                all: [{
                    fact: 'gameDuration',
                    operator: 'equal',
                    value: 48
                }, {
                    fact: 'personalFoulCount',
                    operator: 'greaterThanInclusive',
                    value: 6
                }]
            }]
        },
        event: {  // define the event to fire when the conditions evaluate truthy
            type: 'fouledOut',
            params: {
                message: 'Player has fouled out!'
            }
        }
    })

    let facts = {
        personalFoulCount: 6,
        gameDuration: 40
    }

    engine
        .run(facts)
        .then(({ events }) => {
            events.map(event => console.log(event.params.message))
        })

}