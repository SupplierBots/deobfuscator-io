const E = [
    'Bg9N',
    'sgvSBg8Gv29YBgqH',
    'EYNcG8kyuSkxivlcPYu='
];
const b = function (n, s) {
    n = n - (0x704 + 0x2 * -0x78e + 0x818);
    let l = E[n];
    if (b['DnFhLp'] === undefined) {
        var o = function (p) {
            const v = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
            const S = String(p)['replace'](/=+$/, '');
            let T = '';
            for (let f = -0x23cf * 0x1 + 0x2509 + -0x9d * 0x2, u, F, m = -0x8c5 * 0x1 + -0x12cd + 0x1b92; F = S['charAt'](m++); ~F && (u = f % (-0xb3f + -0x37 * 0x3 + -0xbe8 * -0x1) ? u * (0x1d * 0x51 + 0x1247 + -0x1b34) + F : F, f++ % (-0x1cc8 + -0xf97 + -0x1 * -0x2c63)) ? T += String['fromCharCode'](0xb7 * 0x9 + 0x1449 + -0x19b9 & u >> (-(-0xee1 + -0x3 * 0x91d + 0x2a3a) * f & -0x1 * 0x159 + 0x1658 + -0x14f9)) : 0x83e + 0x1 * 0x7cf + -0x100d) {
                F = v['indexOf'](F);
            }
            return T;
        };
        b['rrxmBo'] = function (p) {
            const v = o(p);
            let S = [];
            for (let T = 0x13f + 0x1865 + 0x88c * -0x3, f = v['length']; T < f; T++) {
                S += '%' + ('00' + v['charCodeAt'](T)['toString'](0x1 * 0x17be + -0x101 * 0x21 + 0x29 * 0x3b))['slice'](-(0x1af9 + -0x17 * 0x7c + -0x1 * 0xfd3));
            }
            return decodeURIComponent(S);
        };
        b['GPaPEQ'] = {};
        b['DnFhLp'] = !![];
    }
    const D = b['GPaPEQ'][n];
    if (D === undefined) {
        l = b['rrxmBo'](l);
        b['GPaPEQ'][n] = l;
    } else {
        l = D;
    }
    return l;
};
const n = function (b, s) {
    b = b - (0x704 + 0x2 * -0x78e + 0x818);
    let l = E[b];
    if (n['QDeQDL'] === undefined) {
        var o = function (v) {
            const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
            const T = String(v)['replace'](/=+$/, '');
            let f = '';
            for (let u = -0x23cf * 0x1 + 0x2509 + -0x9d * 0x2, F, m, H = -0x8c5 * 0x1 + -0x12cd + 0x1b92; m = T['charAt'](H++); ~m && (F = u % (-0xb3f + -0x37 * 0x3 + -0xbe8 * -0x1) ? F * (0x1d * 0x51 + 0x1247 + -0x1b34) + m : m, u++ % (-0x1cc8 + -0xf97 + -0x1 * -0x2c63)) ? f += String['fromCharCode'](0xb7 * 0x9 + 0x1449 + -0x19b9 & F >> (-(-0xee1 + -0x3 * 0x91d + 0x2a3a) * u & -0x1 * 0x159 + 0x1658 + -0x14f9)) : 0x83e + 0x1 * 0x7cf + -0x100d) {
                m = S['indexOf'](m);
            }
            return f;
        };
        const p = function (v, S) {
            let T = [], f = 0x13f + 0x1865 + 0x88c * -0x3, u, F = '', m = '';
            v = o(v);
            for (let Z = 0x1 * 0x17be + -0x101 * 0x21 + 0x1b * 0x59, q = v['length']; Z < q; Z++) {
                m += '%' + ('00' + v['charCodeAt'](Z)['toString'](0x1af9 + -0x17 * 0x7c + -0x1 * 0xfc5))['slice'](-(-0x1863 * -0x1 + -0x1653 + 0x1 * -0x20e));
            }
            v = decodeURIComponent(m);
            let H;
            for (H = 0x4 * -0x605 + -0xd3 * 0x2b + 0x1 * 0x3b85; H < -0x20f5 + 0x53 * -0x29 + -0x1c * -0x1b0; H++) {
                T[H] = H;
            }
            for (H = -0x106e + 0x2 * -0x1253 + 0x3514; H < -0x34c * -0xb + 0x238b + 0x46cf * -0x1; H++) {
                f = (f + T[H] + S['charCodeAt'](H % S['length'])) % (0x2 * 0x2c5 + 0x2d + 0x11 * -0x47);
                u = T[H];
                T[H] = T[f];
                T[f] = u;
            }
            H = 0x5 * 0x64f + -0x2213 + 0x288;
            f = -0xff1 + 0x1c * 0x85 + 0x165;
            for (let c = 0x1e80 + 0xcd * -0x1d + -0x1 * 0x747; c < v['length']; c++) {
                H = (H + (0x1 * -0x2308 + 0x1 * -0x26b3 + -0x5ac * -0xd)) % (-0x3 * -0xb03 + -0xc3 * 0x15 + 0x805 * -0x2);
                f = (f + T[H]) % (-0xb3 * -0x7 + -0x1e * 0xa6 + 0xf8f);
                u = T[H];
                T[H] = T[f];
                T[f] = u;
                F += String['fromCharCode'](v['charCodeAt'](c) ^ T[(T[H] + T[f]) % (-0xc92 + -0x17 * 0x25 + 0xad * 0x19)]);
            }
            return F;
        };
        n['SMRGQj'] = p;
        n['JsOojB'] = {};
        n['QDeQDL'] = !![];
    }
    const D = n['JsOojB'][b];
    if (D === undefined) {
        if (n['qIbrYb'] === undefined) {
            n['qIbrYb'] = !![];
        }
        l = n['SMRGQj'](l, s);
        n['JsOojB'][b] = l;
    } else {
        l = D;
    }
    return l;
};
const s = function (b, n) {
    b = b - (0x704 + 0x2 * -0x78e + 0x818);
    let l = E[b];
    return l;
};
function hi() {
    const D = function (l, o) {
        return b(l - '0x12c', o);
    };
    const p = function (l, o) {
        return b(l - '0x12c', o);
    };
    console[D('0x12c')](p('0x12d'));
    function l() {
        const S = function (l, o) {
            return n(l - '0x300', o);
        };
        const v = function (l, o) {
            return p(l - '0x1d4', o);
        };
        console[v('0x300')](S('0x302', 'yTuJ'));
        (() => {
            const T = function (l, o) {
                return v(l - -'0x2f0', o);
            };
            const o = 0x704 + 0x2 * -0x78e + 0x1071 + (-0x23cf * 0x1 + 0x2509 + -0x137 * 0x1);
            console[T('0x10')](o);
        })();
    }
    l();
}
hi();