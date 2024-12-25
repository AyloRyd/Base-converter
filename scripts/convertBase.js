export function convertBase(number, fromBase, toBase) {
    const isNegative = number.startsWith("-");
    if (isNegative) {
        number = number.slice(1); 
    }

    let decimalValue = toDecimal(number, fromBase);
    if (isNegative) {
        decimalValue = -decimalValue;
    }

    return toBase === 2 
        ? formatBinary(toTwoComplement(decimalValue)) 
        : formatNonBinary(fromDecimal(decimalValue, toBase), toBase);
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
    decimal = BigInt(decimal); 
    base = BigInt(base);

    if (decimal === 0n) return "0";

    const isNegative = decimal < 0n;
    if (isNegative) {
        decimal = -decimal;
    }

    let result = "";
    while (decimal > 0n) {
        const remainder = decimal % base;
        const digit = remainder < 10n
            ? String.fromCharCode(48 + Number(remainder)) 
            : String.fromCharCode(55 + Number(remainder)); 
        result = digit + result;
        decimal = decimal / base;
    }

    return isNegative ? "-" + result : result;
}

function toTwoComplement(decimal) {
    let binary = fromDecimal(BigInt(decimal), 2);

    if (decimal >= 0) {
        const requiredBits = Math.ceil(binary.length / 4) * 4; 
        binary = binary.padStart(requiredBits, "0");
    } else {
        let bitSize = Math.ceil(binary.length / 4) * 4; 
        while (true) {
            const maxValue = BigInt(2) ** BigInt(bitSize);
            const complementValue = maxValue + BigInt(decimal);
            binary = fromDecimal(complementValue, 2).padStart(bitSize, "0");
            if (binary.length <= bitSize) break;
            bitSize += 4;
        }
    }

    return binary;
}

function formatBinary(binaryString) {
    const reversed = binaryString.split("").reverse();
    const grouped = reversed.map((char, index) => (index > 0 && index % 4 === 0 ? char + " " : char)).reverse().join("").trim();
    const groupedWithLines = grouped.split(" ").reduce((acc, group, index) => {
        return acc + group + ((index + 1) % 8 === 0 ? "\n" : " ");
    }, "").trim();

    return groupedWithLines;
}

function formatNonBinary(output, base) {
    if (base !== 2) {
        const lines = output.match(/.{1,42}/g).join("\n");
        return lines;
    }
    return output;
}