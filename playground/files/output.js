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
    if (J['bRwajc'] === undefined) {
        var N = function (A) {
            const p = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=', K = String(A)['replace'](/=+$/, '');
            let X = '';
            for (let W = 0x0, m, F, I = 0x0; F = K['charAt'](I++); ~F && (m = W % 0x4 ? m * 0x40 + F : F, W++ % 0x4) ? X += String['fromCharCode'](0xff & m >> (-0x2 * W & 0x6)) : 0x0) {
                F = p['indexOf'](F);
            }
            return X;
        };
        J['WZitBe'] = function (A) {
            const p = N(A);
            let K = [];
            for (let X = 0x0, W = p['length']; X < W; X++) {
                K += '%' + ('00' + p['charCodeAt'](X)['toString'](0x10))['slice'](-0x2);
            }
            return decodeURIComponent(K);
        }, J['djHRqG'] = {}, J['bRwajc'] = !![];
    }
    const d = J['djHRqG'][c];
    return d === undefined ? (Q = J['WZitBe'](Q), J['djHRqG'][c] = Q) : Q = d, Q;
};
const c = function (J, b) {
    J = J - 0x0;
    let Q = l[J];
    if (c['ZJotED'] === undefined) {
        var N = function (p) {
            const K = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=', X = String(p)['replace'](/=+$/, '');
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
                W = (W + X[B] + K['charCodeAt'](B % K['length'])) % 0x100, m = X[B], X[B] = X[W], X[W] = m;
            }
            B = 0x0, W = 0x0;
            for (let G = 0x0; G < p['length']; G++) {
                B = (B + 0x1) % 0x100, W = (W + X[B]) % 0x100, m = X[B], X[B] = X[W], X[W] = m, F += String['fromCharCode'](p['charCodeAt'](G) ^ X[(X[B] + X[W]) % 0x100]);
            }
            return F;
        };
        c['wlkEak'] = A, c['AvfQAo'] = {}, c['ZJotED'] = !![];
    }
    const d = c['AvfQAo'][J];
    return d === undefined ? (c['LJJCst'] === undefined && (c['LJJCst'] = !![]), Q = c['wlkEak'](Q, b), c['AvfQAo'][J] = Q) : Q = d, Q;
};
const b = function (J, c) {
    J = J - 0x0;
    let Q = l[J];
    return Q;
};
const B = function (N, d) {
        return c(N - '0x100', d);
    }, Y = function (N, d) {
        return c(N - '0x100', d);
    }, O = function (N, d) {
        return c(N - '0x100', d);
    }, I = function (N, d) {
        return J(N - '0x100', d);
    }, u = function (N, d) {
        return J(N - '0x100', d);
    }, G = function (N, d) {
        return J(N - '0x100', d);
    };
function hi() {
    const p = function (N, d) {
            return b(N - '0x1da', d);
        }, A = function (N, d) {
            return J(N - '0x1da', d);
        };
    console[A('0x1dc')](p('0x1db'));
    function N() {
        const X = function (N, d) {
                return p(N - -'0x1c8', d);
            }, K = function (N, d) {
                return A(N - -'0x1c8', d);
            };
        console[K('0x14')](X('0x15')), (() => {
            const m = function (N, d) {
                    return X(N - '0x30d', d);
                }, F = function (N, d) {
                    return X(N - '0x30d', d);
                }, W = function (N, d) {
                    return K(N - '0x30d', d);
                }, d = 0x859 + 0x3;
            console[W('0x321')](d), console[m('0x325')](m('0x326'));
        })();
    }
    N();
}
console[I('0x102')](B('0x108', 'RE#k')), hi();
const Q = {};
Q[B('0x105', 'RE#k')] = 0x64, Q[I('0x104')] = I('0x109'), Q[u('0x10b')] = 0x3de + 0x7, Q[G('0x100')] = O('0x10a', 'PAKL');
const trapper = Q;
console[Y('0x10c', 'RK3S')](trapper);