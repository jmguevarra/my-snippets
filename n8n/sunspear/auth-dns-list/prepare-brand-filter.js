const items = $input.first().json.data.boards[0].items_page.items || [];

const brands = items.map(brand => {
  const getChecked = id => JSON.parse(brand.column_values.find(c => c.id === id)?.value || "{}").checked === true;

  const auth = getChecked("boolean_mm16wr1g");
  const dns = getChecked("boolean_mm16vrs2");
  
  return {
      brandId: brand.id,
      brandName: brand.name,
      state: brand.state,
      includeToAuth: auth,
      includeToDNS: dns
    };
}).filter(b => b.state === "active" && (b.includeToDNS || b.includeToAuth));

//folder name
const now = new Date();
const centralTime =  now.toLocaleString("sv-SE", { 
    timeZone: "America/Chicago", 
    hour12: false, 
    year: "numeric", 
    month: "2-digit", 
    day: "2-digit", 
    hour: "2-digit", 
    minute: "2-digit" 
}).replace("T", " ").replace(",", "");
const folderParentId = '1Y73yLCCRaXKqvBgcIPIL3EyVWnNxwBJh';


return [{ 
  json: { 
    brands,
    hasBrands: brands.length > 0,
    brandsLength: brands.length,
    folderName: centralTime,
    folderParentId
  } 
}];
