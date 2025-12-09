/**
 * Compute Lease Payments with Escalator, Broker Fee, and Dealer Fee (flat or %)
 * Uses discounted cash flow to solve for the initial payment.
 */
function computeLease({
  systemCost,
  upfront,
  brokerRate,
  dealerFeeType,  // 'flat' or 'percent'
  dealerFee,
  interestRate,   // APR % per annum
  escalator,      // % per annum
  termYears,
}) {
  // Round helper
  const to2 = (x) => Number(x.toFixed(2));

  // 1. Base lease amount
  const leaseAmount = systemCost - upfront;

  // 2. Broker fee
  const brokerFee = leaseAmount * (brokerRate / 100);

  // 3. Dealer fee
  let dealerFeeAmount = 0;
  if (dealerFeeType === "flat") {
    dealerFeeAmount = dealerFee;
  } else if (dealerFeeType === "percent") {
    dealerFeeAmount = leaseAmount * (dealerFee / 100);
  }

  // 4. Total financed amount
  const financed = leaseAmount + brokerFee + dealerFeeAmount;

  // 5. Convert APR to monthly effective rate
  const r = Math.pow(1 + interestRate / 100, 1 / 12) - 1;

  // 6. Convert annual escalator (%) to monthly growth factor
  const escalatorMonthly = Math.pow(1 + escalator / 100, 1 / 12);

  // 7. Total number of monthly payments
  const n = termYears * 12;

  /**
   * 8. Solve for the initial payment using PV of escalating payments:
   *
   * PV = Σ [ (P0 * escalatorMonthly^(m-1)) / (1+r)^m ]
   *
   * P0 is the initial payment we solve for.
   */
  let pvFactorSum = 0;
  for (let m = 1; m <= n; m++) {
    const growth = Math.pow(escalatorMonthly, m - 1); // escalated payment factor
    const discount = Math.pow(1 + r, m);              // discount factor
    pvFactorSum += growth / discount;
  }

  // Initial monthly payment P0
  const initialPayment = financed / pvFactorSum;

  // 9. Compute total of all escalating payments
  let totalPayments = 0;
  for (let m = 1; m <= n; m++) {
    totalPayments += initialPayment * Math.pow(escalatorMonthly, m - 1);
  }

  // 10. Total preview = upfront + total payments
  const totalPreview = upfront + totalPayments;

  return {
    financedAmount: to2(financed),
    startingMonthlyPayment: to2(initialPayment),
    totalPayments: to2(totalPayments),
    totalPreview: to2(totalPreview),
  };
}
