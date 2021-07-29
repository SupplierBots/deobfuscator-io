const w = [
    'u8kzWP3cJ8oUW4GFWQ15cq==',
    'Bg9N',
    'q1iE',
    'C2LLBweGyNLRDq==',
    'sgvSBg8Gv29YBgqH',
    'WPaXW5e='
];
(function (r, x) {
    const Z = function (n) {
        while (--n) {
            r['push'](r['shift']());
        }
    };
    Z(++x);
}(w, 0x1a1));
const r = function (x, Z) {
    x = x - 0x0;
    let n = w[x];
    if (r['UxECyu'] === undefined) {
        var L = function (c) {
            const G = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
            const D = String(c)['replace'](/=+$/, '');
            let H = '';
            for (let B = 0x0, A, N, h = 0x0; N = D['charAt'](h++); ~N && (A = B % 0x4 ? A * 0x40 + N : N, B++ % 0x4) ? H += String['fromCharCode'](0xff & A >> (-0x2 * B & 0x6)) : 0x0) {
                N = G['indexOf'](N);
            }
            return H;
        };
        r['xQnPZW'] = function (c) {
            const G = L(c);
            let D = [];
            for (let H = 0x0, B = G['length']; H < B; H++) {
                D += '%' + ('00' + G['charCodeAt'](H)['toString'](0x10))['slice'](-0x2);
            }
            return decodeURIComponent(D);
        };
        r['kKhpUL'] = {};
        r['UxECyu'] = !![];
    }
    const g = r['kKhpUL'][x];
    if (g === undefined) {
        n = r['xQnPZW'](n);
        r['kKhpUL'][x] = n;
    } else {
        n = g;
    }
    return n;
};
const x = function (r, Z) {
    r = r - 0x0;
    let n = w[r];
    if (x['oxeyRr'] === undefined) {
        var L = function (G) {
            const D = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
            const H = String(G)['replace'](/=+$/, '');
            let B = '';
            for (let A = 0x0, N, h, E = 0x0; h = H['charAt'](E++); ~h && (N = A % 0x4 ? N * 0x40 + h : h, A++ % 0x4) ? B += String['fromCharCode'](0xff & N >> (-0x2 * A & 0x6)) : 0x0) {
                h = D['indexOf'](h);
            }
            return B;
        };
        const c = function (G, D) {
            let H = [], B = 0x0, A, N = '', h = '';
            G = L(G);
            for (let q = 0x0, R = G['length']; q < R; q++) {
                h += '%' + ('00' + G['charCodeAt'](q)['toString'](0x10))['slice'](-0x2);
            }
            G = decodeURIComponent(h);
            let E;
            for (E = 0x0; E < 0x100; E++) {
                H[E] = E;
            }
            for (E = 0x0; E < 0x100; E++) {
                B = (B + H[E] + D['charCodeAt'](E % D['length'])) % 0x100;
                A = H[E];
                H[E] = H[B];
                H[B] = A;
            }
            E = 0x0;
            B = 0x0;
            for (let I = 0x0; I < G['length']; I++) {
                E = (E + 0x1) % 0x100;
                B = (B + H[E]) % 0x100;
                A = H[E];
                H[E] = H[B];
                H[B] = A;
                N += String['fromCharCode'](G['charCodeAt'](I) ^ H[(H[E] + H[B]) % 0x100]);
            }
            return N;
        };
        x['HoshMb'] = c;
        x['SNYYwR'] = {};
        x['oxeyRr'] = !![];
    }
    const g = x['SNYYwR'][r];
    if (g === undefined) {
        if (x['MeMRkc'] === undefined) {
            x['MeMRkc'] = !![];
        }
        n = x['HoshMb'](n, Z);
        x['SNYYwR'][r] = n;
    } else {
        n = g;
    }
    return n;
};
const Z = function (r, x) {
    r = r - 0x0;
    let n = w[r];
    return n;
};
function hi() {
    const c = r;
    const g = x;
    console[g('0x5', 'jOZD')](c('0x1'));
    function n() {
        const G = g;
        const D = g;
        console[G('0x2', 'E^f1')](G('0x3', 'rv4B'));
        (() => {
            const H = r;
            const B = r;
            const A = r;
            const L = 0x859 + 0x3;
            console[H('0x4')](L);
            console[B('0x4')](A('0x0'));
        })();
    }
    n();
}
hi();