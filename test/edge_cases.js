import { expect } from 'chai';
import validate from '../src/validators';

const _runTest = (base, inbound, outcome=true) => {
    it(`Testing bases='${base}' inbounds='${inbound}' outcome='${outcome}'`, () => {
        expect(validate(base, inbound)).to.be.equal(outcome);
    });
};

const _runTestError = (base, inbound) => {
    it(`Testing bases='${base}' inbounds='${inbound}' outcome='ERROR'`, () => {
        expect(validate.bind(base, inbound)).to.throw();
    });
};

describe('Scope types', () => {
    let base;
    let inbound;
    let outcome;

    describe('array', () => {
        base = ["foo", "bar"];
        inbound = "foo";
        _runTest(base, inbound, false);

        inbound = "foo bar";
        _runTest(base, inbound);

        inbound = ["foo", "bar"];
        _runTest(base, inbound);
    });

    describe('object', () => {
        base = {"foo": "bar"};
        inbound = "foo";
        _runTestError(base, inbound);
    });

    describe('null', () => {
        describe('input', () => {
            base = "foo";
            inbound = [];
            _runTest(base, inbound, false);

            inbound = [null, null];
            _runTest(base, inbound, false);

            inbound = [null, "foo"];
            _runTest(base, inbound);
        });
        describe('scope', () => {
            base = null;
            inbound = "bar";
            _runTestError(base, inbound);

            base = "foo";
            inbound = null;
            _runTestError(base, inbound);
        });
    });
});

describe('Negation mistakes', () => {
    let base;
    let inbound;

    describe('inbound', () => {
        base = "foo";
        inbound = "::bar";
        _runTestError(base, inbound);
    });

    describe('overzealous', () => {
        base = "foo::::bar";
        inbound = "bar";
        _runTestError(base, inbound);
    });

    describe('without specific action', () => {
        base = "foo::bar";
        inbound = "foo";
        _runTest(base, inbound);
    });
});
