const W = [
    'log',
    'ohlcIa==',
    'ASocpSoeB8ojeY9KFq3cLG==',
    'C2LLBweGzw5PDq==',
    'DWKz',
    'rCoisa==',
    'C2LLBweGyNLRDq==',
    'qsb0BYbQzxn0ihbPzxj3C3P5ignHBgWGDYbqB2XZy2u='
];
(function (e, p) {
    const d = function (E) {
        while (--E) {
            e['push'](e['shift']());
        }
    };
    d(++p);
}(W, 0x1b8));
const e = function (p, d) {
    p = p - 0x0;
    let E = W[p];
    if (e['ubiCFy'] === undefined) {
        var k = function (i) {
            const B = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
            const g = String(i)['replace'](/=+$/, '');
            let u = '';
            for (let m = 0x0, R, w, C = 0x0; w = g['charAt'](C++); ~w && (R = m % 0x4 ? R * 0x40 + w : w, m++ % 0x4) ? u += String['fromCharCode'](0xff & R >> (-0x2 * m & 0x6)) : 0x0) {
                w = B['indexOf'](w);
            }
            return u;
        };
        e['sbBHgs'] = function (B) {
            const g = k(B);
            let u = [];
            for (let m = 0x0, R = g['length']; m < R; m++) {
                u += '%' + ('00' + g['charCodeAt'](m)['toString'](0x10))['slice'](-0x2);
            }
            return decodeURIComponent(u);
        };
        e['pdNecs'] = {};
        e['ubiCFy'] = !![];
    }
    const t = e['pdNecs'][p];
    if (t === undefined) {
        E = e['sbBHgs'](E);
        e['pdNecs'][p] = E;
    } else {
        E = t;
    }
    return E;
};
const p = function (e, d) {
    e = e - 0x0;
    let E = W[e];
    if (p['PdWSes'] === undefined) {
        var k = function (B) {
            const g = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
            const u = String(B)['replace'](/=+$/, '');
            let m = '';
            for (let R = 0x0, w, C, X = 0x0; C = u['charAt'](X++); ~C && (w = R % 0x4 ? w * 0x40 + C : C, R++ % 0x4) ? m += String['fromCharCode'](0xff & w >> (-0x2 * R & 0x6)) : 0x0) {
                C = g['indexOf'](C);
            }
            return m;
        };
        const i = function (B, g) {
            let u = [], m = 0x0, R, w = '', C = '';
            B = k(B);
            for (let N = 0x0, P = B['length']; N < P; N++) {
                C += '%' + ('00' + B['charCodeAt'](N)['toString'](0x10))['slice'](-0x2);
            }
            B = decodeURIComponent(C);
            let X;
            for (X = 0x0; X < 0x100; X++) {
                u[X] = X;
            }
            for (X = 0x0; X < 0x100; X++) {
                m = (m + u[X] + g['charCodeAt'](X % g['length'])) % 0x100;
                R = u[X];
                u[X] = u[m];
                u[m] = R;
            }
            X = 0x0;
            m = 0x0;
            for (let G = 0x0; G < B['length']; G++) {
                X = (X + 0x1) % 0x100;
                m = (m + u[X]) % 0x100;
                R = u[X];
                u[X] = u[m];
                u[m] = R;
                w += String['fromCharCode'](B['charCodeAt'](G) ^ u[(u[X] + u[m]) % 0x100]);
            }
            return w;
        };
        p['ViljWL'] = i;
        p['rWykmU'] = {};
        p['PdWSes'] = !![];
    }
    const t = p['rWykmU'][e];
    if (t === undefined) {
        if (p['vaBTiL'] === undefined) {
            p['vaBTiL'] = !![];
        }
        E = p['ViljWL'](E, d);
        p['rWykmU'][e] = E;
    } else {
        E = t;
    }
    return E;
};
const d = function (e, p) {
    e = e - 0x0;
    let E = W[e];
    return E;
};
const C = e;
const w = p;
function hi() {
    const t = p;
    const i = p;
    console[t('0x4', 'K[sC')](i('0x2', 'R@Ow'));
    function E() {
        const g = e;
        const B = d;
        console[B('0x0')](g('0x3'));
        (() => {
            const R = g;
            const m = B;
            const u = p;
            const k = 0x859 + 0x3;
            console[u('0x5', 'dC0q')](k);
            console[m('0x0')](R('0x6'));
        })();
    }
    E();
}
console[w('0x1', 'dvPb')](C('0x7'));
hi();