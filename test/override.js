import { expect } from 'chai';
import validate from '../src/validators';

describe('Override', () => {
    it('Outcome to always to be true', () => {
        const alwaysTrue = () => true;
        expect(validate("::", "foo", true, true, alwaysTrue)).to.be.equal(true);
    });

    it('Arguments', () => {
        const checkArgs = (isValid, base, inbounds, requireAllActions) => {
            const inbound = inbounds[0];

            return inbounds.length === 1
                && isValid === false
                && !base.namespace && base.actions.length === 0 && !base.negations
                inbound.namespace === "foo" && inbound.actions.length === 0 && !inbound.negations
                && requireAllActions === false
        };

        expect(validate("::", "foo", true, false, checkArgs)).to.be.equal(true);
    });

    it('Bad type', () => {
        const base = '::';
        const inbound = 'foo';

        expect(validate(base, inbound)).to.be.equal(false);

        const oops = () => "foobar";
        const alwaysFalse = () => false;
        const alwaysTrue = () => true;

        expect(validate(base, inbound, true, true, alwaysFalse)).to.be.equal(false);
        expect(validate(base, inbound, true, true, alwaysTrue)).to.be.equal(true);
        expect(validate.bind(base, inbound, true, true, oops)).to.throw();
    });
});
