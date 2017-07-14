/* MD5 Message-Digest Algorithm - JavaScript
 ' MODIFICATION HISTORY:
 ' 1.0 16-Feb-2001 - Phil Fresle (sales@frez.co.uk) - Initial Version
 ' 1.0 21-Feb-2001 - Enrico Mosanghini (erik504@yahoo.com) - JavaScript porting
 */
function toMD5(sMessage) {
	function RotateLeft(lValue, iShiftBits) {
		return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
	}
	function AddUnsigned(lX, lY) {
		var lX4, lY4, lX8, lY8, lResult;
		lX8 = (lX & 2147483648);
		lY8 = (lY & 2147483648);
		lX4 = (lX & 1073741824);
		lY4 = (lY & 1073741824);
		lResult = (lX & 1073741823) + (lY & 1073741823);
		if (lX4 & lY4) {
			return (lResult ^ 2147483648 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 1073741824) {
				return (lResult ^ 3221225472 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 1073741824 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
	}
	function F(x, y, z) {
		return (x & y) | ((~x) & z);
	}
	function G(x, y, z) {
		return (x & z) | (y & (~z));
	}
	function H(x, y, z) {
		return (x ^ y ^ z);
	}
	function I(x, y, z) {
		return (y ^ (x | (~z)));
	}
	function FF(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	}
	function GG(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	}
	function HH(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	}
	function II(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	}
	function ConvertToWordArray(sMessage) {
		var lWordCount;
		var lMessageLength = sMessage.length;
		var lNumberOfWords_temp1 = lMessageLength + 8;
		var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
		var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
		var lWordArray = Array(lNumberOfWords - 1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while (lByteCount < lMessageLength) {
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (sMessage.charCodeAt(lByteCount) << lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount - (lByteCount % 4)) / 4;
		lBytePosition = (lByteCount % 4) * 8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (128 << lBytePosition);
		lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
		lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
		return lWordArray;
	}
	function WordToHex(lValue) {
		var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
		for (lCount = 0; lCount <= 3; lCount++) {
			lByte = (lValue >>> (lCount * 8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
		}
		return WordToHexValue;
	}
	var x = Array();
	var k, AA, BB, CC, DD, a, b, c, d;
	var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
	var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
	var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
	var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
	// Steps 1 and 2. Append padding bits and length and convert to words
	x = ConvertToWordArray(sMessage);
	// Step 3. Initialise
	a = 1732584193;
	b = 4023233417;
	c = 2562383102;
	d = 271733878;
	// Step 4. Process the message in 16-word blocks
	for (k = 0; k < x.length; k += 16) {
		AA = a;
		BB = b;
		CC = c;
		DD = d;
		a = FF(a, b, c, d, x[k + 0], S11, 3614090360);
		d = FF(d, a, b, c, x[k + 1], S12, 3905402710);
		c = FF(c, d, a, b, x[k + 2], S13, 606105819);
		b = FF(b, c, d, a, x[k + 3], S14, 3250441966);
		a = FF(a, b, c, d, x[k + 4], S11, 4118548399);
		d = FF(d, a, b, c, x[k + 5], S12, 1200080426);
		c = FF(c, d, a, b, x[k + 6], S13, 2821735955);
		b = FF(b, c, d, a, x[k + 7], S14, 4249261313);
		a = FF(a, b, c, d, x[k + 8], S11, 1770035416);
		d = FF(d, a, b, c, x[k + 9], S12, 2336552879);
		c = FF(c, d, a, b, x[k + 10], S13, 4294925233);
		b = FF(b, c, d, a, x[k + 11], S14, 2304563134);
		a = FF(a, b, c, d, x[k + 12], S11, 1804603682);
		d = FF(d, a, b, c, x[k + 13], S12, 4254626195);
		c = FF(c, d, a, b, x[k + 14], S13, 2792965006);
		b = FF(b, c, d, a, x[k + 15], S14, 1236535329);
		a = GG(a, b, c, d, x[k + 1], S21, 4129170786);
		d = GG(d, a, b, c, x[k + 6], S22, 3225465664);
		c = GG(c, d, a, b, x[k + 11], S23, 643717713);
		b = GG(b, c, d, a, x[k + 0], S24, 3921069994);
		a = GG(a, b, c, d, x[k + 5], S21, 3593408605);
		d = GG(d, a, b, c, x[k + 10], S22, 38016083);
		c = GG(c, d, a, b, x[k + 15], S23, 3634488961);
		b = GG(b, c, d, a, x[k + 4], S24, 3889429448);
		a = GG(a, b, c, d, x[k + 9], S21, 568446438);
		d = GG(d, a, b, c, x[k + 14], S22, 3275163606);
		c = GG(c, d, a, b, x[k + 3], S23, 4107603335);
		b = GG(b, c, d, a, x[k + 8], S24, 1163531501);
		a = GG(a, b, c, d, x[k + 13], S21, 2850285829);
		d = GG(d, a, b, c, x[k + 2], S22, 4243563512);
		c = GG(c, d, a, b, x[k + 7], S23, 1735328473);
		b = GG(b, c, d, a, x[k + 12], S24, 2368359562);
		a = HH(a, b, c, d, x[k + 5], S31, 4294588738);
		d = HH(d, a, b, c, x[k + 8], S32, 2272392833);
		c = HH(c, d, a, b, x[k + 11], S33, 1839030562);
		b = HH(b, c, d, a, x[k + 14], S34, 4259657740);
		a = HH(a, b, c, d, x[k + 1], S31, 2763975236);
		d = HH(d, a, b, c, x[k + 4], S32, 1272893353);
		c = HH(c, d, a, b, x[k + 7], S33, 4139469664);
		b = HH(b, c, d, a, x[k + 10], S34, 3200236656);
		a = HH(a, b, c, d, x[k + 13], S31, 681279174);
		d = HH(d, a, b, c, x[k + 0], S32, 3936430074);
		c = HH(c, d, a, b, x[k + 3], S33, 3572445317);
		b = HH(b, c, d, a, x[k + 6], S34, 76029189);
		a = HH(a, b, c, d, x[k + 9], S31, 3654602809);
		d = HH(d, a, b, c, x[k + 12], S32, 3873151461);
		c = HH(c, d, a, b, x[k + 15], S33, 530742520);
		b = HH(b, c, d, a, x[k + 2], S34, 3299628645);
		a = II(a, b, c, d, x[k + 0], S41, 4096336452);
		d = II(d, a, b, c, x[k + 7], S42, 1126891415);
		c = II(c, d, a, b, x[k + 14], S43, 2878612391);
		b = II(b, c, d, a, x[k + 5], S44, 4237533241);
		a = II(a, b, c, d, x[k + 12], S41, 1700485571);
		d = II(d, a, b, c, x[k + 3], S42, 2399980690);
		c = II(c, d, a, b, x[k + 10], S43, 4293915773);
		b = II(b, c, d, a, x[k + 1], S44, 2240044497);
		a = II(a, b, c, d, x[k + 8], S41, 1873313359);
		d = II(d, a, b, c, x[k + 15], S42, 4264355552);
		c = II(c, d, a, b, x[k + 6], S43, 2734768916);
		b = II(b, c, d, a, x[k + 13], S44, 1309151649);
		a = II(a, b, c, d, x[k + 4], S41, 4149444226);
		d = II(d, a, b, c, x[k + 11], S42, 3174756917);
		c = II(c, d, a, b, x[k + 2], S43, 718787259);
		b = II(b, c, d, a, x[k + 9], S44, 3951481745);
		a = AddUnsigned(a, AA);
		b = AddUnsigned(b, BB);
		c = AddUnsigned(c, CC);
		d = AddUnsigned(d, DD);
	}
	// Step 5. Output the 128 bit digest
	var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
	return temp.toLowerCase();
}

// js获取项目根路径，如： http://localhost:8083/uimcardprj
function getRootPath() {
	
	var curentWindow = window;
	while (curentWindow != curentWindow.parent) {
		curentWindow = curentWindow.parent;
	}
	
	// 获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
	var curWwwPath = curentWindow.document.location.href;
	// 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
	var pathName = curentWindow.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName);
	// 获取主机地址，如： http://localhost:8083
	var localhostPaht = curWwwPath.substring(0, pos);
	// 获取带"/"的项目名，如：/uimcardprj
	var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
	return (localhostPaht + projectName);

}
function getParam(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
