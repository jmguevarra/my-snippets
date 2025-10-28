CREATE TABLE public.components (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  parent_id uuid NULL,
  type USER-DEFINED,
  code text NOT NULL,
  manufacturer text,
  sku text,
  output_rating numeric,
  weight numeric,
  height numeric,
  width numeric,
  thickness_depth numeric,
  cost_per_unit numeric,
  product_warranty_years numeric,
  performance_warranty text,
  addable_at_cost_stage boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT components_pkey PRIMARY KEY (id)
  CONSTRAINT components_pkey_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.components(id),
);

CREATE TABLE public.component_panels (
  id uuid NOT NULL,
  first_year_degradation numeric,
  annual_degradation numeric,
  max_power_voltage numeric,
  max_power_current numeric,
  short_circuit_current numeric,
  open_circuit_voltage numeric,
  nominal_operating_temperature numeric,
  temp_coefficient_voc numeric,
  temp_coefficient_isc numeric,
  temp_coefficient_pmax numeric,
  cells_in_series integer,
  bifaciality boolean,
  transmission numeric,
  technology text,
  CONSTRAINT component_panels_pkey PRIMARY KEY (id)
  CONSTRAINT component_panels_id_fkey FOREIGN KEY (id) REFERENCES public.components(id)
);

CREATE TABLE public.component_batteries (
  id uuid NOT NULL,
  effiency_percent numeric,
  no_mppts numeric,
  rated_output_voltage_ac numeric,
  rated_input_voltage numeric,
  max_input_voltage numeric,
  min_input_voltage numeric,
  mppt_max_input_voltage numeric,
  mppt_min_input_voltage numeric,
  dc_maximum_current_amps numeric,
  ac_max_amps numeric,
  current_isc_max_amps numeric,
  phase_type text,
  CONSTRAINT component_batteries_pkey PRIMARY KEY (id)
  CONSTRAINT component_batteries_id_fkey FOREIGN KEY (id) REFERENCES public.components(id)
);

CREATE TABLE public.component_inverters (
  id uuid NOT NULL,
  total_energy numeric,
  end_life_capacity numeric,
  depth_charge numeric,
  roundtrip_efficiency numeric,
  nominal_voltage numeric,
  CONSTRAINT component_inverters_pkey PRIMARY KEY (id)
  CONSTRAINT component_inverters_id_fkey FOREIGN KEY (id) REFERENCES public.components(id)
);
