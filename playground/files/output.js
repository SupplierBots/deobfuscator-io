const l = [
    'Bw9Yzg8=',
    'WOiDW7pcSq==',
    'log',
    'siema\x20byku',
    'WRbkW6BcUCo9W4RdS8kOWOPDWPLSWPFcOCkMbItcGCo0WQrpW6u/WQlcH8k9W7apWOP4ESof',
    'D2xfUG==',
    'W5DinhG4uW==',
    'Cg9SAwnQyq==',
    'wrTU',
    'AMfNBYbKEMLHBMTP',
    'Hello\x20World!',
    'Bg9N',
    'siema\x20eniu'
];
(function (J, c) {
    const b = function (Q) {
        while (--Q) {
            J['push'](J['shift']());
        }
    };
    b(++c);
}(l, 0x71));
const J = function (c, b) {
    c = c - 0x0;
    let Q = l[c];
    if (J['gPwCtg'] === undefined) {
        var N = function (A) {
            const p = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
            const K = String(A)['replace'](/=+$/, '');
            let X = '';
            for (let W = 0x0, m, F, I = 0x0; F = K['charAt'](I++); ~F && (m = W % 0x4 ? m * 0x40 + F : F, W++ % 0x4) ? X += String['fromCharCode'](0xff & m >> (-0x2 * W & 0x6)) : 0x0) {
                F = p['indexOf'](F);
            }
            return X;
        };
        J['snrZYC'] = function (A) {
            const p = N(A);
            let K = [];
            for (let X = 0x0, W = p['length']; X < W; X++) {
                K += '%' + ('00' + p['charCodeAt'](X)['toString'](0x10))['slice'](-0x2);
            }
            return decodeURIComponent(K);
        };
        J['HBhBoK'] = {};
        J['gPwCtg'] = !![];
    }
    const d = J['HBhBoK'][c];
    if (d === undefined) {
        Q = J['snrZYC'](Q);
        J['HBhBoK'][c] = Q;
    } else {
        Q = d;
    }
    return Q;
};
const c = function (J, b) {
    J = J - 0x0;
    let Q = l[J];
    if (c['bAtUbF'] === undefined) {
        var N = function (p) {
            const K = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
            const X = String(p)['replace'](/=+$/, '');
            let W = '';
            for (let m = 0x0, F, I, B = 0x0; I = X['charAt'](B++); ~I && (F = m % 0x4 ? F * 0x40 + I : I, m++ % 0x4) ? W += String['fromCharCode'](0xff & F >> (-0x2 * m & 0x6)) : 0x0) {
                I = K['indexOf'](I);
            }
            return W;
        };
        const A = function (p, K) {
            let X = [], W = 0x0, m, F = '', I = '';
            p = N(p);
            for (let Y = 0x0, u = p['length']; Y < u; Y++) {
                I += '%' + ('00' + p['charCodeAt'](Y)['toString'](0x10))['slice'](-0x2);
            }
            p = decodeURIComponent(I);
            let B;
            for (B = 0x0; B < 0x100; B++) {
                X[B] = B;
            }
            for (B = 0x0; B < 0x100; B++) {
                W = (W + X[B] + K['charCodeAt'](B % K['length'])) % 0x100;
                m = X[B];
                X[B] = X[W];
                X[W] = m;
            }
            B = 0x0;
            W = 0x0;
            for (let G = 0x0; G < p['length']; G++) {
                B = (B + 0x1) % 0x100;
                W = (W + X[B]) % 0x100;
                m = X[B];
                X[B] = X[W];
                X[W] = m;
                F += String['fromCharCode'](p['charCodeAt'](G) ^ X[(X[B] + X[W]) % 0x100]);
            }
            return F;
        };
        c['PYBseu'] = A;
        c['HIAkjl'] = {};
        c['bAtUbF'] = !![];
    }
    const d = c['HIAkjl'][J];
    if (d === undefined) {
        if (c['QgJlxF'] === undefined) {
            c['QgJlxF'] = !![];
        }
        Q = c['PYBseu'](Q, b);
        c['HIAkjl'][J] = Q;
    } else {
        Q = d;
    }
    return Q;
};
const b = function (J, c) {
    J = J - 0x0;
    let Q = l[J];
    return Q;
};
const B = c;
const Y = c;
const O = c;
const I = J;
const u = J;
const G = J;
function hi() {
    const p = b;
    const A = J;
    console[A('0x2')](p('0x1'));
    function N() {
        const X = p;
        const K = A;
        console[K('0x2')](X('0x3'));
        (() => {
            const m = X;
            const F = X;
            const W = K;
            const d = 0x859 + 0x3;
            console[W('0x2')](d);
            console[m('0x6')](F('0x7'));
        })();
    }
    N();
}
console[I('0x2')](B('0x8', 'RE#k'));
hi();
const Q = {};
Q[Y('0x5', 'RE#k')] = 0x64;
Q[u('0x4')] = u('0x9');
Q[u('0xb')] = 0x3de + 0x7;
Q[u('0x0')] = Y('0xa', 'PAKL');
const trapper = Q;
console[Y('0xc', 'RK3S')](trapper);