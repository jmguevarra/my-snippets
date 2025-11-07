--params @p_system_design_id - UUID
--params @p_adder_set_id - UUID
--params @p_markup - nummeric



DECLARE 
  v_labour_cost NUMERIC(10, 2) := 0.00;
  v_component_cost NUMERIC(10, 2) := 0.00;
  v_adders_cost_before_tax NUMERIC(10, 2) := 0.00;
  v_adders_discounts_before_tax NUMERIC(10, 2) := 0.00;
  v_adders_cost_after_tax NUMERIC(10, 2) := 0.00;
  v_adders_discounts_after_tax NUMERIC(10, 2) := 0.00;
  v_base_cost NUMERIC(10, 2) := 0.00;
  v_sub_total NUMERIC(10, 2) := 0.00;
  v_sub_total_tax NUMERIC(10, 2) := 0.00;
  v_total_with_tax NUMERIC(10, 2) := 0.00;

  v_markup NUMERIC(10, 2) := 0.00;
  v_total NUMERIC(10, 2) := 0.00;
  v_grand_total NUMERIC(10, 2) := 0.00;
  v_total_watt NUMERIC(10, 2) := 0.00;
  v_cost_watt NUMERIC(10, 2) := 0.00;
  v_total_panel NUMERIC(10, 2) := 0.00;
  v_system_cost NUMERIC(10, 2) := 0.00;
BEGIN
  v_labour_cost := 0;

  -- 1. Component Cost
  SELECT 
    SUM(
      CASE 
        WHEN SDC.cost_type = 'Flat Rate' THEN COALESCE(C.cost_per_unit, 0)
        WHEN SDC.cost_type = '$/W' THEN 
          CASE 
            WHEN COALESCE(C.output_rating, 0) > 0 
              THEN COALESCE(C.cost_per_unit, 0) / COALESCE(C.output_rating, 1)
            ELSE 0
          END
        WHEN SDC.cost_type = 'Per kW' THEN COALESCE(C.cost_per_unit, 0) * (COALESCE(SDC.quantities, 0) * COALESCE(C.output_rating, 0) / 1000)
        ELSE COALESCE(C.cost_per_unit, 0) * COALESCE(SDC.quantities, 0)
      END
    )
  INTO v_component_cost 
  FROM system_design_components AS SDC
  LEFT JOIN components AS C ON C.id = SDC.component_id
  WHERE SDC.system_design_id = p_system_design_id::UUID::UUID;

  -- Total Wattage
  SELECT SUM(COALESCE(C.output_rating, 0) * COALESCE(SDC.quantities, 0))
  INTO v_total_watt
  FROM system_design_components AS SDC
  LEFT JOIN components AS C ON C.id = SDC.component_id
  WHERE SDC.system_design_id = p_system_design_id::UUID::UUID
    AND C.type IN ('Inverters', 'Panels');
  
  -- Total Panels (Panels only)
  SELECT SUM(COALESCE(SDC.quantities, 0))
  INTO v_total_panel
  FROM system_design_components AS SDC
  LEFT JOIN components AS C ON C.id = SDC.component_id
  WHERE SDC.system_design_id = p_system_design_id::UUID::UUID
    AND C.type ILIKE '%Panels%';

  v_system_cost := v_component_cost;

  -- 2. Adders Cost (Before Tax)
  SELECT COALESCE(SUM(
    CASE 
      WHEN formula = 'Per Watt' THEN cost::NUMERIC * v_total_watt
      WHEN formula = 'Per Panel' THEN cost::NUMERIC * v_total_panel
      WHEN formula IN ('Fixed Amount', 'Fixed') THEN cost::NUMERIC
      WHEN formula = 'Fixed %' THEN (cost::NUMERIC / 100.0) * v_system_cost
      ELSE 0
    END
  ), 0)
  INTO v_adders_cost_before_tax
  FROM adder_set_items
  WHERE adder_set_id = p_adder_set_id::UUID
    AND code NOT ILIKE '%discount%'
    AND formula NOT ILIKE '%Including Tax%';

  -- Discounts (Before Tax)
  SELECT COALESCE(SUM(
    CASE 
      WHEN formula = 'Per Watt' THEN cost::NUMERIC * v_total_watt
      WHEN formula = 'Per Panel' THEN cost::NUMERIC * v_total_panel
      WHEN formula IN ('Fixed Amount', 'Fixed') THEN cost::NUMERIC
      WHEN formula = 'Fixed %' THEN (cost::NUMERIC / 100.0) * v_system_cost
      ELSE 0
    END
  ), 0)
  INTO v_adders_discounts_before_tax
  FROM adder_set_items
  WHERE adder_set_id = p_adder_set_id::UUID
    AND code ILIKE '%discount%'
    AND formula NOT ILIKE '%Including Tax%';

  -- Base Cost = Components + Adders Before Tax - Discounts Before Tax
  v_base_cost := v_component_cost + v_adders_cost_before_tax;
  -- Subtotal before markup
  v_sub_total := v_base_cost + v_labour_cost;
  --markup computation
  v_markup := v_sub_total * (p_markup / 100);
  --total cost without tax
  v_total := v_sub_total + v_markup;
  -- Tax Computation (4.712%)
  v_sub_total_tax := v_total * 0.04712;
  -- Subtotal including tax
  v_total_with_tax := v_total + v_sub_total_tax;

  -- 3. Adders (After Tax)
  SELECT COALESCE(SUM(
    CASE 
      WHEN formula = 'Per Watt' THEN cost::NUMERIC * v_total_watt
      WHEN formula = 'Per Panel' THEN cost::NUMERIC * v_total_panel
      WHEN formula IN ('Fixed Amount', 'Fixed') THEN cost::NUMERIC
      WHEN formula IN ('Fixed %', 'Price Including Tax %') THEN (cost::NUMERIC / 100.0) * v_total_with_tax
      ELSE 0
    END
  ), 0)
  INTO v_adders_cost_after_tax
  FROM adder_set_items
  WHERE adder_set_id = p_adder_set_id::UUID
    AND code NOT ILIKE '%discount%'
    AND formula ILIKE '%Including Tax%';

  -- Discounts (After Tax)
  SELECT COALESCE(SUM(
    CASE 
      WHEN formula = 'Per Watt' THEN cost::NUMERIC * v_total_watt
      WHEN formula = 'Per Panel' THEN cost::NUMERIC * v_total_panel
      WHEN formula IN ('Fixed Amount', 'Fixed') THEN cost::NUMERIC
      WHEN formula IN ('Fixed %', 'Price Including Tax %') THEN (cost::NUMERIC / 100.0) * v_total_with_tax
      ELSE 0
    END
  ), 0)
  INTO v_adders_discounts_after_tax
  FROM adder_set_items
  WHERE adder_set_id = p_adder_set_id::UUID
    AND code ILIKE '%discount%'
    AND formula ILIKE '%Including Tax%';


  -- 4. Final Computation
  v_grand_total := v_total_with_tax
             + v_adders_cost_after_tax
             - ABS(v_adders_discounts_before_tax)
             - ABS(v_adders_discounts_after_tax);
            
  v_cost_watt := v_total/v_total_watt;

  RETURN jsonb_build_object(
    'labour_cost', v_labour_cost,
    'component_cost', v_component_cost,
    'adders_cost_before_tax', v_adders_cost_before_tax,
    'discount_before_tax', v_adders_discounts_before_tax,
    'base_cost', v_base_cost,
    'tax', v_sub_total_tax,
    'adders_cost_after_tax', v_adders_cost_after_tax,
    'discount_after_tax', v_adders_discounts_after_tax,
    'markup', v_markup,
    'total_watt',v_total_watt,
    'cost_watt', v_cost_watt,
    'total', v_total,
    'grand_total', v_grand_total
  );
END;
