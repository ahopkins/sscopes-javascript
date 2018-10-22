import {_normalize, _destructure} from './utils';

const GLOBAL_NS = 'global';

const _validateNamespace = (baseNamespace, inboundNamespace) => {
    baseNamespace = baseNamespace.trim();
    const isGlobal = (baseNamespace && baseNamespace !== GLOBAL_NS) ? false : true;
    return isGlobal || baseNamespace === inboundNamespace;
};

const _validateActions = (baseActions, inboundActions, requireAllActions) => {
    let validActions;

    if (baseActions && baseActions.length > 0) {
        if (   inboundActions.length === 0
            || (baseActions.length === 1 && baseActions[0] === '')
        ) {
            validActions = true;
        } else {
            validActions = requireAllActions
                ? baseActions.every(x => inboundActions.includes(x))
                : baseActions.some(x => inboundActions.includes(x));
        }
    } else {
        validActions = inboundActions.length === 0;
    }
    return validActions;
};

const _validateNegations = (baseNegations, inboundActions) => {
    if (baseNegations) {
        return baseNegations.every(x => !inboundActions.includes(x));
    }
    return true;
};

// TODO:
// - Implement caching
const _validateSingleScope = (base, inbounds, requireAllActions, override) => {
    // Before beginning validaition, return as invalid if inbound is None
    // or is a list containing only None values
    // or if the base is None

    let isValid = false;
    let doValidation = true;
    if (!base || inbounds.length === 0 || (inbounds.filter(x => x === null).length === inbounds.length)) {
        doValidation = false;
    }

    base = _normalize(base);
    inbounds = inbounds.map(_normalize);

    if (!base.namespace && (!base.actions || base.actions.length === 0) && !base.negations) {
        doValidation = false;
    }

    if (doValidation) {
        isValid = inbounds.some(inbound => {
            const validNamespace = _validateNamespace(base.namespace, inbound.namespace);
            const validActions = _validateActions(base.actions, inbound.actions, requireAllActions);
            const validNegations = _validateNegations(base.negations, inbound.actions);
            // console.log(validNamespace, validActions, validNegations);
            return validNamespace && validActions && validNegations;
        });
    }

    const outcome = override
                  ? override(isValid, base, inbounds, requireAllActions)
                  : isValid;

    if (typeof outcome !== 'boolean') {
        throw "Validation did not produce boolean";
    }

    return outcome;
}

export default function (bases, inbounds, requireAll=true, requireAllActions=true, override=null) {
    // TODO:
    // - Check for :::: in all scopes
    // - Check for :: in inbound scopes

    bases = _destructure(bases)
    inbounds = _destructure(inbounds).filter(x => x)

    return requireAll
        ? bases.every(x => _validateSingleScope(x, inbounds, requireAllActions, override))
        : bases.some(x => _validateSingleScope(x, inbounds, requireAllActions, override));
}
