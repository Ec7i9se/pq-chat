
var hash = function(msg, msg_type, output_type) {
  let hash_type = 'SHA-256';
  msg_type = msg_type || 'TEXT';
  output_type = output_type || 'HEX';

  if (typeof msg !== 'string') {
    msg = JSON.stringify(msg);
  }
  // var hashObj = new jsSHA(hash_type, msg_type);
  // hashObj.update(msg);

  return sha256.hex(msg).slice(0, 32);

  // return hashObj.getHash(output_type).slice(0, 32);
};

var random32Bytes = function() {

  let random = new SecureRandom();

  let randBytes = new Array(32);
  return random.nextBytes(randBytes);


  // let secureRandom = new SecureRandom();
  // return secureRandom.randomArray(32);
};

var random32ByteString = function() {
  let random = new SecureRandom();

  let randBytes = new Array(32);
  random.nextBytes(randBytes);


  return randBytes.reduce(function(str, byte) {
    return (str += String.fromCharCode(byte));
  }, '')
};

var randomString2Bytes = function(str) {
  return str.split('').reduce(function(arr, char) {
    return arr.push(char.charCodeAt(0))
  }, [])
};

var char2Byte = function(char) {
  var binary = char.charCodeAt(0).toString(2);
  while (binary.length < 8) {
    binary = '0' + binary;
  }
  return binary;
};

var eachBit = function(msg, callback) {
  var msgArr = msg.split('');
  msgArr.forEach(function(char, charIdx) {
    var bits = char2Byte(char).split('');
    bits.forEach(function(bit, bitIdx) {
      bitIdx = (charIdx * 8) + bitIdx;
      callback (bit, bitIdx);
    });
  });
};

class LamportKeypair {
  constructor() {
    this._privKey = [];
    this.pubKey = [];
    this.used = false;

    for (var i = 0; i < 256; i++) {
      var num1 = random32ByteString();
      var num2 = random32ByteString();
      var hash1 = hash(num1);
      var hash2 = hash(num2);

      this._privKey.push([num1, num2]);
      this.pubKey.push([hash1, hash2]);
    }
  }

  sign(msg) {
    var msgHash = hash(msg);
    var signature = [];

    var that = this;
    eachBit(msgHash, function(bit, bitIdx) {
      signature.push( that._privKey[bitIdx][bit] );
    });

    return signature;
  }

  verify(msg, signature) {
    var msgHash = hash(msg);
    var authentic = true;

    // TODO: BREAK OUT THE MINUTE THE SIGNATURE HASH DONT MATCH THE PUBKEY
    var that = this;
    eachBit(msgHash, function(bit, bitIdx) {
      if (hash(signature[bitIdx]) !== that.pubKey[bitIdx][bit]) {
        authentic = false;
      }
    });
    return authentic;
  }
}

'use strict';

var KEYNUM = 4;

var parentIdx = function(idx) {
  return Math.ceil((idx + 1)/2) - 1;
};

class MerkleKeyTree {
  constructor(keyNum) {
    this.size = keyNum || KEYNUM;
    this._leaves = [];
    this.usedKeyCount = 0;
    var firstRow = [];
    for (var leafNum = 0; leafNum < this.size; leafNum++) {
      // var keypair = lamport.generate();
      var keypair = new LamportKeypair();
      this._leaves.push(keypair);
      firstRow.push( hash(keypair.pubKey) );
      // firstRow.push( i );
    }

    this.levels = [firstRow];

    var levels = Math.ceil(Math.log2(this.size));
    for (var i = 1; i <= levels; i++) {
      // for each level in the tree
      var curRow = [];
      var prevRow = this.levels[i-1];
      for (var k = 0; k < prevRow.length; k += 2) {
        // for each hash in the previous row
        // hash(its and next hash's values)
        var h = hash(prevRow[k] + prevRow[k+1]);
        curRow.push(h);
      }

      this.levels[i] = curRow;
    }

    this.numOfLevels = this.levels.length;
    this.numOfKeys = this._leaves.length;
    this.topHash = this.levels[this.levels.length - 1][0];
  }

  sign(msg) {
    // returns the original sig plus a list of nodes
    // might have to return the pubkey as well
    var finalSig = {};

    if (this.usedKeyCount === this.size - 1) {
      // TODO: GIVE USER WARNING INSTEAD OF THROWING AN ERROR
      throw new Error('This is your last keypair on this tree, USE IT WISELY');
    }

    for (var i = 0; i < this.numOfKeys; i++) {
      if (!this._leaves[i].used) {
        var randomKeypair = this._leaves[i];
        var randomKeypairIndex = i;
        break;
      }
    }

    finalSig.keyPairId = randomKeypairIndex;
    finalSig.pubKey = randomKeypair.pubKey;
    finalSig.message = msg;
    finalSig.signature = randomKeypair.sign(msg);
    finalSig.path = [];

    var curLevel = 0;
    var idx = randomKeypairIndex;
    while (curLevel < this.numOfLevels) {
      if (idx % 2) {
        finalSig.path.push(this.levels[curLevel][idx - 1])
      } else {
        finalSig.path.push(this.levels[curLevel][idx + 1])
      }
      curLevel++;
      idx = parentIdx(idx);
    }

    finalSig.path[finalSig.path.length - 1] = this.topHash;
    randomKeypair.used = true;
    this.usedKeyCount++;
    return finalSig;
  }

  verify(msg, sigObj) {
    var idx = sigObj.keyPairId;
    var lamport = this._leaves[idx];
    if (lamport.verify(msg, sigObj.signature)) {

      var h = hash(sigObj.pubKey);
      for (var i = 0; i < sigObj.path.length - 1; i++) {
        var auth = sigObj.path[i];
        if (idx % 2) {
          h = hash(auth + h);
        } else {
          h = hash(h + auth);
        }
        idx = parentIdx(idx);
      }

      if (h === sigObj.path[sigObj.path.length - 1]) {
        return true;
      }
    }
    return false;
  }
}

window.MerkleKeyTree = MerkleKeyTree;
