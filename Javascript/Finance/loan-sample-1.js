// Utility for rounding
const to2 = (num) => Number(num.toFixed(2));

/**
 * Compute loan payment including dealer fee and its adjustment
 * 
 * @param {number} grand_total - Total system cost
 * @param {number} upfront - Upfront payment
 * @param {number} term_years - Loan term in years
 * @param {number} interest_rate - Annual interest rate (%)
 * @param {number} reversion_rate - Annual reversion rate (%)
 * @param {number} reversion_period_start - Month when reversion starts
 * @param {number} dealerFee - Dealer fee value (flat or %)
 * @param {boolean} isDealerFeePercent - true if dealerFee is % of loan amount, false if flat
 * @param {number} dealerFeeAdjustment - Dealer fee adjustment % (e.g., 1.5 for +1.5%)
 */
function computeLoanWithDealerFee({
  grand_total,
  upfront,
  term_years,
  interest_rate,
  reversion_rate,
  reversion_period_start,
  dealerFee = 0,
  isDealerFeePercent = false,
  dealerFeeAdjustment = 0
}) {
  // Total loan amount after upfront
  let loanAmount = grand_total - upfront;

  // Apply dealer fee
  let feeAmount = isDealerFeePercent
    ? (loanAmount * dealerFee) / 100
    : dealerFee;

  // Apply dealer fee adjustment
  feeAmount = feeAmount * (1 + dealerFeeAdjustment / 100);

  loanAmount += feeAmount; // Include dealer fee in loan amount

  const totalMonths = term_years * 12;
  const revertStart = reversion_period_start;

  // Convert % to decimal monthly rate
  const monthlyRate1 = (interest_rate / 100) / 12;
  const monthlyRate2 = (reversion_rate / 100) / 12;

  const monthsPhase1 = revertStart - 1; 
  const monthsPhase2 = totalMonths - monthsPhase1;

  // Amortization monthly payment formula
  function calcMonthly(P, r, n) {
    return P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  }

  // Phase 1 payment
  const monthlyPayment1 = calcMonthly(loanAmount, monthlyRate1, totalMonths);

  // Remaining balance after Phase 1
  function remainingBalance(P, r, paymentsMade) {
    return P * Math.pow(1 + r, paymentsMade) -
      monthlyPayment1 * ((Math.pow(1 + r, paymentsMade) - 1) / r);
  }

  const balanceAfterPhase1 = remainingBalance(
    loanAmount,
    monthlyRate1,
    monthsPhase1
  );

  // Phase 2 payment
  const monthlyPayment2 = calcMonthly(balanceAfterPhase1, monthlyRate2, monthsPhase2);

  // Total preview
  const totalPreview =
    upfront +
    feeAmount + // Add dealer fee explicitly
    (monthlyPayment1 * monthsPhase1) +
    (monthlyPayment2 * monthsPhase2);

  return {
    monthlyPaymentBeforeReversion: to2(monthlyPayment1),
    monthlyPaymentAfterReversion: to2(monthlyPayment2),
    totalPreview: to2(totalPreview),
    balanceAfterReversionStart: to2(balanceAfterPhase1),
    dealerFeeApplied: to2(feeAmount)
  };
}
