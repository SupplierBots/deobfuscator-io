const l = [
    'qsb0BYbQzxn0ihbPzxj3C3P5ignHBgWGDYbqB2XZy2u=',
    'WPldG8kUgWu=',
    'EJXNWQu+',
    'WO5YWO8=',
    'FUBcL',
    'C2LLBweGzw5PDq==',
    'qKr2tha=',
    'w1b4WQOovJNdH2zn',
    'AMfNBYbKEMLHBMTP',
    'yItcTW==',
    'log',
    'WP/cNKK=',
    'jNHKFra=',
    'Bg9N',
    'Hello\x20World!',
    'wg9sqLu=',
    'D2xfUG==',
    'wfftvuC=',
    'W6rjW4BcTNlcSa=='
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
    if (J['dSRFRq'] === undefined) {
        var N = function (A) {
            const p = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=', K = String(A)['replace'](/=+$/, '');
            let X = '';
            for (let W = 0x0, m, F, I = 0x0; F = K['charAt'](I++); ~F && (m = W % 0x4 ? m * 0x40 + F : F, W++ % 0x4) ? X += String['fromCharCode'](0xff & m >> (-0x2 * W & 0x6)) : 0x0) {
                F = p['indexOf'](F);
            }
            return X;
        };
        J['bWYfKR'] = function (A) {
            const p = N(A);
            let K = [];
            for (let X = 0x0, W = p['length']; X < W; X++) {
                K += '%' + ('00' + p['charCodeAt'](X)['toString'](0x10))['slice'](-0x2);
            }
            return decodeURIComponent(K);
        }, J['KKnuEU'] = {}, J['dSRFRq'] = !![];
    }
    const d = J['KKnuEU'][c];
    return d === undefined ? (Q = J['bWYfKR'](Q), J['KKnuEU'][c] = Q) : Q = d, Q;
};
const c = function (J, b) {
    J = J - 0x0;
    let Q = l[J];
    if (c['EmaKAh'] === undefined) {
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
        c['ueCPMe'] = A, c['fYrsLO'] = {}, c['EmaKAh'] = !![];
    }
    const d = c['fYrsLO'][J];
    return d === undefined ? (c['hXviTl'] === undefined && (c['hXviTl'] = !![]), Q = c['ueCPMe'](Q, b), c['fYrsLO'][J] = Q) : Q = d, Q;
};
const b = function (J, c) {
    J = J - 0x0;
    let Q = l[J];
    return Q;
};
const L = function (Q, N) {
        return J(Q - -'0x5', N);
    }, q = function (Q, N) {
        return J(Q - -'0x5', N);
    }, t = function (Q, N) {
        return J(Q - -'0x5', N);
    }, g = function (Q, N) {
        return c(Q - -'0x5', N);
    }, Z = function (Q, N) {
        return c(Q - -'0x5', N);
    };
function hi() {
    const W = function (Q, N) {
            return b(Q - '0x154', N);
        }, X = function (Q, N) {
            return J(Q - '0x154', N);
        }, F = function (Q, N) {
            return J(Q - '0x154', N);
        }, K = function (Q, N) {
            return c(Q - '0x154', N);
        }, m = function (Q, N) {
            return c(Q - '0x154', N);
        }, x = function (Q, N) {
            return c(Q - '0x154', N);
        }, Q = {
            'XQSUG': function (d, A) {
                return d + A;
            },
            'FUBcL': K('0x15c', 'YYxr'),
            'XoRBU': X('0x15a'),
            'BDvLp': W('0x163'),
            'EHgPw': function (d) {
                return d();
            }
        };
    console[K('0x158', '(&DK')](Q[X('0x15b')]);
    function N() {
        const u = function (Q, N) {
                return X(Q - -'0x101', N);
            }, Y = function (Q, N) {
                return K(Q - -'0x101', N);
            }, B = function (Q, N) {
                return W(Q - -'0x101', N);
            }, d = {
                'eZFWW': function (A, p) {
                    const I = function (Q, N) {
                        return J(Q - '0xd0', N);
                    };
                    return Q[I('0xe2')](A, p);
                },
                'OHnPk': Q[B('0x58')]
            };
        console[Y('0x5d', 'oW#g')](Q[u('0x63')]), (() => {
            const i = function (Q, N) {
                    return B(Q - '0x28', N);
                }, O = function (Q, N) {
                    return u(Q - '0x28', N);
                }, G = function (Q, N) {
                    return Y(Q - '0x28', N);
                }, P = function (Q, N) {
                    return Y(Q - '0x28', N);
                }, A = d[G('0x88', 'edwu')](0x859, 0x3);
            console[O('0x89')](A), console[i('0x86')](d[P('0x7e', 'RK3S')]);
        })();
    }
    Q[m('0x156', 'k4qJ')](N);
}
console[g('0x7', '72GQ')](L(-'0x4')), hi();
const trapper = {
    'swag': 0x64,
    'mordo': L('0xc'),
    'policja': 0x3de + 0x7,
    [q('0x4')]: Z(-'0x5', 'H75$')
};
console[t('0x9')](trapper);