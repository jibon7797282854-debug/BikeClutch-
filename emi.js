/**
 * emi.js - EMI Calculator logic
 */

window.EMI = (function() {
    function calculate(principal, monthlyRate, months) {
        if (monthlyRate === 0) return principal / months;
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
        return emi;
    }

    return { calculate };
})();