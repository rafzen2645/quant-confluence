-- Create predictions table to store AI analysis and outcomes
CREATE TABLE public.predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chart_features JSONB NOT NULL, -- stores pattern, trend, zone, momentum analysis
  direction TEXT NOT NULL CHECK (direction IN ('Buy', 'Sell', 'Wait')),
  confidence TEXT NOT NULL CHECK (confidence IN ('High', 'Medium', 'Low')),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High')),
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  outcome TEXT CHECK (outcome IN ('Win', 'Loss')), -- null until feedback provided
  outcome_updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security (for future user authentication)
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Allow public access for now (can be restricted later with user auth)
CREATE POLICY "Anyone can view predictions" 
ON public.predictions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert predictions" 
ON public.predictions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update predictions" 
ON public.predictions 
FOR UPDATE 
USING (true);

-- Create index for performance
CREATE INDEX idx_predictions_created_at ON public.predictions(created_at DESC);
CREATE INDEX idx_predictions_outcome ON public.predictions(outcome) WHERE outcome IS NOT NULL;