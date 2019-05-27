function SIDH() {
    
}

/**
 * Method to reset all Round settings
 */
SIDH.generateKeysPair = function() {
    

    let kex = new SidhKeyExchange("sidhP503");
    let fieldInf = new BigInteger ("2b701ec1698bf9a513875fb7188c1d63fbd59ac8a378c3fbb1c98496173f6e", 16);

    let keysA = kex.generateKeyPair (SidhKeyExchange.PARTYB, new SidhPrivateKey (fieldInf));

    return [new BigInteger(keysA.getPrivateKey().serialize()), new BigInteger(keysA.getPublicKey().serialize())];
};
SIDH.generateSharedA = function(privateKey, publicKey) {


    let kex = new SidhKeyExchange("sidhP503");

    let sharedB = kex.calculateAgreementA (new SidhPrivateKey(privateKey.toByteArray()), new SidhPublicKey( publicKey.toByteArray() ));
    return new BigInteger(sharedB);

};
SIDH.generateSharedB = function(privateKey, publicKey) {



    let kex = new SidhKeyExchange("sidhP503");
    let sharedB = kex.calculateAgreementA (new SidhPrivateKey(privateKey.toByteArray()), new SidhPublicKey (publicKey.toByteArray()) );
    return new BigInteger(sharedB);
};



var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var Felm = (function () {
    function Felm(v) {
        var _this = this;
        if (((v != null && v instanceof BigInteger) || v === null)) {
            var __args = arguments;
            if (this.value === undefined)
                this.value = null;
            if (this.value === undefined)
                this.value = null;
            (function () {
                _this.value = v.mod(Felm.p_$LI$());
            })();
        }
        else if (((v != null && v instanceof Felm) || v === null)) {
            var __args = arguments;
            var a_1 = __args[0];
            if (this.value === undefined)
                this.value = null;
            if (this.value === undefined)
                this.value = null;
            (function () {
                _this.value = a_1.fpGetValue();
            })();
        }
        else if (((v != null && v instanceof Array && (v.length == 0 || v[0] == null || (typeof v[0] === 'number'))) || v === null)) {
            var __args = arguments;
            var bytes_1 = __args[0];
            if (this.value === undefined)
                this.value = null;
            if (this.value === undefined)
                this.value = null;
            (function () {
                _this.value = new BigInteger(bytes_1);
            })();
        }
        else if (((v != null && v instanceof SecureRandom) || v === null)) {
            var __args = arguments;
            var rnd = __args[0];
            if (this.value === undefined)
                this.value = null;
            if (this.value === undefined)
                this.value = null;
            (function () {
                _this.value = Felm.genRandom(Felm.p_$LI$());
            })();
        }
        else if (((typeof v === 'number') || v === null)) {
            var __args = arguments;
            if (this.value === undefined)
                this.value = null;
            if (this.value === undefined)
                this.value = null;
            (function () {
                _this.value = new BigInteger(String(v)).mod(Felm.p_$LI$());
            })();
        }
        else
            throw new Error('invalid overload');
    }
    Felm.p_$LI$ = function () { if (Felm.p == null)
        Felm.p = new BigInteger(String(2)); return Felm.p; };
    ;
    Felm.ZERO_$LI$ = function () { if (Felm.ZERO == null)
        Felm.ZERO = new Felm(BigInteger.ZERO); return Felm.ZERO; };
    ;
    Felm.ONE_$LI$ = function () { if (Felm.ONE == null)
        Felm.ONE = new Felm(BigInteger.ONE); return Felm.ONE; };
    ;
    Felm.setPrime = function (pr) {
        if (pr.isProbablePrime(10))
            Felm.p = pr;
        Felm.primesize = ((Felm.p_$LI$().bitLength() / 8 | 0)) + 1;
    };
    Felm.getPrime = function () {
        return Felm.p_$LI$();
    };
    Felm.prototype.fpGetValue = function () {
        return this.value;
    };
    Felm.genRandom = function (bound) {
        var rnd = new SecureRandom();
        var numBits = bound.bitLength();
        var randval = new BigInteger(numBits, rnd);
        while ((randval.compareTo(bound) >= 0)) {
            randval = new BigInteger(numBits, rnd);
        }
        ;
        return randval;
    };
    Felm.prototype.randomize = function () {
        this.value = Felm.genRandom(Felm.p_$LI$());
    };
    Felm.add = function (x, y) {
        var z = new Felm(x);
        z.fpAddInPlace(y);
        return z;
    };
    Felm.prototype.fpAddInPlace = function (y) {
        this.value = this.value.add(y.value);
        this.value = this.value.mod(Felm.p_$LI$());
    };
    Felm.sub = function (x, y) {
        var z = new Felm(x);
        z.fpSubInPlace(y);
        return z;
    };
    Felm.prototype.fpSubInPlace = function (y) {
        this.value = this.value.add(Felm.p_$LI$()).subtract(y.value);
        this.value = this.value.mod(Felm.p_$LI$());
    };
    Felm.mult = function (x, y) {
        var z = new Felm(x);
        z.fpMultInPlace(y);
        return z;
    };
    Felm.prototype.fpMultInPlace = function (y) {
        this.value = this.value.multiply(y.value);
        this.value = this.value.mod(Felm.p_$LI$());
    };
    Felm.sqr = function (x) {
        return Felm.mult(x, x);
    };
    Felm.prototype.fpSqrInPlace = function () {
        this.fpMultInPlace(this);
    };
    Felm.prototype.fpIsZero = function () {
        return (function (o1, o2) { if (o1 && o1.equals) {
            return o1.equals(o2);
        }
        else {
            return o1 === o2;
        } })(this.value, BigInteger.ZERO);
    };
    Felm.prototype.fpIsEven = function () {
        var c = this.value.and(BigInteger.ONE);
        return (function (o1, o2) { if (o1 && o1.equals) {
            return o1.equals(o2);
        }
        else {
            return o1 === o2;
        } })(c, BigInteger.ZERO);
    };
    Felm.prototype.fpIsOdd = function () {
        return !this.fpIsEven();
    };
    Felm.prototype.fpEquals = function (y) {
        return (function (o1, o2) { if (o1 && o1.equals) {
            return o1.equals(o2);
        }
        else {
            return o1 === o2;
        } })(this.value, y.value);
    };
    Felm.prototype.fpIsLessThan = function (y) {
        return this.value.compareTo(y.value) === -1;
    };
    Felm.prototype.fpIsGreaterThan = function (y) {
        return this.value.compareTo(y.value) === 1;
    };
    Felm.negate = function (x) {
        return new Felm(Felm.p_$LI$().subtract(x.value));
    };
    Felm.prototype.fpNegateInPlace = function () {
        this.value = Felm.p_$LI$().subtract(this.value);
    };
    Felm.inverse = function (x) {
        var z = new Felm(x);
        z.fpInverseInPlace();
        return z;
    };
    Felm.prototype.fpInverseInPlace = function () {
        this.value = this.value.modInverse(Felm.p_$LI$());
    };
    Felm.div2 = function (x) {
        var z = new Felm(x);
        z.fpDiv2InPlace();
        return z;
    };
    Felm.prototype.fpDiv2InPlace = function () {
        if (this.fpIsOdd())
            this.value = this.value.add(Felm.p_$LI$());
        this.value = this.value.shiftRight(1);
    };
    Felm.leftShift = function (x, shiftBy) {
        var z = new Felm(x);
        z.fpLeftShiftInPlace(shiftBy);
        return z;
    };
    Felm.prototype.fpLeftShiftInPlace = function (shiftBy) {
        this.value = this.value.shiftLeft(shiftBy);
    };
    Felm.rightShift = function (x, shiftBy) {
        var z = new Felm(x);
        z.fpRightShiftInPlace(shiftBy);
        return z;
    };
    Felm.prototype.fpRightShiftInPlace = function (shiftBy) {
        this.value = this.value.shiftRight(shiftBy);
    };
    Felm.prototype.fpSwap = function (y, option) {
        var temp;
        var mask;
        var yval;
        yval = y.value;
        mask = option.negate();
        temp = mask.and(this.value.xor(yval));
        this.value = temp.xor(this.value);
        yval = temp.xor(yval);
        return new Felm(yval);
    };
    Felm.prototype.toString = function () {
        return "0x" + this.value.toString$int(16);
    };
    Felm.prototype.toByteArray = function () {
        var retval = (function (s) { var a = []; while (s-- > 0)
            a.push(0); return a; })(Felm.primesize);
        /* fill */ (function (a, v) { for (var i = 0; i < a.length; i++)
            a[i] = v; })(retval, (0 | 0));
        var eltsize = ((this.value.bitLength() / 8 | 0)) + 1;
        var offset = Felm.primesize - eltsize;
        /* arraycopy */ (function (srcPts, srcOff, dstPts, dstOff, size) { if (srcPts !== dstPts || dstOff >= srcOff + size) {
            while (--size >= 0)
                dstPts[dstOff++] = srcPts[srcOff++];
        }
        else {
            var tmp = srcPts.slice(srcOff, srcOff + size);
            for (var i = 0; i < size; i++)
                dstPts[dstOff++] = tmp[i];
        } })(this.value.toByteArray(), 0, retval, offset, eltsize);
        return retval;
    };
    return Felm;
}());
Felm.primesize = 1;
Felm["__class"] = "Felm";
var F2elm = (function () {
    function F2elm(a0, a1) {
        var _this = this;
        if (((a0 != null && a0 instanceof BigInteger) || a0 === null) && ((a1 != null && a1 instanceof BigInteger) || a1 === null)) {
            var __args = arguments;
            if (this.x0 === undefined)
                this.x0 = null;
            if (this.x1 === undefined)
                this.x1 = null;
            if (this.x0 === undefined)
                this.x0 = null;
            if (this.x1 === undefined)
                this.x1 = null;
            (function () {
                _this.x0 = new Felm(a0);
                _this.x1 = new Felm(a1);
            })();
        }
        else if (((a0 != null && a0 instanceof Felm) || a0 === null) && ((a1 != null && a1 instanceof Felm) || a1 === null)) {
            var __args = arguments;
            if (this.x0 === undefined)
                this.x0 = null;
            if (this.x1 === undefined)
                this.x1 = null;
            if (this.x0 === undefined)
                this.x0 = null;
            if (this.x1 === undefined)
                this.x1 = null;
            (function () {
                _this.x0 = new Felm(a0);
                _this.x1 = new Felm(a1);
            })();
        }
        else if (((typeof a0 === 'number') || a0 === null) && ((typeof a1 === 'number') || a1 === null)) {
            var __args = arguments;
            var v0_1 = __args[0];
            var v1_1 = __args[1];
            if (this.x0 === undefined)
                this.x0 = null;
            if (this.x1 === undefined)
                this.x1 = null;
            if (this.x0 === undefined)
                this.x0 = null;
            if (this.x1 === undefined)
                this.x1 = null;
            (function () {
                _this.x0 = new Felm(v0_1);
                _this.x1 = new Felm(v1_1);
            })();
        }
        else if (((a0 != null && a0 instanceof F2elm) || a0 === null) && a1 === undefined) {
            var __args = arguments;
            var a_2 = __args[0];
            if (this.x0 === undefined)
                this.x0 = null;
            if (this.x1 === undefined)
                this.x1 = null;
            if (this.x0 === undefined)
                this.x0 = null;
            if (this.x1 === undefined)
                this.x1 = null;
            (function () {
                _this.x0 = new Felm(a_2.x0);
                _this.x1 = new Felm(a_2.x1);
            })();
        }
        else if (((a0 != null && a0 instanceof Array && (a0.length == 0 || a0[0] == null || (typeof a0[0] === 'number'))) || a0 === null) && a1 === undefined) {
            var __args = arguments;
            var bytes_2 = __args[0];
            if (this.x0 === undefined)
                this.x0 = null;
            if (this.x1 === undefined)
                this.x1 = null;
            if (this.x0 === undefined)
                this.x0 = null;
            if (this.x1 === undefined)
                this.x1 = null;
            (function () {
                var len = ((bytes_2.length) / 2 | 0);
                _this.x0 = new Felm(bytes_2.slice( 0, len));
                _this.x1 = new Felm(bytes_2.slice( len, 2 * len));
            })();
        }
        else if (((a0 != null && a0 instanceof SecureRandom) || a0 === null) && a1 === undefined) {
            var __args = arguments;
            var rnd_1 = __args[0];
            if (this.x0 === undefined)
                this.x0 = null;
            if (this.x1 === undefined)
                this.x1 = null;
            if (this.x0 === undefined)
                this.x0 = null;
            if (this.x1 === undefined)
                this.x1 = null;
            (function () {
                _this.x0 = new Felm(rnd_1);
                _this.x1 = new Felm(rnd_1);
            })();
        }
        else
            throw new Error('invalid overload');
    }
    F2elm.ZERO_$LI$ = function () { if (F2elm.ZERO == null)
        F2elm.ZERO = new F2elm(Felm.ZERO_$LI$(), Felm.ZERO_$LI$()); return F2elm.ZERO; };
    ;
    F2elm.ONE_$LI$ = function () { if (F2elm.ONE == null)
        F2elm.ONE = new F2elm(Felm.ONE_$LI$(), Felm.ZERO_$LI$()); return F2elm.ONE; };
    ;
    F2elm.prototype.f2Get0 = function () {
        return this.x0;
    };
    F2elm.prototype.f2Get1 = function () {
        return this.x1;
    };
    F2elm.prototype.f2Equals = function (y) {
        return this.x0.fpEquals(y.x0) && this.x1.fpEquals(y.x1);
    };
    F2elm.add = function (x, y) {
        var z = new F2elm(x);
        z.f2AddInPlace(y);
        return z;
    };
    F2elm.prototype.f2AddInPlace = function (y) {
        this.x0.fpAddInPlace(y.x0);
        this.x1.fpAddInPlace(y.x1);
    };
    F2elm.sub = function (x, y) {
        var z = new F2elm(x);
        z.f2SubInPlace(y);
        return z;
    };
    F2elm.prototype.f2SubInPlace = function (y) {
        this.x0.fpSubInPlace(y.x0);
        this.x1.fpSubInPlace(y.x1);
    };
    F2elm.negate = function (x) {
        var y = new F2elm(x);
        y.f2NegateInPlace();
        return y;
    };
    F2elm.prototype.f2NegateInPlace = function () {
        this.x0.fpNegateInPlace();
        this.x1.fpNegateInPlace();
    };
    F2elm.sqr = function (x) {
        var y = new F2elm(x);
        y.f2SqrInPlace();
        return y;
    };
    F2elm.prototype.f2SqrInPlace = function () {
        var t1;
        var t2;
        var t3;
        t1 = Felm.add(this.x0, this.x1);
        t2 = Felm.sub(this.x0, this.x1);
        t3 = Felm.leftShift(this.x0, 1);
        this.x0 = Felm.mult(t1, t2);
        this.x1.fpMultInPlace(t3);
    };
    F2elm.mult = function (y, z) {
        var x = new F2elm(y);
        x.f2MultInPlace(z);
        return x;
    };
    F2elm.prototype.f2MultInPlace = function (y) {
        var t1;
        var t2;
        var c0;
        var c1;
        var y0;
        var y1;
        y0 = y.x0;
        y1 = y.x1;
        t1 = Felm.mult(this.x0, y0);
        t2 = Felm.mult(this.x1, y1);
        c0 = Felm.sub(t1, t2);
        t1.fpAddInPlace(t2);
        t2 = Felm.add(this.x0, this.x1);
        this.x1 = Felm.add(y0, y1);
        this.x1.fpMultInPlace(t2);
        this.x1.fpSubInPlace(t1);
        this.x0 = c0;
    };
    F2elm.rightShift = function (y, n) {
        var x = new F2elm(y);
        x.f2RightShiftInPlace(n);
        return x;
    };
    F2elm.prototype.f2RightShiftInPlace = function (n) {
        this.x0.fpRightShiftInPlace(n);
        this.x1.fpRightShiftInPlace(n);
    };
    F2elm.leftShift = function (y, n) {
        var x = new F2elm(y);
        x.f2LeftShiftInPlace(n);
        return x;
    };
    F2elm.prototype.f2LeftShiftInPlace = function (n) {
        this.x0.fpLeftShiftInPlace(n);
        this.x1.fpLeftShiftInPlace(n);
    };
    F2elm.prototype.f2IsEven = function () {
        return this.x0.fpIsEven() && this.x1.fpIsEven();
    };
    F2elm.div2 = function (y) {
        var x = new F2elm(y);
        x.f2Div2InPlace();
        return x;
    };
    F2elm.prototype.f2Div2InPlace = function () {
        this.x0.fpDiv2InPlace();
        this.x1.fpDiv2InPlace();
    };
    F2elm.inverse = function (y) {
        var x = new F2elm(y);
        x.f2InverseInPlace();
        return x;
    };
    F2elm.prototype.f2InverseInPlace = function () {
        var t0;
        var t1;
        t0 = Felm.sqr(this.x0);
        t1 = Felm.sqr(this.x1);
        t0.fpAddInPlace(t1);
        t0.fpInverseInPlace();
        this.x1.fpNegateInPlace();
        this.x0.fpMultInPlace(t0);
        this.x1.fpMultInPlace(t0);
    };
    F2elm.inv3Way = function (z0, z1, z2) {
        var t0;
        var res = [null, null, null];
        t0 = F2elm.mult(z0, z1);
        res[1] = F2elm.mult(t0, z2);
        res[2] = F2elm.inverse(res[1]);
        res[1] = F2elm.mult(res[2], z2);
        res[0] = F2elm.mult(res[1], z1);
        res[1].f2MultInPlace(z0);
        res[2].f2MultInPlace(t0);
        return res;
    };
    F2elm.inv4Way = function (z0, z1, z2, z3) {
        var res = [null, null, null, null];
        res[0] = F2elm.mult(z0, z1);
        res[1] = F2elm.mult(z2, z3);
        res[2] = F2elm.mult(res[0], res[1]);
        res[3] = F2elm.inverse(res[2]);
        res[2] = F2elm.mult(res[1], res[3]);
        res[3].f2MultInPlace(res[0]);
        res[0] = F2elm.mult(res[2], z1);
        res[1] = F2elm.mult(res[2], z0);
        res[2] = F2elm.mult(res[3], z3);
        res[3].f2MultInPlace(z2);
        return res;
    };
    F2elm.prototype.f2Swap = function (y, option) {
        var y0;
        var y1;
        y0 = this.x0.fpSwap(y.x0, option);
        y1 = this.x1.fpSwap(y.x1, option);
        return new F2elm(y0, y1);
    };
    F2elm.select = function (x, y, option) {
        var y0;
        var y1;
        var z0;
        var z1;
        var mask;
        var bix0;
        var bix1;
        mask = option.negate();
        y0 = (y.x0).fpGetValue();
        y1 = (y.x1).fpGetValue();
        bix0 = (x.x0).fpGetValue();
        bix1 = (x.x1).fpGetValue();
        z0 = bix0.xor(y0);
        z1 = bix1.xor(y1);
        z0 = z0.and(mask);
        z1 = z1.and(mask);
        z0 = bix0.xor(z0);
        z1 = bix1.xor(z1);
        return new F2elm(z0, z1);
    };
    F2elm.prototype.toString = function () {
        return "[" + this.x0 + "," + this.x1 + "]";
    };
    F2elm.prototype.toByteArray = function () {
        var retval = (function (s) { var a = []; while (s-- > 0)
            a.push(0); return a; })(2 * Felm.primesize);
        /* arraycopy */ (function (srcPts, srcOff, dstPts, dstOff, size) { if (srcPts !== dstPts || dstOff >= srcOff + size) {
            while (--size >= 0)
                dstPts[dstOff++] = srcPts[srcOff++];
        }
        else {
            var tmp = srcPts.slice(srcOff, srcOff + size);
            for (var i = 0; i < size; i++)
                dstPts[dstOff++] = tmp[i];
        } })(this.x0.toByteArray(), 0, retval, 0, Felm.primesize);
        /* arraycopy */ (function (srcPts, srcOff, dstPts, dstOff, size) { if (srcPts !== dstPts || dstOff >= srcOff + size) {
            while (--size >= 0)
                dstPts[dstOff++] = srcPts[srcOff++];
        }
        else {
            var tmp = srcPts.slice(srcOff, srcOff + size);
            for (var i = 0; i < size; i++)
                dstPts[dstOff++] = tmp[i];
        } })(this.x1.toByteArray(), 0, retval, Felm.primesize, Felm.primesize);
        return retval;
    };
    return F2elm;
}());
F2elm["__class"] = "F2elm";
var F2Point = (function () {
    function F2Point(x0, x1, z0, z1) {
        var _this = this;
        if (((x0 != null && x0 instanceof Felm) || x0 === null) && ((x1 != null && x1 instanceof Felm) || x1 === null) && ((z0 != null && z0 instanceof Felm) || z0 === null) && ((z1 != null && z1 instanceof Felm) || z1 === null)) {
            var __args = arguments;
            if (this.x === undefined)
                this.x = null;
            if (this.z === undefined)
                this.z = null;
            if (this.x === undefined)
                this.x = null;
            if (this.z === undefined)
                this.z = null;
            (function () {
                _this.x = new F2elm(x0, x1);
                _this.z = new F2elm(z0, z1);
            })();
        }
        else if (((x0 != null && x0 instanceof F2elm) || x0 === null) && ((x1 != null && x1 instanceof F2elm) || x1 === null) && z0 === undefined && z1 === undefined) {
            var __args = arguments;
            var xc_1 = __args[0];
            var zc_1 = __args[1];
            if (this.x === undefined)
                this.x = null;
            if (this.z === undefined)
                this.z = null;
            if (this.x === undefined)
                this.x = null;
            if (this.z === undefined)
                this.z = null;
            (function () {
                _this.x = new F2elm(xc_1);
                _this.z = new F2elm(zc_1);
            })();
        }
        else if (((x0 != null && x0 instanceof F2Point) || x0 === null) && x1 === undefined && z0 === undefined && z1 === undefined) {
            var __args = arguments;
            var p_1 = __args[0];
            if (this.x === undefined)
                this.x = null;
            if (this.z === undefined)
                this.z = null;
            if (this.x === undefined)
                this.x = null;
            if (this.z === undefined)
                this.z = null;
            (function () {
                _this.x = new F2elm(p_1.x);
                _this.z = new F2elm(p_1.z);
            })();
        }
        else
            throw new Error('invalid overload');
    }
    F2Point.INFINITY_$LI$ = function () { if (F2Point.INFINITY == null)
        F2Point.INFINITY = new F2Point(F2elm.ONE_$LI$(), F2elm.ZERO_$LI$()); return F2Point.INFINITY; };
    ;
    F2Point.prototype.getX = function () {
        return this.x;
    };
    F2Point.prototype.getZ = function () {
        return this.z;
    };
    F2Point.prototype.setX = function (xval) {
        this.x = xval;
    };
    F2Point.prototype.swapPoints = function (q, option) {
        var qx;
        var qz;
        qx = this.x.f2Swap(q.x, option);
        qz = this.z.f2Swap(q.z, option);
        return new F2Point(qx, qz);
    };
    F2Point.prototype.normalize = function () {
        this.z.f2InverseInPlace();
        this.x.f2MultInPlace(this.z);
        this.z = new F2elm(F2elm.ONE_$LI$());
    };
    F2Point.prototype.toString = function () {
        return "(" + this.x + ": " + this.z + ")";
    };
    return F2Point;
}());
F2Point["__class"] = "F2Point";
var MontCurve = (function () {
    function MontCurve(aA, bB, cC) {
        var _this = this;
        if (((aA != null && aA instanceof F2elm) || aA === null) && ((bB != null && bB instanceof F2elm) || bB === null) && ((cC != null && cC instanceof F2elm) || cC === null)) {
            var __args = arguments;
            if (this.a === undefined)
                this.a = null;
            if (this.c === undefined)
                this.c = null;
            if (this.a24minus === undefined)
                this.a24minus = null;
            if (this.a24plus === undefined)
                this.a24plus = null;
            if (this.a24 === undefined)
                this.a24 = null;
            if (this.c24 === undefined)
                this.c24 = null;
            if (this.a === undefined)
                this.a = null;
            if (this.c === undefined)
                this.c = null;
            if (this.a24minus === undefined)
                this.a24minus = null;
            if (this.a24plus === undefined)
                this.a24plus = null;
            if (this.a24 === undefined)
                this.a24 = null;
            if (this.c24 === undefined)
                this.c24 = null;
            (function () {
                _this.a = aA;
                _this.c = cC;
            })();
        }
        else if (((aA != null && aA instanceof F2elm) || aA === null) && ((bB != null && bB instanceof F2elm) || bB === null) && cC === undefined) {
            var __args = arguments;
            var cC_1 = __args[1];
            if (this.a === undefined)
                this.a = null;
            if (this.c === undefined)
                this.c = null;
            if (this.a24minus === undefined)
                this.a24minus = null;
            if (this.a24plus === undefined)
                this.a24plus = null;
            if (this.a24 === undefined)
                this.a24 = null;
            if (this.c24 === undefined)
                this.c24 = null;
            if (this.a === undefined)
                this.a = null;
            if (this.c === undefined)
                this.c = null;
            if (this.a24minus === undefined)
                this.a24minus = null;
            if (this.a24plus === undefined)
                this.a24plus = null;
            if (this.a24 === undefined)
                this.a24 = null;
            if (this.c24 === undefined)
                this.c24 = null;
            (function () {
                _this.a = aA;
                _this.c = cC_1;
            })();
        }
        else if (((aA != null && aA instanceof MontCurve) || aA === null) && bB === undefined && cC === undefined) {
            var __args = arguments;
            var curveIn_1 = __args[0];
            if (this.a === undefined)
                this.a = null;
            if (this.c === undefined)
                this.c = null;
            if (this.a24minus === undefined)
                this.a24minus = null;
            if (this.a24plus === undefined)
                this.a24plus = null;
            if (this.a24 === undefined)
                this.a24 = null;
            if (this.c24 === undefined)
                this.c24 = null;
            if (this.a === undefined)
                this.a = null;
            if (this.c === undefined)
                this.c = null;
            if (this.a24minus === undefined)
                this.a24minus = null;
            if (this.a24plus === undefined)
                this.a24plus = null;
            if (this.a24 === undefined)
                this.a24 = null;
            if (this.c24 === undefined)
                this.c24 = null;
            (function () {
                _this.a = new F2elm(curveIn_1.a);
                _this.c = new F2elm(curveIn_1.c);
            })();
        }
        else if (aA === undefined && bB === undefined && cC === undefined) {
            var __args = arguments;
            if (this.a === undefined)
                this.a = null;
            if (this.c === undefined)
                this.c = null;
            if (this.a24minus === undefined)
                this.a24minus = null;
            if (this.a24plus === undefined)
                this.a24plus = null;
            if (this.a24 === undefined)
                this.a24 = null;
            if (this.c24 === undefined)
                this.c24 = null;
            if (this.a === undefined)
                this.a = null;
            if (this.c === undefined)
                this.c = null;
            if (this.a24minus === undefined)
                this.a24minus = null;
            if (this.a24plus === undefined)
                this.a24plus = null;
            if (this.a24 === undefined)
                this.a24 = null;
            if (this.c24 === undefined)
                this.c24 = null;
            (function () {
                _this.a = new F2elm(F2elm.ZERO_$LI$());
                _this.c = new F2elm(F2elm.ONE_$LI$());
            })();
        }
        else
            throw new Error('invalid overload');
    }
    MontCurve.prototype.updateA24 = function () {
        this.a24 = F2elm.leftShift(F2elm.ONE_$LI$(), 1);
        this.a24.f2AddInPlace(this.a);
        this.a24.f2Div2InPlace();
        this.a24.f2Div2InPlace();
    };
    MontCurve.prototype.updateAC = function (order) {
        if (order === 3) {
            this.a = F2elm.add(this.a24plus, this.a24minus);
            this.a.f2LeftShiftInPlace(1);
            this.c = F2elm.sub(this.a24plus, this.a24minus);
        }
        else {
            this.c = F2elm.div2(this.c24);
            this.a = F2elm.sub(this.a24plus, this.c);
            this.c.f2Div2InPlace();
        }
    };
    MontCurve.prototype.getA24plus = function () {
        return this.a24plus;
    };
    MontCurve.prototype.setA24plus = function (invalue) {
        this.a24plus = invalue;
    };
    MontCurve.prototype.setA24minus = function (invalue) {
        this.a24minus = invalue;
    };
    MontCurve.prototype.setC24 = function (invalue) {
        this.c24 = invalue;
    };
    MontCurve.recoverA = function (px, qx, dx) {
        var t0;
        var t1;
        var ra;
        t1 = F2elm.add(px, qx);
        t0 = F2elm.mult(px, qx);
        ra = F2elm.mult(dx, t1);
        ra.f2AddInPlace(t0);
        t0.f2MultInPlace(dx);
        ra.f2SubInPlace(F2elm.ONE_$LI$());
        t0.f2LeftShiftInPlace(2);
        t1.f2AddInPlace(dx);
        ra.f2SqrInPlace();
        t0.f2InverseInPlace();
        ra.f2MultInPlace(t0);
        ra.f2SubInPlace(t1);
        return ra;
    };
    MontCurve.prototype.xDbl = function (p) {
        var t0;
        var t1;
        var qx;
        var qz;
        var px;
        var pz;
        px = p.getX();
        pz = p.getZ();
        t0 = F2elm.sub(px, pz);
        t1 = F2elm.add(px, pz);
        t0.f2SqrInPlace();
        t1.f2SqrInPlace();
        qz = F2elm.mult(this.c24, t0);
        qx = F2elm.mult(t1, qz);
        t1.f2SubInPlace(t0);
        t0 = F2elm.mult(this.a24plus, t1);
        qz.f2AddInPlace(t0);
        qz.f2MultInPlace(t1);
        return new F2Point(qx, qz);
    };
    MontCurve.prototype.xDble = function (p, e) {
        var q = p;
        var i;
        for (i = 0; i < e; i++) {
            q = this.xDbl(q);
        }
        return q;
    };
    MontCurve.prototype.xTpl = function (p) {
        var t0;
        var t1;
        var t2;
        var t3;
        var t4;
        var t5;
        var t6;
        var px;
        var pz;
        var qx;
        var qz;
        px = p.getX();
        pz = p.getZ();
        t0 = F2elm.sub(px, pz);
        t2 = F2elm.sqr(t0);
        t1 = F2elm.add(px, pz);
        t3 = F2elm.sqr(t1);
        t4 = F2elm.leftShift(px, 1);
        t0 = F2elm.leftShift(pz, 1);
        t1 = F2elm.sqr(t4);
        t1.f2SubInPlace(t3);
        t1.f2SubInPlace(t2);
        t5 = F2elm.mult(t3, this.a24plus);
        t3.f2MultInPlace(t5);
        t6 = F2elm.mult(t2, this.a24minus);
        t2.f2MultInPlace(t6);
        t3 = F2elm.sub(t2, t3);
        t2 = F2elm.sub(t5, t6);
        t1.f2MultInPlace(t2);
        t2 = F2elm.add(t1, t3);
        t2.f2SqrInPlace();
        qx = F2elm.mult(t4, t2);
        t1 = F2elm.sub(t3, t1);
        t1.f2SqrInPlace();
        qz = F2elm.mult(t0, t1);
        return new F2Point(qx, qz);
    };
    MontCurve.prototype.xTple = function (p, e) {
        var i;
        var q = p;
        for (i = 0; i < e; i++) {
            q = this.xTpl(q);
        }
        return q;
    };
    MontCurve.prototype.xDblAdd = function (p, q, xpq) {
        var t0;
        var t1;
        var t2;
        var qx;
        var qz;
        var px;
        var pz;
        var pq;
        px = new F2elm(p.getX());
        pz = new F2elm(p.getZ());
        qx = new F2elm(q.getX());
        qz = new F2elm(q.getZ());
        t0 = F2elm.add(px, pz);
        t1 = F2elm.sub(px, pz);
        px = F2elm.sqr(t0);
        t2 = F2elm.sub(qx, qz);
        qx.f2AddInPlace(qz);
        t0.f2MultInPlace(t2);
        pz = F2elm.sqr(t1);
        t1.f2MultInPlace(qx);
        t2 = F2elm.sub(px, pz);
        px.f2MultInPlace(pz);
        qx = F2elm.mult(t2, this.a24);
        qz = F2elm.sub(t0, t1);
        pz.f2AddInPlace(qx);
        qx = F2elm.add(t0, t1);
        pz.f2MultInPlace(t2);
        qz.f2SqrInPlace();
        qx.f2SqrInPlace();
        qz.f2MultInPlace(xpq);
        pq = [null, null];
        pq[0] = new F2Point(px, pz);
        pq[1] = new F2Point(qx, qz);
        return pq;
    };
    MontCurve.prototype.ladder3pt = function (xp, xq, xpq, m, obits) {
        var rs;
        var r;
        var i;
        var swap;
        var bit;
        var prevbit = BigInteger.ZERO;
        var xval;
        rs = [null, null];
        rs[0] = new F2Point(xq, F2elm.ONE_$LI$());
        rs[1] = new F2Point(xpq, F2elm.ONE_$LI$());
        r = new F2Point(xp, F2elm.ONE_$LI$());
        for (i = 0; i < obits; i++) {
            {
                bit = m.testBit(i) ? BigInteger.ONE : BigInteger.ZERO;
                swap = bit.xor(prevbit);
                prevbit = bit;
                r = rs[1].swapPoints(r, swap);
                rs = this.xDblAdd(rs[0], rs[1], r.getX());
                rs[1].setX(F2elm.mult(rs[1].getX(), r.getZ()));
            }
            ;
        }
        return r;
    };
    MontCurve.prototype.jInv = function () {
        var t0;
        var t1;
        var jinv;
        jinv = F2elm.sqr(this.a);
        t1 = F2elm.sqr(this.c);
        t0 = F2elm.leftShift(t1, 1);
        t0 = F2elm.sub(jinv, t0);
        t0.f2SubInPlace(t1);
        jinv = F2elm.sub(t0, t1);
        t1.f2SqrInPlace();
        jinv.f2MultInPlace(t1);
        t0.f2LeftShiftInPlace(2);
        t1 = F2elm.sqr(t0);
        t0.f2MultInPlace(t1);
        t0 = F2elm.leftShift(t0, 2);
        jinv.f2InverseInPlace();
        jinv.f2MultInPlace(t0);
        return jinv;
    };
    MontCurve.prototype.toString = function () {
        var adivc;
        adivc = F2elm.inverse(this.c);
        adivc.f2MultInPlace(this.a);
        return "y^2 = x^3 + " + adivc + " x^2 + " + this.c + " x";
    };
    return MontCurve;
}());
MontCurve["__class"] = "MontCurve";
var SidhPrivateKey = (function () {
    function SidhPrivateKey(aOrB, order) {
        var _this = this;
        if (((typeof aOrB === 'number') || aOrB === null) && ((order != null && order instanceof BigInteger) || order === null)) {
            var __args = arguments;
            if (this.m === undefined)
                this.m = null;
            if (this.m === undefined)
                this.m = null;
            (function () {
                var temp;
                var randmod;
                var three = new BigInteger(String(3));
                var condition;
                temp = Felm.genRandom(order);
                if (aOrB === SidhKeyExchange.PARTYA)
                    condition = temp.testBit(0);
                else {
                    randmod = temp.mod(three);
                    condition = randmod.intValue() !== 0;
                }
                while (((function (o1, o2) { if (o1 && o1.equals) {
                    return o1.equals(o2);
                }
                else {
                    return o1 === o2;
                } })(temp, BigInteger.ZERO) || condition)) {
                    {
                        temp = Felm.genRandom(order);
                        if (aOrB === SidhKeyExchange.PARTYA)
                            condition = temp.testBit(0);
                        else {
                            randmod = temp.mod(three);
                            condition = randmod.intValue() !== 0;
                        }
                    }
                }
                ;
                _this.m = temp;
            })();
        }
        else if (((aOrB != null && aOrB instanceof BigInteger) || aOrB === null) && order === undefined) {
            var __args = arguments;
            var mIn_1 = __args[0];
            if (this.m === undefined)
                this.m = null;
            if (this.m === undefined)
                this.m = null;
            (function () {
                _this.m = mIn_1;
            })();
        }
        else if (((aOrB != null && aOrB instanceof SidhPrivateKey) || aOrB === null) && order === undefined) {
            var __args = arguments;
            var kIn_1 = __args[0];
            if (this.m === undefined)
                this.m = null;
            if (this.m === undefined)
                this.m = null;
            (function () {
                _this.m = kIn_1.getKey();
            })();
        }
        else if (((aOrB != null && aOrB instanceof Array && (aOrB.length == 0 || aOrB[0] == null || (typeof aOrB[0] === 'number'))) || aOrB === null) && order === undefined) {
            var __args = arguments;
            var bytesIn_1 = __args[0];
            if (this.m === undefined)
                this.m = null;
            if (this.m === undefined)
                this.m = null;
            (function () {
                _this.m = new BigInteger(bytesIn_1);
            })();
        }
        else
            throw new Error('invalid overload');
    }
    SidhPrivateKey.prototype.getKey = function () {
        return this.m;
    };
    SidhPrivateKey.prototype.privateKeyEquals = function (otherKey) {
        return this.m.compareTo(otherKey.getKey()) === 0;
    };
    SidhPrivateKey.prototype.serialize = function () {
        return this.m.toByteArray();
    };
    return SidhPrivateKey;
}());
SidhPrivateKey["__class"] = "SidhPrivateKey";
var SidhKeyExchange = (function () {
    function SidhKeyExchange(parameterID) {
        var _this = this;
        if (((typeof parameterID === 'string') || parameterID === null)) {
            var __args = arguments;
            if (this.f === undefined)
                this.f = 0;
            if (this.lA === undefined)
                this.lA = 0;
            if (this.lB === undefined)
                this.lB = 0;
            if (this.eA === undefined)
                this.eA = 0;
            if (this.eB === undefined)
                this.eB = 0;
            if (this.prime === undefined)
                this.prime = null;
            if (this.orderB === undefined)
                this.orderB = null;
            if (this.orderA === undefined)
                this.orderA = null;
            if (this.obitsA === undefined)
                this.obitsA = 0;
            if (this.obitsB === undefined)
                this.obitsB = 0;
            if (this.aGenPx === undefined)
                this.aGenPx = null;
            if (this.aGenQx === undefined)
                this.aGenQx = null;
            if (this.aGenDx === undefined)
                this.aGenDx = null;
            if (this.bGenPx === undefined)
                this.bGenPx = null;
            if (this.bGenQx === undefined)
                this.bGenQx = null;
            if (this.bGenDx === undefined)
                this.bGenDx = null;
            if (this.maxA === undefined)
                this.maxA = 0;
            if (this.maxB === undefined)
                this.maxB = 0;
            if (this.maxIntPointsA === undefined)
                this.maxIntPointsA = 0;
            if (this.maxIntPointsB === undefined)
                this.maxIntPointsB = 0;
            if (this.splitsA === undefined)
                this.splitsA = null;
            if (this.splitsB === undefined)
                this.splitsB = null;
            if (this.baseCurve === undefined)
                this.baseCurve = null;
            if (this.f === undefined)
                this.f = 0;
            if (this.lA === undefined)
                this.lA = 0;
            if (this.lB === undefined)
                this.lB = 0;
            if (this.eA === undefined)
                this.eA = 0;
            if (this.eB === undefined)
                this.eB = 0;
            if (this.prime === undefined)
                this.prime = null;
            if (this.orderB === undefined)
                this.orderB = null;
            if (this.orderA === undefined)
                this.orderA = null;
            if (this.obitsA === undefined)
                this.obitsA = 0;
            if (this.obitsB === undefined)
                this.obitsB = 0;
            if (this.aGenPx === undefined)
                this.aGenPx = null;
            if (this.aGenQx === undefined)
                this.aGenQx = null;
            if (this.aGenDx === undefined)
                this.aGenDx = null;
            if (this.bGenPx === undefined)
                this.bGenPx = null;
            if (this.bGenQx === undefined)
                this.bGenQx = null;
            if (this.bGenDx === undefined)
                this.bGenDx = null;
            if (this.maxA === undefined)
                this.maxA = 0;
            if (this.maxB === undefined)
                this.maxB = 0;
            if (this.maxIntPointsA === undefined)
                this.maxIntPointsA = 0;
            if (this.maxIntPointsB === undefined)
                this.maxIntPointsB = 0;
            if (this.splitsA === undefined)
                this.splitsA = null;
            if (this.splitsB === undefined)
                this.splitsB = null;
            if (this.baseCurve === undefined)
                this.baseCurve = null;
            (function () {
                if ((function (o1, o2) { if (o1 && o1.equals) {
                    return o1.equals(o2);
                }
                else {
                    return o1 === o2;
                } })(parameterID, "sidhP751"))
                    _this.setP751();
                else if ((function (o1, o2) { if (o1 && o1.equals) {
                    return o1.equals(o2);
                }
                else {
                    return o1 === o2;
                } })(parameterID, "sidhP503"))
                    _this.setP503();
                else {
                }
            })();
        }
        else if (parameterID === undefined) {
            var __args = arguments;
            if (this.f === undefined)
                this.f = 0;
            if (this.lA === undefined)
                this.lA = 0;
            if (this.lB === undefined)
                this.lB = 0;
            if (this.eA === undefined)
                this.eA = 0;
            if (this.eB === undefined)
                this.eB = 0;
            if (this.prime === undefined)
                this.prime = null;
            if (this.orderB === undefined)
                this.orderB = null;
            if (this.orderA === undefined)
                this.orderA = null;
            if (this.obitsA === undefined)
                this.obitsA = 0;
            if (this.obitsB === undefined)
                this.obitsB = 0;
            if (this.aGenPx === undefined)
                this.aGenPx = null;
            if (this.aGenQx === undefined)
                this.aGenQx = null;
            if (this.aGenDx === undefined)
                this.aGenDx = null;
            if (this.bGenPx === undefined)
                this.bGenPx = null;
            if (this.bGenQx === undefined)
                this.bGenQx = null;
            if (this.bGenDx === undefined)
                this.bGenDx = null;
            if (this.maxA === undefined)
                this.maxA = 0;
            if (this.maxB === undefined)
                this.maxB = 0;
            if (this.maxIntPointsA === undefined)
                this.maxIntPointsA = 0;
            if (this.maxIntPointsB === undefined)
                this.maxIntPointsB = 0;
            if (this.splitsA === undefined)
                this.splitsA = null;
            if (this.splitsB === undefined)
                this.splitsB = null;
            if (this.baseCurve === undefined)
                this.baseCurve = null;
            if (this.f === undefined)
                this.f = 0;
            if (this.lA === undefined)
                this.lA = 0;
            if (this.lB === undefined)
                this.lB = 0;
            if (this.eA === undefined)
                this.eA = 0;
            if (this.eB === undefined)
                this.eB = 0;
            if (this.prime === undefined)
                this.prime = null;
            if (this.orderB === undefined)
                this.orderB = null;
            if (this.orderA === undefined)
                this.orderA = null;
            if (this.obitsA === undefined)
                this.obitsA = 0;
            if (this.obitsB === undefined)
                this.obitsB = 0;
            if (this.aGenPx === undefined)
                this.aGenPx = null;
            if (this.aGenQx === undefined)
                this.aGenQx = null;
            if (this.aGenDx === undefined)
                this.aGenDx = null;
            if (this.bGenPx === undefined)
                this.bGenPx = null;
            if (this.bGenQx === undefined)
                this.bGenQx = null;
            if (this.bGenDx === undefined)
                this.bGenDx = null;
            if (this.maxA === undefined)
                this.maxA = 0;
            if (this.maxB === undefined)
                this.maxB = 0;
            if (this.maxIntPointsA === undefined)
                this.maxIntPointsA = 0;
            if (this.maxIntPointsB === undefined)
                this.maxIntPointsB = 0;
            if (this.splitsA === undefined)
                this.splitsA = null;
            if (this.splitsB === undefined)
                this.splitsB = null;
            if (this.baseCurve === undefined)
                this.baseCurve = null;
            (function () {
                _this.setP503();
            })();
        }
        else
            throw new Error('invalid overload');
    }
    SidhKeyExchange.prototype.setP503 = function () {
        var x0;
        var x1;
        this.f = 1;
        this.lA = 2;
        this.lB = 3;
        this.eA = 250;
        this.eB = 159;
        this.prime = new BigInteger("004066F541811E1E6045C6BDDA77A4D01B9BF6C87B7E7DAF13085BDA2211E7A0ABFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF", 16);
        Felm.setPrime(this.prime);
        this.orderA = new BigInteger("400000000000000000000000000000000000000000000000000000000000000", 16);
        this.orderB = new BigInteger("1019BD50604787981171AF769DE93406E6FDB21EDF9F6BC4C216F6888479E82B", 16);
        this.maxA = 125;
        this.maxB = 159;
        this.obitsA = 250;
        this.obitsB = 253;
        x0 = new BigInteger("1f6d52a7563bb9356b98a116a0ca9775dbb7382eb29e24e45299d8939959eaeeb47ff3113f60882d12103e4b8b8cd2b97da14657ae8c128be82209d2ddfca9", 16);
        x1 = new BigInteger("2d44c3fad24e4cbddc8a2d9de336a92a9912ee6d09e2dd5c33ab26d60a268ac91f38e1af4c2d5bfa2b87dd55c8ca6019c6b0c08ed92b5aeb6c65a8e06e53e9", 16);
        this.aGenPx = new F2elm(x0, x1);
        x0 = new BigInteger("97453912e12f3daf32eeffd618bd93d3bbbf399137bd39858cadefae382e42d6e60a62fd62417ad61a14b60db26125273ec980981325d86e55c45e3bb46b1", 16);
        this.aGenQx = new F2elm(x0, BigInteger.ZERO);
        x0 = new BigInteger("173775ecbec79c78fd1ed5fe36075aace1f53f8ffb97d2a7e80dfc2875e77ec72d1d4a99e13353ec9d147badd96126948a72b30bdd7cebad7b54f8ddb5cd06", 16);
        x1 = new BigInteger("2eaa224ddda149bbbb9089d2b2c471d068eca203465ce97dbc1c8ed0ebb0ff90e4fbe7e266bba99cbae051797b4d35d28e36c1b1cb994aeeed1cb59fe5015", 16);
        this.aGenDx = new F2elm(x0, x1);
        x0 = new BigInteger("21b7098b640a01d88708b729837e870cff9df6d4df86d86a7409f41156cb5f7b8514822730940c9b51e0d9821b0a67dd7ed98b9793685fa2e22d6d89d66a4e", 16);
        x1 = new BigInteger("2f37f575bebbc33851f75b7ab5d89fc3f07e4df3cc52349804b8d17a17000a42fc6c5734b9fcfde669730f3e8569ceb53821d3e8012f7f391f57364f402909", 16);
        this.bGenPx = new F2elm(x0, x1);
        x0 = new BigInteger("1e7d6ebceec9cfc47779affd696a88a971cdf3ec61e009df55caf4b6e01903b2cd1a12089c2ece106bdf745894c14d7e39b6997f70023e0a23b4b3787ef08f", 16);
        this.bGenQx = new F2elm(x0, BigInteger.ZERO);
        x0 = new BigInteger("d4818d120a24abf48db51d129e6b1f24f4bbb2c16facc0c8c06323eeec2fa5b5e887e17226417b1907310bfe6784fdebbac8c2a9abbe753f52259a7b7d70e", 16);
        x1 = new BigInteger("19e75f0f03312d22cbbf153747525d89e5155babb8bf0c130cb567ca532f69aaf57ea7682b9957021d90414433abbeedc233e9082185781c16724c8c356777", 16);
        this.bGenDx = new F2elm(x0, x1);
        this.maxIntPointsA = 7;
        this.maxIntPointsB = 8;
        this.splitsA = [61, 32, 16, 8, 4, 2, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 8, 4, 2, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 16, 8, 4, 2, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 8, 4, 2, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 29, 16, 8, 4, 2, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 8, 4, 2, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 13, 8, 4, 2, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 5, 4, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1];
        this.splitsB = [71, 38, 21, 13, 8, 4, 2, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 5, 4, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 9, 5, 3, 2, 1, 1, 1, 1, 2, 1, 1, 1, 4, 2, 1, 1, 1, 2, 1, 1, 17, 9, 5, 3, 2, 1, 1, 1, 1, 2, 1, 1, 1, 4, 2, 1, 1, 1, 2, 1, 1, 8, 4, 2, 1, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 33, 17, 9, 5, 3, 2, 1, 1, 1, 1, 2, 1, 1, 1, 4, 2, 1, 1, 1, 2, 1, 1, 8, 4, 2, 1, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 16, 8, 4, 2, 1, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 8, 4, 2, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1];
        this.baseCurve = new MontCurve();
    };
    SidhKeyExchange.prototype.setP751 = function () {
        var x0;
        var x1;
        this.f = 1;
        this.lA = 2;
        this.lB = 3;
        this.eA = 372;
        this.eB = 239;
        this.maxA = 186;
        this.maxB = 239;
        this.obitsA = 372;
        this.obitsB = 379;
        this.prime = new BigInteger("6fe5d541f71c0e12909f97badc668562b5045cb25748084e9867d6ebe876da959b1a13f7cc76e3ec968549f878a8eeafffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16);
        Felm.setPrime(this.prime);
        this.orderA = new BigInteger("1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", 16);
        this.orderB = new BigInteger("6fe5d541f71c0e12909f97badc668562b5045cb25748084e9867d6ebe876da959b1a13f7cc76e3ec968549f878a8eeb", 16);
        x0 = new BigInteger("54921c31f0dc9531cb890fc5ec66df2e7f0d55761363c6e375da69b0682cabe5c0fffcbe6e1ad46563f042fa06b9f207fcf3cdd2673652828ff50c3f7b755c0be072950d16ca747c146775c0267a401ffc738b03a49e9a36b39572afb363", 16);
        x1 = new BigInteger("28849bc0d81e01993137a5b63d6e633c4e97ab4ff118ccf63dfe623092ac86b6d4a9b751797cba1a177500e9eb5af7852b7df02c334844d652efc4729178a1dbad8ca47bb7e757c6d43b799811a63bebe649c18101f03ad752cdcd73bf66", 16);
        this.aGenPx = new F2elm(x0, x1);
        x0 = new BigInteger("3e82027a38e9429c8d36ff46bcc93fa23f89f6be06d2b1317ad90438621783fdb7a4ad3e83e86cae096d5db822c98e561e008fa0e3f3b9ac2f40c56d6fa4a58a20449af1f1335661d14ab7347693632646086ce3acd54b0346f5cce233e9", 16);
        this.aGenQx = new F2elm(x0, BigInteger.ZERO);
        x0 = new BigInteger("22a0b5a35a2b0c56135a7cec5cfb97964a7c6226fe909f374362a8eca3ab14a1b7b0c87ac875dce5888d83b623bf0011a4ac138f62ef6b2d2d84f636548a9f920f238336e5a36e45e4055940e3c94385b8fc5374396432eef2ae178cefdd", 16);
        x1 = new BigInteger("f9c4afcda809c3358b096b250c69b20310fdf2ef631711aa4efec49a4e76483f320b793f2ebc63365eed14aa3f6ea33feb56796f011ba6c6dfb4d0a00aac4d2786646d914ad026cbb4a592ec74b5485372e51382d44528dd491b83d9547", 16);
        this.aGenDx = new F2elm(x0, x1);
        x0 = new BigInteger("5fd1a3c4dd0f630974196fed3519152bc7098b9e2b121eca46bd10a5cc9f4bcc6c689b8e4c063b3798075fcee6edaa9eb108b3cd00495cf04dd8ce4a08fbe685a127d40e45f4cf45098a578deb44368699394c43bfc9bc5e00052f78e8d", 16);
        x1 = new BigInteger("2b88a03360b3389547732c9140c05dea6516881fe108211be887cc43fcb80c06a1d86ff5457d3bb7db936394ec33821aa39333a60af84b537974cfa0ba8287d699d2bf79ba559026c64a6ed610501d2357c10b9a6c8f837424922275acbf", 16);
        this.bGenPx = new F2elm(x0, x1);
        x0 = new BigInteger("2f1d80ef06ef960a01ab8ff409a2f8d5bce859ed725de145fe2d525160e0a3ad8e17b9f9238cd5e69cf26df237429bd3778659023b9ecb610e30288a7770d3785aaaa4d646c576aecb94b919aeedd9e1df566c1d26d376ed2325dcc93103", 16);
        this.bGenQx = new F2elm(x0, BigInteger.ZERO);
        x0 = new BigInteger("77b3bb69009428a327d43ca60169715f547454f88cd017b32df58a7252c2b3c3d00d52ccd3133d54041d8bcaea291f2057202328712cd395575cd7ccd3ce70c0a1ebf633ba946559458878f41f9fdd1727e2c31125b2fe5b71306704829", 16);
        x1 = new BigInteger("6d91393a57dbf47fd6dcf841f17ecd719cae1d33c6832a75b0f168855bcc38d2a4792dff9bc86deaca10b1aa808d539b167d73bba32168687fa3f85ae93a1adde5bd1fd5b681dcc6c34454d4496976c22d80c95e42b12576fc0fb4074b9f", 16);
        this.bGenDx = new F2elm(x0, x1);
        this.maxIntPointsA = 8;
        this.maxIntPointsB = 10;
        this.splitsA = [80, 48, 27, 15, 8, 4, 2, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 7, 4, 2, 1, 1, 2, 1, 1, 3, 2, 1, 1, 1, 1, 12, 7, 4, 2, 1, 1, 2, 1, 1, 3, 2, 1, 1, 1, 1, 5, 3, 2, 1, 1, 1, 1, 2, 1, 1, 1, 21, 12, 7, 4, 2, 1, 1, 2, 1, 1, 3, 2, 1, 1, 1, 1, 5, 3, 2, 1, 1, 1, 1, 2, 1, 1, 1, 9, 5, 3, 2, 1, 1, 1, 1, 2, 1, 1, 1, 4, 2, 1, 1, 1, 2, 1, 1, 33, 20, 12, 7, 4, 2, 1, 1, 2, 1, 1, 3, 2, 1, 1, 1, 1, 5, 3, 2, 1, 1, 1, 1, 2, 1, 1, 1, 8, 5, 3, 2, 1, 1, 1, 1, 2, 1, 1, 1, 4, 2, 1, 1, 2, 1, 1, 16, 8, 4, 2, 1, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 8, 4, 2, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1];
        this.splitsB = [112, 63, 32, 16, 8, 4, 2, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 8, 4, 2, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 16, 8, 4, 2, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 8, 4, 2, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 31, 16, 8, 4, 2, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 8, 4, 2, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 15, 8, 4, 2, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 7, 4, 2, 1, 1, 2, 1, 1, 3, 2, 1, 1, 1, 1, 49, 31, 16, 8, 4, 2, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 8, 4, 2, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 15, 8, 4, 2, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 7, 4, 2, 1, 1, 2, 1, 1, 3, 2, 1, 1, 1, 1, 21, 12, 8, 4, 2, 1, 1, 2, 1, 1, 4, 2, 1, 1, 2, 1, 1, 5, 3, 2, 1, 1, 1, 1, 2, 1, 1, 1, 9, 5, 3, 2, 1, 1, 1, 1, 2, 1, 1, 1, 4, 2, 1, 1, 1, 2, 1, 1];
        this.baseCurve = new MontCurve();
    };
    SidhKeyExchange.prototype.getCurve = function () {
        return this.baseCurve;
    };
    SidhKeyExchange.prototype.getOrderA = function () {
        return this.orderA;
    };
    SidhKeyExchange.prototype.getOrderB = function () {
        return this.orderB;
    };
    SidhKeyExchange.prototype.getGenA = function () {
        var genA = [this.aGenPx, this.aGenQx, this.aGenDx];
        return genA;
    };
    SidhKeyExchange.prototype.getGenB = function () {
        var genB = [this.bGenPx, this.bGenQx, this.bGenDx];
        return genB;
    };
    SidhKeyExchange.prototype.getMIPA = function () {
        return this.maxIntPointsA;
    };
    SidhKeyExchange.prototype.getMIPB = function () {
        return this.maxIntPointsB;
    };
    SidhKeyExchange.prototype.getMaxA = function () {
        return this.maxA;
    };
    SidhKeyExchange.prototype.getMaxB = function () {
        return this.maxB;
    };
    SidhKeyExchange.prototype.getSplitsA = function () {
        return this.splitsA;
    };
    SidhKeyExchange.prototype.getSplitsB = function () {
        return this.splitsB;
    };
    SidhKeyExchange.prototype.getObitsA = function () {
        return this.obitsA;
    };
    SidhKeyExchange.prototype.getObitsB = function () {
        return this.obitsB;
    };
    SidhKeyExchange.prototype.generateKeyPair$int = function (aOrB) {
        return new SidhKeyPair(aOrB, this);
    };
    SidhKeyExchange.prototype.generateKeyPair$int$SidhPrivateKey = function (aOrB, prKey) {
        return new SidhKeyPair(aOrB, prKey, this);
    };
    SidhKeyExchange.prototype.generateKeyPair = function (aOrB, prKey) {
        if (((typeof aOrB === 'number') || aOrB === null) && ((prKey != null && prKey instanceof SidhPrivateKey) || prKey === null)) {
            return this.generateKeyPair$int$SidhPrivateKey(aOrB, prKey);
        }
        else if (((typeof aOrB === 'number') || aOrB === null) && prKey === undefined) {
            return this.generateKeyPair$int(aOrB);
        }
        else
            throw new Error('invalid overload');
    };
    SidhKeyExchange.prototype.calculateAgreementA = function (privKeyA, pubKeyB) {
        var i;
        var ii = 0;
        var row;
        var m;
        var index = 0;
        var ptsIdx;
        var npts = 0;
        var r;
        var pts;
        var aB;
        var pkB0;
        var pkB1;
        var pkB2;
        var two;
        var fourIsog;
        pkB0 = new F2elm(pubKeyB.getP());
        pkB1 = new F2elm(pubKeyB.getQ());
        pkB2 = new F2elm(pubKeyB.getD());
        aB = MontCurve.recoverA(pkB0, pkB1, pkB2);
        fourIsog = new FourIsogeny(aB);
        fourIsog.updateA24();
        two = F2elm.leftShift(F2elm.ONE_$LI$(), 1);
        fourIsog.setA24plus(F2elm.add(two, aB));
        fourIsog.setC24(F2elm.leftShift(two, 1));
        pts = (function (s) { var a = []; while (s-- > 0)
            a.push(null); return a; })(this.maxIntPointsA);
        ptsIdx = (function (s) { var a = []; while (s-- > 0)
            a.push(0); return a; })(this.maxIntPointsA);
        r = fourIsog.ladder3pt(pkB0, pkB1, pkB2, privKeyA.getKey(), this.obitsA);
        for (row = 1; row < this.maxA; row++) {
            {
                while ((index < this.maxA - row)) {
                    {
                        pts[npts] = r;
                        ptsIdx[npts++] = index;
                        m = this.splitsA[ii++];
                        r = fourIsog.xDble(r, 2 * m);
                        index += m;
                    }
                }
                ;
                fourIsog.get4Isog(r);
                for (i = 0; i < npts; i++) {
                    pts[i] = fourIsog.eval4Isog(pts[i]);
                }
                r = pts[npts - 1];
                index = ptsIdx[npts - 1];
                npts--;
            }
            ;
        }
        fourIsog.get4Isog(r);
        fourIsog.updateAC(4);
        return fourIsog.jInv().toByteArray();
    };
    SidhKeyExchange.prototype.calculateAgreementB = function (privKeyB, pubKeyA) {
        var i;
        var ii = 0;
        var row;
        var m;
        var index = 0;
        var ptsIdx;
        var npts = 0;
        var r;
        var pts;
        var pkA0;
        var pkA1;
        var pkA2;
        var aA;
        var temp;
        var threeIsog;
        pts = (function (s) { var a = []; while (s-- > 0)
            a.push(null); return a; })(this.maxIntPointsB);
        ptsIdx = (function (s) { var a = []; while (s-- > 0)
            a.push(0); return a; })(this.maxIntPointsB);
        pkA0 = pubKeyA.getP();
        pkA1 = pubKeyA.getQ();
        pkA2 = pubKeyA.getD();
        aA = MontCurve.recoverA(pkA0, pkA1, pkA2);
        threeIsog = new ThreeIsogeny(aA);
        threeIsog.updateA24();
        temp = F2elm.leftShift(F2elm.ONE_$LI$(), 1);
        threeIsog.setA24plus(F2elm.add(aA, temp));
        threeIsog.setA24minus(F2elm.sub(aA, temp));
        r = threeIsog.ladder3pt(pkA0, pkA1, pkA2, privKeyB.getKey(), this.obitsB);
        for (row = 1; row < this.maxB; row++) {
            {
                while ((index < this.maxB - row)) {
                    {
                        pts[npts] = r;
                        ptsIdx[npts++] = index;
                        m = this.splitsB[ii++];
                        r = threeIsog.xTple(r, m);
                        index += m;
                    }
                }
                ;
                threeIsog.get3Isog(r);
                for (i = 0; i < npts; i++) {
                    pts[i] = threeIsog.eval3Isog(pts[i]);
                }
                r = pts[npts - 1];
                index = ptsIdx[npts - 1];
                npts--;
            }
            ;
        }
        threeIsog.get3Isog(r);
        threeIsog.updateAC(3);
        return threeIsog.jInv().toByteArray();
    };
    return SidhKeyExchange;
}());
SidhKeyExchange.PARTYA = 0;
SidhKeyExchange.PARTYB = 1;
SidhKeyExchange["__class"] = "SidhKeyExchange";
var SidhPublicKey = (function () {
    function SidhPublicKey(aOrB, k, params) {
        var _this = this;
        if (((typeof aOrB === 'number') || aOrB === null) && ((k != null && k instanceof SidhPrivateKey) || k === null) && ((params != null && params instanceof SidhKeyExchange) || params === null)) {
            var __args = arguments;
            if (this.phiPx === undefined)
                this.phiPx = null;
            if (this.phiQx === undefined)
                this.phiQx = null;
            if (this.phiDx === undefined)
                this.phiDx = null;
            if (this.phiPx === undefined)
                this.phiPx = null;
            if (this.phiQx === undefined)
                this.phiQx = null;
            if (this.phiDx === undefined)
                this.phiDx = null;
            (function () {
                if (aOrB === SidhKeyExchange.PARTYA)
                    _this.genPubKeyA(k, params);
                else
                    _this.genPubKeyB(k, params);
            })();
        }
        else if (((aOrB != null && aOrB instanceof SidhPublicKey) || aOrB === null) && k === undefined && params === undefined) {
            var __args = arguments;
            var k_1 = __args[0];
            if (this.phiPx === undefined)
                this.phiPx = null;
            if (this.phiQx === undefined)
                this.phiQx = null;
            if (this.phiDx === undefined)
                this.phiDx = null;
            if (this.phiPx === undefined)
                this.phiPx = null;
            if (this.phiQx === undefined)
                this.phiQx = null;
            if (this.phiDx === undefined)
                this.phiDx = null;
            (function () {
                _this.phiPx = new F2elm(k_1.phiPx);
                _this.phiQx = new F2elm(k_1.phiQx);
                _this.phiDx = new F2elm(k_1.phiDx);
            })();
        }
        else if (((aOrB != null && aOrB instanceof Array && (aOrB.length == 0 || aOrB[0] == null || (typeof aOrB[0] === 'number'))) || aOrB === null) && k === undefined && params === undefined) {
            var __args = arguments;
            var inBytes_1 = __args[0];
            if (this.phiPx === undefined)
                this.phiPx = null;
            if (this.phiQx === undefined)
                this.phiQx = null;
            if (this.phiDx === undefined)
                this.phiDx = null;
            if (this.phiPx === undefined)
                this.phiPx = null;
            if (this.phiQx === undefined)
                this.phiQx = null;
            if (this.phiDx === undefined)
                this.phiDx = null;
            (function () {
                var len = ((inBytes_1.length) / 3 | 0);
                _this.phiPx = new F2elm(inBytes_1.slice( 0, len));
                _this.phiQx = new F2elm(inBytes_1.slice( len, 2 * len));
                _this.phiDx = new F2elm(inBytes_1.slice( 2 * len, 3 * len));
            })();
        }
        else
            throw new Error('invalid overload');
    }
    SidhPublicKey.prototype.getP = function () {
        return this.phiPx;
    };
    SidhPublicKey.prototype.getQ = function () {
        return this.phiQx;
    };
    SidhPublicKey.prototype.getD = function () {
        return this.phiDx;
    };
    SidhPublicKey.prototype.serialize = function () {
        var f2size = 2 * Felm.primesize;
        var retval = (function (s) { var a = []; while (s-- > 0)
            a.push(0); return a; })(3 * f2size);
        /* arraycopy */ (function (srcPts, srcOff, dstPts, dstOff, size) { if (srcPts !== dstPts || dstOff >= srcOff + size) {
            while (--size >= 0)
                dstPts[dstOff++] = srcPts[srcOff++];
        }
        else {
            var tmp = srcPts.slice(srcOff, srcOff + size);
            for (var i = 0; i < size; i++)
                dstPts[dstOff++] = tmp[i];
        } })(this.phiPx.toByteArray(), 0, retval, 0, f2size);
        /* arraycopy */ (function (srcPts, srcOff, dstPts, dstOff, size) { if (srcPts !== dstPts || dstOff >= srcOff + size) {
            while (--size >= 0)
                dstPts[dstOff++] = srcPts[srcOff++];
        }
        else {
            var tmp = srcPts.slice(srcOff, srcOff + size);
            for (var i = 0; i < size; i++)
                dstPts[dstOff++] = tmp[i];
        } })(this.phiQx.toByteArray(), 0, retval, f2size, f2size);
        /* arraycopy */ (function (srcPts, srcOff, dstPts, dstOff, size) { if (srcPts !== dstPts || dstOff >= srcOff + size) {
            while (--size >= 0)
                dstPts[dstOff++] = srcPts[srcOff++];
        }
        else {
            var tmp = srcPts.slice(srcOff, srcOff + size);
            for (var i = 0; i < size; i++)
                dstPts[dstOff++] = tmp[i];
        } })(this.phiDx.toByteArray(), 0, retval, 2 * f2size, f2size);
        return retval;
    };
    SidhPublicKey.prototype.publicKeyEquals = function (k2) {
        if (this.phiPx.f2Equals(k2.phiPx) === false)
            return false;
        if (this.phiQx.f2Equals(k2.phiQx) === false)
            return false;
        return this.phiDx.f2Equals(k2.phiDx);
    };
    SidhPublicKey.prototype.hashCode = function () {
        return java.util.Arrays.hashCode(this.serialize());
    };
    SidhPublicKey.prototype.genPubKeyA = function (privKey, params) {
        var curve;
        var fourIsog;
        var r;
        var phiP;
        var phiQ;
        var phiD;
        var pts;
        var invs;
        var coeffs;
        var genA;
        var genB;
        var maxIntPointsA;
        var maxA;
        var splitsA;
        var obits;
        var row;
        var index = 0;
        var npts = 0;
        var ptsIdx;
        var m;
        var i;
        var ii = 0;
        obits = params.getObitsA();
        curve = new MontCurve(params.getCurve());
        curve.updateA24();
        genA = params.getGenA();
        genB = params.getGenB();
        r = curve.ladder3pt(genA[0], genA[1], genA[2], privKey.getKey(), obits);
        phiP = new F2Point(genB[0], F2elm.ONE_$LI$());
        phiQ = new F2Point(genB[1], F2elm.ONE_$LI$());
        phiD = new F2Point(genB[2], F2elm.ONE_$LI$());
        fourIsog = new FourIsogeny(curve);
        fourIsog.setA24plus(new F2elm(F2elm.ONE_$LI$()));
        fourIsog.setC24(F2elm.leftShift(F2elm.ONE_$LI$(), 1));
        maxIntPointsA = params.getMIPA();
        maxA = params.getMaxA();
        splitsA = params.getSplitsA();
        pts = (function (s) { var a = []; while (s-- > 0)
            a.push(null); return a; })(maxIntPointsA);
        ptsIdx = (function (s) { var a = []; while (s-- > 0)
            a.push(0); return a; })(maxIntPointsA);
        for (row = 1; row < maxA; row++) {
            {
                while ((index < maxA - row)) {
                    {
                        pts[npts] = r;
                        ptsIdx[npts++] = index;
                        m = splitsA[ii++];
                        r = fourIsog.xDble(r, 2 * m);
                        index += m;
                    }
                }
                ;
                fourIsog.get4Isog(r);
                for (i = 0; i < npts; i++) {
                    pts[i] = fourIsog.eval4Isog(pts[i]);
                }
                phiP = fourIsog.eval4Isog(phiP);
                phiQ = fourIsog.eval4Isog(phiQ);
                phiD = fourIsog.eval4Isog(phiD);
                r = pts[npts - 1];
                index = ptsIdx[npts - 1];
                npts--;
            }
            ;
        }
        fourIsog.get4Isog(r);
        phiP = fourIsog.eval4Isog(phiP);
        phiQ = fourIsog.eval4Isog(phiQ);
        phiD = fourIsog.eval4Isog(phiD);
        invs = F2elm.inv3Way(phiP.getZ(), phiQ.getZ(), phiD.getZ());
        this.phiPx = F2elm.mult(invs[0], phiP.getX());
        this.phiQx = F2elm.mult(invs[1], phiQ.getX());
        this.phiDx = F2elm.mult(invs[2], phiD.getX());
    };
    SidhPublicKey.prototype.genPubKeyB = function (privKey, params) {
        var curve;
        var genA;
        var genB;
        var invs;
        var maxIntPointsB;
        var maxB;
        var splitsB;
        var obits;
        var row;
        var m;
        var index = 0;
        var ptsIdx;
        var npts = 0;
        var i;
        var ii = 0;
        var r;
        var phiP;
        var phiQ;
        var phiD;
        var pts;
        var threeIsog;
        obits = params.getObitsB();
        curve = new MontCurve(params.getCurve());
        curve.updateA24();
        genA = params.getGenA();
        genB = params.getGenB();
        r = curve.ladder3pt(genB[0], genB[1], genB[2], privKey.getKey(), obits);
        phiP = new F2Point(genA[0], F2elm.ONE_$LI$());
        phiQ = new F2Point(genA[1], F2elm.ONE_$LI$());
        phiD = new F2Point(genA[2], F2elm.ONE_$LI$());
        threeIsog = new ThreeIsogeny(curve);
        threeIsog.setA24plus(F2elm.leftShift(F2elm.ONE_$LI$(), 1));
        threeIsog.setA24minus(F2elm.negate(threeIsog.getA24plus()));
        maxIntPointsB = params.getMIPB();
        maxB = params.getMaxB();
        splitsB = params.getSplitsB();
        pts = (function (s) { var a = []; while (s-- > 0)
            a.push(null); return a; })(maxIntPointsB);
        ptsIdx = (function (s) { var a = []; while (s-- > 0)
            a.push(0); return a; })(maxIntPointsB);
        for (row = 1; row < maxB; row++) {
            {
                while ((index < maxB - row)) {
                    {
                        pts[npts] = r;
                        ptsIdx[npts++] = index;
                        m = splitsB[ii++];
                        r = threeIsog.xTple(r, m);
                        index += m;
                    }
                }
                ;
                threeIsog.get3Isog(r);
                for (i = 0; i < npts; i++) {
                    pts[i] = threeIsog.eval3Isog(pts[i]);
                }
                phiP = threeIsog.eval3Isog(phiP);
                phiQ = threeIsog.eval3Isog(phiQ);
                phiD = threeIsog.eval3Isog(phiD);
                r = pts[npts - 1];
                index = ptsIdx[npts - 1];
                npts--;
            }
            ;
        }
        threeIsog.get3Isog(r);
        phiP = threeIsog.eval3Isog(phiP);
        phiQ = threeIsog.eval3Isog(phiQ);
        phiD = threeIsog.eval3Isog(phiD);
        invs = F2elm.inv3Way(phiP.getZ(), phiQ.getZ(), phiD.getZ());
        this.phiPx = F2elm.mult(invs[0], phiP.getX());
        this.phiQx = F2elm.mult(invs[1], phiQ.getX());
        this.phiDx = F2elm.mult(invs[2], phiD.getX());
    };
    return SidhPublicKey;
}());
SidhPublicKey["__class"] = "SidhPublicKey";
var SidhKeyPair = (function () {
    function SidhKeyPair(aOrB, prKey, kex) {
        var _this = this;
        if (((typeof aOrB === 'number') || aOrB === null) && ((prKey != null && prKey instanceof SidhPrivateKey) || prKey === null) && ((kex != null && kex instanceof SidhKeyExchange) || kex === null)) {
            var __args = arguments;
            if (this.pubKey === undefined)
                this.pubKey = null;
            if (this.privKey === undefined)
                this.privKey = null;
            if (this.pubKey === undefined)
                this.pubKey = null;
            if (this.privKey === undefined)
                this.privKey = null;
            (function () {
                _this.privKey = new SidhPrivateKey(prKey);
                _this.pubKey = new SidhPublicKey(aOrB, _this.privKey, kex);
            })();
        }
        else if (((typeof aOrB === 'number') || aOrB === null) && ((prKey != null && prKey instanceof SidhKeyExchange) || prKey === null) && kex === undefined) {
            var __args = arguments;
            var kex_1 = __args[1];
            if (this.pubKey === undefined)
                this.pubKey = null;
            if (this.privKey === undefined)
                this.privKey = null;
            if (this.pubKey === undefined)
                this.pubKey = null;
            if (this.privKey === undefined)
                this.privKey = null;
            (function () {
                var order;
                if (aOrB === SidhKeyExchange.PARTYA)
                    order = kex_1.getOrderA();
                else
                    order = kex_1.getOrderB();
                _this.privKey = new SidhPrivateKey(aOrB, order);
                _this.pubKey = new SidhPublicKey(aOrB, _this.privKey, kex_1);
            })();
        }
        else
            throw new Error('invalid overload');
    }

    SidhKeyPair.prototype.getPublicKey = function () {
        return this.pubKey;
    };
    SidhKeyPair.prototype.getPrivateKey = function () {
        return this.privKey;
    };
    return SidhKeyPair;
}());
SidhKeyPair["__class"] = "SidhKeyPair";
var FourIsogeny = (function (_super) {
    __extends(FourIsogeny, _super);
    function FourIsogeny(ia) {
        var _this = this;
        if (((ia != null && ia instanceof F2elm) || ia === null)) {
            var __args = arguments;
            _this = _super.call(this) || this;
            if (_this.coeff === undefined)
                _this.coeff = null;
            if (_this.coeff === undefined)
                _this.coeff = null;
            (function () {
                _this.coeff = [null, null, null];
                _this.a = ia;
                _this.c = F2elm.ONE_$LI$();
            })();
        }
        else if (((ia != null && ia instanceof MontCurve) || ia === null)) {
            var __args = arguments;
            var curve_1 = __args[0];
            _this = _super.call(this) || this;
            if (_this.coeff === undefined)
                _this.coeff = null;
            if (_this.coeff === undefined)
                _this.coeff = null;
            (function () {
                _this.coeff = [null, null, null];
                _this.a = curve_1.a;
                _this.c = curve_1.c;
                _this.a24 = curve_1.a24;
                _this.c24 = curve_1.c24;
                _this.a24plus = curve_1.a24plus;
                _this.a24minus = curve_1.a24minus;
            })();
        }
        else
            throw new Error('invalid overload');
        return _this;
    }
    FourIsogeny.prototype.getCoeff = function () {
        return this.coeff;
    };
    FourIsogeny.prototype.get4Isog = function (p) {
        var px;
        var pz;
        px = p.getX();
        pz = p.getZ();
        this.coeff[1] = F2elm.sub(px, pz);
        this.coeff[2] = F2elm.add(px, pz);
        this.coeff[0] = F2elm.sqr(pz);
        this.coeff[0].f2LeftShiftInPlace(1);
        this.c24 = F2elm.sqr(this.coeff[0]);
        this.coeff[0].f2LeftShiftInPlace(1);
        this.a24plus = F2elm.sqr(px);
        this.a24plus.f2LeftShiftInPlace(1);
        this.a24plus.f2SqrInPlace();
    };
    FourIsogeny.prototype.eval4Isog = function (p) {
        var t0;
        var t1;
        var px;
        var pz;
        px = p.getX();
        pz = p.getZ();
        t0 = F2elm.add(px, pz);
        t1 = F2elm.sub(px, pz);
        px = F2elm.mult(t0, this.coeff[1]);
        pz = F2elm.mult(t1, this.coeff[2]);
        t0.f2MultInPlace(t1);
        t0.f2MultInPlace(this.coeff[0]);
        t1 = F2elm.add(px, pz);
        pz = F2elm.sub(px, pz);
        t1.f2SqrInPlace();
        pz.f2SqrInPlace();
        px = F2elm.add(t0, t1);
        t0 = F2elm.sub(pz, t0);
        px.f2MultInPlace(t1);
        pz.f2MultInPlace(t0);
        return new F2Point(px, pz);
    };
    return FourIsogeny;
}(MontCurve));
FourIsogeny["__class"] = "FourIsogeny";
var ThreeIsogeny = (function (_super) {
    __extends(ThreeIsogeny, _super);
    function ThreeIsogeny(ia) {
        var _this = this;
        if (((ia != null && ia instanceof F2elm) || ia === null)) {
            var __args = arguments;
            _this = _super.call(this) || this;
            if (_this.coeff === undefined)
                _this.coeff = null;
            if (_this.coeff === undefined)
                _this.coeff = null;
            (function () {
                _this.coeff = [null, null];
                _this.a = ia;
                _this.c = F2elm.ONE_$LI$();
            })();
        }
        else if (((ia != null && ia instanceof MontCurve) || ia === null)) {
            var __args = arguments;
            var curve_2 = __args[0];
            _this = _super.call(this) || this;
            if (_this.coeff === undefined)
                _this.coeff = null;
            if (_this.coeff === undefined)
                _this.coeff = null;
            (function () {
                _this.coeff = [null, null];
                _this.a = curve_2.a;
                _this.c = curve_2.c;
                _this.a24 = curve_2.a24;
                _this.c24 = curve_2.c24;
                _this.a24plus = curve_2.a24plus;
                _this.a24minus = curve_2.a24minus;
            })();
        }
        else
            throw new Error('invalid overload');
        return _this;
    }
    ThreeIsogeny.prototype.getCoeff = function () {
        return this.coeff;
    };
    ThreeIsogeny.prototype.get3Isog = function (p) {
        var t0;
        var t1;
        var t2;
        var t3;
        var t4;
        var px;
        var pz;
        px = p.getX();
        pz = p.getZ();
        this.coeff[0] = F2elm.sub(px, pz);
        t0 = F2elm.sqr(this.coeff[0]);
        this.coeff[1] = F2elm.add(px, pz);
        t1 = F2elm.sqr(this.coeff[1]);
        t2 = F2elm.add(t0, t1);
        t3 = F2elm.add(this.coeff[0], this.coeff[1]);
        t3.f2SqrInPlace();
        t3.f2SubInPlace(t2);
        t2 = F2elm.add(t1, t3);
        t3.f2AddInPlace(t0);
        t4 = F2elm.add(t0, t3);
        t4.f2LeftShiftInPlace(1);
        t4.f2AddInPlace(t1);
        this.a24minus = F2elm.mult(t2, t4);
        t4 = F2elm.add(t1, t2);
        t4.f2LeftShiftInPlace(1);
        t4.f2AddInPlace(t0);
        t4.f2MultInPlace(t3);
        t0 = F2elm.sub(t4, this.a24minus);
        this.a24plus = F2elm.add(t0, this.a24minus);
    };
    ThreeIsogeny.prototype.eval3Isog = function (q) {
        var t0;
        var t1;
        var t2;
        var qx;
        var qz;
        qx = q.getX();
        qz = q.getZ();
        t0 = F2elm.add(qx, qz);
        t1 = F2elm.sub(qx, qz);
        t0.f2MultInPlace(this.coeff[0]);
        t1.f2MultInPlace(this.coeff[1]);
        t2 = F2elm.add(t1, t0);
        t0 = F2elm.sub(t1, t0);
        t2.f2SqrInPlace();
        t0.f2SqrInPlace();
        qx.f2MultInPlace(t2);
        qz.f2MultInPlace(t0);
        return new F2Point(qx, qz);
    };
    return ThreeIsogeny;
}(MontCurve));