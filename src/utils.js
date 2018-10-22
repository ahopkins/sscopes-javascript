const _reverse = (s) => {
    return [...s].reverse().join('');
}

const _rsplit = (s, sep, length=-1) => {
    let spl;
    const reversed = _reverse(s);
    spl = reversed.split(sep).map(_reverse).reverse();
    if (length > -1) {
        const end = spl.length - length;
        const start = length;
        const rem = spl.slice(0, end).join(sep);
        const ret = spl.slice(-length);
        spl = [rem, ...ret];
    }
    return spl;
}

class Scope {
    constructor (namespace, actions, negations) {
        this.namespace = namespace;
        this.actions = actions;
        this.negations = negations;
    }
}

const _normalize = (scope) => {
    let negations = null;
    let parts;

    if (scope.includes('::')) {
        parts = _rsplit(scope, "::", 1);

        if (parts.length === 2) {
            negations = parts[1].split(':').filter(x => x);
            if (negations.length === 0) {
                negations = null;
            }
        }

        parts = parts[0].split(':');
    } else {
        parts = scope.split(':');
    }

    return new Scope(parts[0], parts.slice(1), negations);
}

const _destructure = (scopes) => {
    // Take input of either a space delimited string, or a list-like object and
    // return a list of scopes.

    // TODO:
    // - better type checking
    if (typeof scopes === 'string') {
        scopes = scopes.split(' ');
    } else if (typeof scopes === 'object' && Array.isArray(scopes)) {
        scopes = scopes;
    } else {
        throw "Your scopes should either be a string or list-like object";
    }
    // return scopes.filter(x => x);
    return scopes;
}


export {_normalize, _destructure};
