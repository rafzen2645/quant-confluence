import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Clock, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PredictionData } from "./PredictionResult";

interface StoredPrediction {
  id: string;
  direction: string;
  confidence: string;
  risk_level: string;
  reason: string;
  created_at: string;
  outcome: string | null;
  chart_features: any;
}

interface PredictionHistoryProps {
  currentPrediction: PredictionData | null;
}

export const PredictionHistory = ({ currentPrediction }: PredictionHistoryProps) => {
  const [predictions, setPredictions] = useState<StoredPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setPredictions(data || []);
    } catch (error) {
      console.error('Error loading predictions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOutcome = async (predictionId: string, outcome: 'Win' | 'Loss') => {
    try {
      const { error } = await supabase
        .from('predictions')
        .update({ 
          outcome,
          outcome_updated_at: new Date().toISOString()
        })
        .eq('id', predictionId);

      if (error) throw error;

      // Update local state
      setPredictions(prev => 
        prev.map(p => 
          p.id === predictionId 
            ? { ...p, outcome }
            : p
        )
      );

      toast({
        title: "Outcome Recorded",
        description: `Marked prediction as ${outcome}. AI will learn from this.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update outcome.",
        variant: "destructive"
      });
    }
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'Buy': return <TrendingUp className="w-4 h-4" />;
      case 'Sell': return <TrendingDown className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'Buy': return 'text-trading-bull';
      case 'Sell': return 'text-trading-bear';
      default: return 'text-trading-neutral';
    }
  };

  const getWinRate = () => {
    const predictionsWithOutcome = predictions.filter(p => p.outcome);
    if (predictionsWithOutcome.length === 0) return null;
    const wins = predictionsWithOutcome.filter(p => p.outcome === 'Win').length;
    return Math.round((wins / predictionsWithOutcome.length) * 100);
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-card border-border/50 shadow-trading">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary animate-spin" />
            <h3 className="text-lg font-semibold">Loading History...</h3>
          </div>
        </div>
      </Card>
    );
  }

  const winRate = getWinRate();

  return (
    <Card className="bg-gradient-card border-border/50 shadow-trading">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Prediction Memory</h3>
          {winRate !== null && (
            <Badge className={cn(
              "text-sm",
              winRate >= 70 ? "bg-trading-bull/20 text-trading-bull border-trading-bull/30" :
              winRate >= 50 ? "bg-trading-warning/20 text-trading-warning border-trading-warning/30" :
              "bg-trading-bear/20 text-trading-bear border-trading-bear/30"
            )}>
              Win Rate: {winRate}%
            </Badge>
          )}
        </div>

        {predictions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No predictions yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {predictions.map((prediction) => (
              <div 
                key={prediction.id}
                className={cn(
                  "p-4 rounded-lg border transition-all",
                  currentPrediction?.id === prediction.id 
                    ? "border-primary/50 bg-primary/5" 
                    : "border-border/50 bg-accent/30"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={getDirectionColor(prediction.direction)}>
                      {getDirectionIcon(prediction.direction)}
                    </span>
                    <span className={cn("font-medium", getDirectionColor(prediction.direction))}>
                      {prediction.direction}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {prediction.confidence}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {new Date(prediction.created_at).toLocaleTimeString()}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {prediction.reason}
                </p>

                {!prediction.outcome && currentPrediction?.id !== prediction.id ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateOutcome(prediction.id, 'Win')}
                      className="flex-1 text-xs h-7"
                    >
                      <CheckCircle className="w-3 h-3 mr-1 text-trading-bull" />
                      Win
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateOutcome(prediction.id, 'Loss')}
                      className="flex-1 text-xs h-7"
                    >
                      <XCircle className="w-3 h-3 mr-1 text-trading-bear" />
                      Loss
                    </Button>
                  </div>
                ) : prediction.outcome ? (
                  <div className="flex items-center gap-1">
                    {prediction.outcome === 'Win' ? (
                      <CheckCircle className="w-4 h-4 text-trading-bull" />
                    ) : (
                      <XCircle className="w-4 h-4 text-trading-bear" />
                    )}
                    <span className={cn(
                      "text-xs font-medium",
                      prediction.outcome === 'Win' ? "text-trading-bull" : "text-trading-bear"
                    )}>
                      {prediction.outcome}
                    </span>
                  </div>
                ) : currentPrediction?.id === prediction.id ? (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Awaiting outcome...</span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};