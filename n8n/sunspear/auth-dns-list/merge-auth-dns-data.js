function safeFirst(nodeName) {
  try {
    return $(nodeName).first().json;
  } catch (e) {
    return {};
  }
}

const input = $('Brand Loop').first().json;
const brandId = input.brandId;
const brandName = input.brandName;

const authSheet = safeFirst('Create Auth Reseller Sheet');
const dnsSheet = safeFirst('Create DNS Sheet');

let authProductLines = [];

try {
  const productLines = $('Fetch Product Lines').first()
    ?.json?.data?.boards?.[0]?.items_page?.items ?? [];

  authProductLines = productLines.sort((a, b) => Number(b.id) - Number(a.id));
} catch (e) {
  authProductLines = [];
}

return [{
  json: {
    brandName,
    brandId,
    authSheetId: authSheet.id || "",
    dnsSheetId: dnsSheet.id || "",
    authProductLines,
    includeToAuth: input.includeToAuth,
    includeToDns: input.includeToDNS
  }
}];
