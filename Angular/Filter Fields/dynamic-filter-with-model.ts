filterByFields(fields: SiteColumnFilter['selectedField'][], data: DashboardAccount[]): DashboardAccount[]{
    let filteredDashboardItem = data;
    fields.forEach(filterField => {
      let preFilter = filteredDashboardItem.filter(x => {
        const keys = Object.keys(x);
        const values = Object.values(x);
        const modelIndex = keys.findIndex(i => i === filterField.modelPropertyName);
        console.log(filterField.value);
        return values[modelIndex] === filterField.value ? true : !filterField.value ? true : false;
      });
      filteredDashboardItem = preFilter
    });
    return filteredDashboardItem;
  }
