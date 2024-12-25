import { convertBase } from './convertBase.js';

document.getElementById('converter-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const number = document.getElementById('number').value;
    const fromBase = parseInt(document.getElementById('from-base').value, 10);
    const toBase = parseInt(document.getElementById('to-base').value, 10);

    try {
        const result = convertBase(number, fromBase, toBase);
        document.getElementById('result').textContent = result;
    } catch (error) {
        document.getElementById('result').textContent = `Error: ${error.message}`;
    }
});