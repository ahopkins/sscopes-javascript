import { expect } from 'chai';
import {_normalize} from '../src/utils';

describe('Negation normalizing', () => {
    it('Make sure negation normalizes properly', () => {
        const scope = "user:read:write::delete";
        const normalized = _normalize(scope);

        expect(normalized.namespace).to.be.equal('user')
        expect(normalized.actions.length).to.be.equal(2)
        expect(normalized.negations.length).to.be.equal(1)
    });
});
