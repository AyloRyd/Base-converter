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

const copyButton = document.getElementById("copy-button");
copyButton.addEventListener("click", () => {
    const result = document.getElementById("result").textContent;
    if (result) {
        navigator.clipboard.writeText(result)
            .then(() => {
                const originalIcon = copyButton.innerHTML;
                copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z"/></svg>`;
                setTimeout(() => {
                    copyButton.innerHTML = originalIcon;
                }, 2000);
            })
            .catch((err) => alert("Failed to copy: " + err));
    }
});