  static productTypeOptions: SiteColumnFilter["fieldOptions"][] = [
    { label: 'Electricity',    value: 'ELECTRICITY' },
    { label: 'Natural Gas',    value: 'NATURAL GAS' },
    { label: 'All',                 value: '' },
  ];
  static tenderAsOptions: SiteColumnFilter['fieldOptions'][] =  [
    { label: 'Large',       value: 'LARGE' },
    { label: 'Small',       value: 'SMALL' },
    { label: 'All',       value: '' },
  ];
  static OppOwnerOptions: SiteColumnFilter['fieldOptions'][] =  [
    { label: 'All',       value: '' },
    { label: 'Me',       value: 'Me' },
    { label: 'Me1',       value: 'Me1' },
  ];
  static dashboardPicklistFilters: SiteColumnFilter['fieldInput'][] = [
    { name:'product-category',    fieldLabel: 'Product Category',   options: this.productTypeOptions, withCheckbox: false, isMultiple: false, labelAsPlaceholder: true},
    { name:'tender-as',     fieldLabel: 'Tender As',          options: this.tenderAsOptions, withCheckbox: false, isMultiple: false, labelAsPlaceholder: true},
   // { name:'opp-owner',     fieldLabel: 'Owner',          options: this.OppOwnerOptions, withCheckbox: true, isMultiple: true, labelAsPlaceholder: true}
  ];
  static selectedSiteColumnFilter: SiteColumnFilter['selectedField'][] = [ //default seelected site column filter
    { modelPropertyName: 'productCategory', fieldName: this.dashboardPicklistFilters[0].name, value: this.productTypeOptions[0].value},
    { modelPropertyName: 'tenderAs', fieldName: this.dashboardPicklistFilters[1].name, value: this.tenderAsOptions[0].value},
   // { modelPropertyName: 'OppOwner', fieldName: this.dashboardPicklistFilters[2].name, value: ['']},
  ]
