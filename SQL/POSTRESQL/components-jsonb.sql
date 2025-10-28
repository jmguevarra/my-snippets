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
  specific_attributes jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT components_pkey PRIMARY KEY (id)
  CONSTRAINT components_pkey_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.components(id),
);
CREATE INDEX idx_components_type ON components(type);
CREATE INDEX idx_components_specific_attrs_gin ON components USING GIN (specific_attributes);
