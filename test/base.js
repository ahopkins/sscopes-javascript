import { expect } from 'chai';
import validate from '../src/validators';

const _doTest = (testCases, requireAll=true, requireAllActions=true) => {
    testCases.forEach((testCase) => {
        const [bases, inbounds, outcome] = testCase;
        it(`Testing bases='${bases}' inbounds='${inbounds}' outcome='${outcome}'`, () => {
            expect(validate(bases, inbounds, requireAll, requireAllActions)).to.be.equal(outcome);
        });
    });
}

describe('Simple', () => {
    describe('Single scopes', () => {
        describe('Global namespace', () => {
            const cases = [
                ["user", "something", false],
                ["user", "user", true],
                ["user", "user:read", false],
                ["user:read", "user", true],
                ["user:read", "user:read", true],
                ["user:read", "user:write", false],
                ["user:read", "user:read:write", true],
                ["user:read:write", "user:read", false],
                ["user:read:write", "user:read:write", true],
                ["user:read:write", "user:write:read", true],
                ["user:", "user", true],
                ["user:", "user:read", true],
            ];
            _doTest(cases);
        });

        describe('Specific namespace', () => {
            const cases = [
                [":", ":read", true],
                [":", "admin", true],
                [":read", "admin", true],
                [":read", ":read", true],
                [":read", ":write", false],
                ["global:", ":read", true],
                ["global:", "admin", true],
                ["global:read", "admin", true],
                ["global:read", ":read", true],
                ["global:read", ":write", false],
                ["global", ":read", false],
                ["global", "admin", true],
                ["user:write", "global:write", false],
                ["user:write", ":write", false],
                ["admin", "global", false],
            ];
            _doTest(cases);
        });
    });

    describe('Multiple scopes', () => {
        const cases = [
            ["user", "something else", false],
            ["user", "something else user", true],
            ["user:read", "something:else user:read", true],
            ["user:read", "user:read something:else", true],
            ["user foo", "user", false],
            ["user foo", "user foo", true],
            ["user foo", "foo user", true],
            ["user:read foo", "user foo", true],
            ["user:read foo", "user foo:read", false],
            ["user:read foo", "user:read foo", true],
            ["user:read foo:bar", ":read :bar", false],
            ["user:read foo:bar", "user:read foo", true],
            ["user:read foo:bar", "user foo", true],
            ["user foo", "user", false],
        ];
        _doTest(cases);
    });
});

describe('Complex scopes', () => {
    const cases = [
        ["::delete", "user", true],
        ["::delete", "user:read", false],
        ["::delete", "user:delete", false],
        ["::delete", "user:read:delete", false],
        [":::delete", "user", true],
        [":::delete", "user:read", true],
        [":::delete", "user:delete", false],
        [":::delete", "user:read:delete", false],
        ["user::delete", "user", true],
        ["user::delete", "user:read", false],
        ["user::delete", "user:delete", false],
        ["user::delete", "user:read:delete", false],
        ["user:::delete", "user", true],
        ["user:::delete", "user:read", true],
        ["user:::delete", "user:delete", false],
        ["user:::delete", "user:read:delete", false],
        ["user:read::delete", "user", true],
        ["user:read::delete", "user:read", true],
        ["user:read::delete", "user:delete", false],
        ["user:read::delete", "user:read:delete", false],
        ["user:read::delete", "user:write", false],
        ["user:read user::delete", "user:read:delete", false],
        ["user:read user::delete", "user:read user:delete", false],
        ["", "user", false],
        ["", ":read", false],
        ["", "user:read", false],
        [" ", "user", false],
        [" ", ":read", false],
        [" ", "user:read", false],
        ["::", "user", false],
        ["::", ":read", false],
        ["::", "user:read", false],
    ];
    _doTest(cases);
});

describe('Not require all ...', () => {
    describe('... scopes', () => {
        const cases = [
            ["user foo", "user", true],
            ["user:read user::delete", "user:read:delete", true],
            ["user:read user::delete", "user:read user:delete", true],
        ];
        _doTest(cases, false);
    });
    describe('... actions', () => {
        const cases = [
            ["user:read:write", "user:read", true],
        ];
        _doTest(cases, true, false);
    });
});
