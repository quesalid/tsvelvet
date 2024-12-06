// Tipo per i nodi del modello
type VariableType = "stock" | "flow" | "auxiliary";

interface Variable {
    id: string; // Identificatore unico
    type: VariableType;
    value: number; // Valore iniziale
    equation?: (context: ModelContext) => number; // Funzione per calcolare il valore (opzionale per i flussi e ausiliari)
}

// Tipo per gli archi
interface Connection {
    from: string; // ID della variabile sorgente
    to: string; // ID della variabile destinazione
}

// Contesto del modello, per passare informazioni utili alle equazioni
interface ModelContext {
    variables: Record<string, Variable>;
}

class Model {
    private variables: Record<string, Variable> = {};
    private connections: Connection[] = [];

    addVariable(variable: Variable): void {
        this.variables[variable.id] = variable;
    }

    addConnection(connection: Connection): void {
        this.connections.push(connection);
    }

    simulate(steps: number, dt: number): number[][] {
        const results: number[][] = [];
        for (let step = 0; step < steps; step++) {
            const snapshot: number[] = [];

            // Aggiorna ogni variabile in base al tipo
            for (const id in this.variables) {
                const variable = this.variables[id];
                if (variable.type === "stock") {
                    // Aggiorna lo stock basandosi sui flussi
                    const inflows = this.getFlows(id, "inflow");
                    const outflows = this.getFlows(id, "outflow");
                    variable.value += dt * (inflows - outflows);
                } else if (variable.equation) {
                    // Calcola ausiliari e flussi
                    variable.value = variable.equation({ variables: this.variables });
                }
                snapshot.push(variable.value);
            }
            results.push(snapshot);
        }
        return results;
    }

    private getFlows(stockId: string, type: "inflow" | "outflow"): number {
        // Calcola i flussi in ingresso o in uscita
        return Object.values(this.variables)
            .filter(
                (v) =>
                    v.type === "flow" &&
                    this.connections.some(
                        (c) =>
                            (type === "inflow" && c.from === v.id && c.to === stockId) ||
                            (type === "outflow" && c.from === stockId && c.to === v.id)
                    )
            )
            .reduce((sum, flow) => sum + (flow.value || 0), 0);
    }
}
