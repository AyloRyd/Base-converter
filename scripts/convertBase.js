export function convertBase(number, fromBase, toBase) {
    const isNegative = number.startsWith("-");
    if (isNegative) {
        number = number.slice(1); 
    }

    let decimalValue = toDecimal(number, fromBase);
    if (isNegative) {
        decimalValue = -decimalValue;
    }

    return isNegative && toBase === 2 ? toTwoComplement(decimalValue, 32) : fromDecimal(decimalValue, toBase);
}

function toDecimal(num, base) {
    if (num.includes(".")) {
        throw new Error("fractional numbers are not supported");
    }

    let decimal = 0;
    let power = 0;
    for (let i = num.length - 1; i >= 0; i--) {
        let digit = num[i].toUpperCase().charCodeAt(0);
        if (digit >= 48 && digit <= 57) {
            digit -= 48; 
        } else if (digit >= 65 && digit <= 90) {
            digit -= 55;
        } else {
            throw new Error("invalid character in number");
        }
        if (digit >= base) {
            throw new Error("digit out of range for base");
        }
        decimal += digit * Math.pow(base, power);
        power++;
    }
    return decimal;
}

function fromDecimal(decimal, base) {
    if (decimal === 0) return "0";
    const isNegative = decimal < 0;
    if (isNegative) {
        decimal = -decimal;
    }

    let result = "";
    while (decimal > 0) {
        let remainder = decimal % base;
        let digit = remainder < 10 ? String.fromCharCode(48 + remainder) : String.fromCharCode(55 + remainder);
        result = digit + result;
        decimal = Math.floor(decimal / base);
    }

    return isNegative ? "-" + result : result;
}

function toTwoComplement(decimal, bitSize) {
    if (decimal >= 0) {
        return groupBinary(fromDecimal(decimal, 2).padStart(bitSize, "0"));
    }
    const maxValue = Math.pow(2, bitSize);
    const complementValue = maxValue + decimal; 
    return groupBinary(fromDecimal(complementValue, 2).padStart(bitSize, "0"));
}

function groupBinary(binaryString) {
    return binaryString.replace(/(.{4})/g, "$1 ").trim(); 
}