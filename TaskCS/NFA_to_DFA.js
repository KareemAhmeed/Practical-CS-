function epsilonClosure(nfa, stateSet) {
    const stack = [...stateSet];
    const closure = new Set(stateSet);

    while (stack.length > 0) {
        const state = stack.pop();
        const epsilonMoves = nfa.transitions[state]?.['ε'] || [];

        for (const nextState of epsilonMoves) {
            if (!closure.has(nextState)) {
                closure.add(nextState);
                stack.push(nextState);
            }
        }
    }

    return Array.from(closure);
}

function move(nfa, states, symbol) {
    const result = new Set();
    for (const state of states) {
        const moves = nfa.transitions[state]?.[symbol] || [];
        for (const nextState of moves) {
            result.add(nextState);
        }
    }
    return Array.from(result);
}

function nfaToDfa(nfa) {
    const dfa = {
        states: [],
        transitions: {},
        startState: null,
        acceptStates: new Set()
    };

    const symbols = nfa.symbols.filter(s => s !== 'ε');
    const startClosure = epsilonClosure(nfa, [nfa.startState]);
    const stateMap = {};
    const stateQueue = [startClosure];
    const visited = new Set();

    const getStateName = (states) => states.sort().join(',');

    while (stateQueue.length > 0) {
        const current = stateQueue.shift();
        const stateName = getStateName(current);

        if (visited.has(stateName)) continue;
        visited.add(stateName);
        dfa.states.push(stateName);
        dfa.transitions[stateName] = {};

        if (current.includes(nfa.acceptState)) {
            dfa.acceptStates.add(stateName);
        }

        for (const symbol of symbols) {
            const moveResult = move(nfa, current, symbol);
            const closure = epsilonClosure(nfa, moveResult);
            const newStateName = getStateName(closure);

            if (closure.length === 0) continue;

            dfa.transitions[stateName][symbol] = newStateName;
            if (!visited.has(newStateName)) {
                stateQueue.push(closure);
            }
        }
    }

    dfa.startState = getStateName(startClosure);
    dfa.acceptStates = Array.from(dfa.acceptStates);
    return dfa;
}

// مثال بسيط على NFA
const nfa = {
    symbols: ['a', 'b', 'ε'],
    startState: 'q0',
    acceptState: 'q2',
    transitions: {
        q0: { 'ε': ['q1'] },
        q1: { 'a': ['q1'], 'b': ['q2'] },
        q2: {}
    }
};

const dfa = nfaToDfa(nfa);
console.log(dfa);
