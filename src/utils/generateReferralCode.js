exports.generateReferralCode = () => {
  return "HAW-REF-" + Math.random().toString(36).substring(2, 6).toUpperCase();
};
